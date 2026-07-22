#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
import re
import sys
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from datetime import datetime, time, timedelta, timezone
from difflib import SequenceMatcher
from pathlib import Path
from typing import Iterable
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

import feedparser
import requests

from news_sources import SOURCES, Source


BEIJING = timezone(timedelta(hours=8))
ROOT = Path(__file__).resolve().parents[1]
OUTPUT_PATH = ROOT / "app" / "generated-news.json"
USER_AGENT = "AI-Signal-Newsroom/1.0 (+https://github.com/zhonghongwei668-png/ai-signal-newsroom)"
TRACKING_KEYS = {
    "fbclid",
    "gclid",
    "mc_cid",
    "mc_eid",
    "ref",
    "source",
    "spm",
}
AI_TERMS = (
    "人工智能",
    "生成式",
    "大模型",
    "语言模型",
    "多模态",
    "智能体",
    "具身智能",
    "机器学习",
    "深度学习",
    "神经网络",
    "机器人",
    "算力",
    "英伟达",
    "openai",
    "anthropic",
    "claude",
    "chatgpt",
    "gemini",
    "deepmind",
    "deepseek",
    "qwen",
    "kimi",
    "minimax",
    "mistral",
    "hugging face",
    "machine learning",
    "language model",
    "neural network",
    "generative ai",
    "ai agent",
    "robotics",
)
AI_WORD_RE = re.compile(r"\b(?:ai|llm|gpu|mcp|tpu)\b", re.IGNORECASE)
TAG_RE = re.compile(r"<[^>]+>")
SPACE_RE = re.compile(r"\s+")
TITLE_PUNCT_RE = re.compile(r"[^0-9a-z\u4e00-\u9fff]+")
ENGLISH_TOKEN_RE = re.compile(r"[a-z0-9]+")
TOKEN_STOPWORDS = {
    "a",
    "ai",
    "an",
    "and",
    "by",
    "for",
    "from",
    "in",
    "into",
    "is",
    "it",
    "its",
    "new",
    "of",
    "on",
    "says",
    "the",
    "to",
    "with",
    "was",
}
TOKEN_ALIASES = {
    "hacked": "breach",
    "hack": "breach",
    "breached": "breach",
    "breaches": "breach",
    "models": "model",
    "released": "release",
    "releases": "release",
    "launched": "launch",
    "launches": "launch",
    "acquired": "acquire",
    "acquires": "acquire",
}


@dataclass
class Candidate:
    title: str
    summary: str
    url: str
    published: datetime
    source_key: str
    source_name: str
    source_group: str
    region: str
    score: float


def current_beijing_time() -> datetime:
    overridden = os.getenv("NEWS_NOW")
    if overridden:
        parsed = datetime.fromisoformat(overridden)
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=BEIJING)
        return parsed.astimezone(BEIJING)
    return datetime.now(BEIJING)


def clean_text(value: str | None, limit: int = 280) -> str:
    if not value:
        return ""
    text = TAG_RE.sub(" ", value)
    text = SPACE_RE.sub(" ", html.unescape(text)).strip()
    if len(text) <= limit:
        return text
    return text[: limit - 1].rstrip("，,。.;；:： ") + "…"


def canonical_url(value: str) -> str:
    parts = urlsplit(value.strip())
    query = [
        (key, item)
        for key, item in parse_qsl(parts.query, keep_blank_values=True)
        if not key.lower().startswith("utm_") and key.lower() not in TRACKING_KEYS
    ]
    return urlunsplit((parts.scheme, parts.netloc.lower(), parts.path, urlencode(query), ""))


def parse_entry_time(entry: feedparser.FeedParserDict) -> datetime | None:
    parsed = entry.get("published_parsed") or entry.get("updated_parsed")
    if not parsed:
        return None
    return datetime(*parsed[:6], tzinfo=timezone.utc).astimezone(BEIJING)


def entry_summary(entry: feedparser.FeedParserDict) -> str:
    value = entry.get("summary") or entry.get("description")
    if not value and entry.get("content"):
        value = entry.content[0].get("value", "")
    return clean_text(value)


def is_ai_related(title: str, summary: str) -> bool:
    text = f"{title} {summary}".casefold()
    return any(term in text for term in AI_TERMS) or bool(AI_WORD_RE.search(text))


def impact_bonus(title: str, summary: str) -> int:
    text = f"{title} {summary}".casefold()
    high_impact = (
        "发布",
        "推出",
        "开源",
        "融资",
        "收购",
        "监管",
        "lawsuit",
        "launch",
        "release",
        "raises",
        "acquire",
        "regulation",
        "breakthrough",
    )
    return min(12, sum(3 for word in high_impact if word in text))


def candidate_from_entry(
    entry: feedparser.FeedParserDict,
    source: Source,
    now: datetime,
) -> Candidate | None:
    title = clean_text(entry.get("title"), 180)
    url = canonical_url(entry.get("link", ""))
    published = parse_entry_time(entry)
    summary = entry_summary(entry)
    if not title or not url or not published:
        return None
    if published.date() != now.date():
        return None
    if not source.ai_specific and not is_ai_related(title, summary):
        return None
    age_hours = max(0.0, (now - published).total_seconds() / 3600)
    recency = max(0.0, 24.0 - age_hours)
    score = source.priority + recency + impact_bonus(title, summary)
    return Candidate(
        title=title,
        summary=summary or f"{title}。",
        url=url,
        published=published,
        source_key=source.key,
        source_name=source.name,
        source_group=source.group,
        region=source.region,
        score=score,
    )


def parse_feed(content: bytes | str, source: Source, now: datetime) -> list[Candidate]:
    parsed = feedparser.parse(content)
    return [
        candidate
        for entry in parsed.entries
        if (candidate := candidate_from_entry(entry, source, now)) is not None
    ]


def fetch_source(source: Source, now: datetime) -> tuple[list[Candidate], str | None]:
    try:
        response = requests.get(
            source.url,
            headers={"User-Agent": USER_AGENT, "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml, */*"},
            timeout=20,
        )
        response.raise_for_status()
        return parse_feed(response.content, source, now), None
    except Exception as exc:  # A broken source must not block the remaining sources.
        return [], f"{source.name}: {exc.__class__.__name__}"


def normalize_title(title: str) -> str:
    return TITLE_PUNCT_RE.sub("", title.casefold())


def title_tokens(title: str) -> set[str]:
    tokens = (TOKEN_ALIASES.get(token, token) for token in ENGLISH_TOKEN_RE.findall(title.casefold()))
    return {token for token in tokens if token not in TOKEN_STOPWORDS and len(token) > 1}


def titles_match(left: str, right: str) -> bool:
    left_normalized = normalize_title(left)
    right_normalized = normalize_title(right)
    if left_normalized == right_normalized:
        return True
    if (
        min(len(left_normalized), len(right_normalized)) >= 18
        and SequenceMatcher(None, left_normalized, right_normalized).ratio() >= 0.9
    ):
        return True
    left_tokens = title_tokens(left)
    right_tokens = title_tokens(right)
    if not left_tokens or not right_tokens:
        return False
    intersection = len(left_tokens & right_tokens)
    overlap = intersection / min(len(left_tokens), len(right_tokens))
    return intersection >= 3 and overlap >= 0.6


def deduplicate(candidates: Iterable[Candidate]) -> list[Candidate]:
    result: list[Candidate] = []
    existing_titles: list[str] = []
    seen_urls: set[str] = set()
    for candidate in sorted(candidates, key=lambda item: (-item.score, -item.published.timestamp())):
        if candidate.url in seen_urls:
            continue
        if any(titles_match(candidate.title, existing) for existing in existing_titles):
            continue
        result.append(candidate)
        existing_titles.append(candidate.title)
        seen_urls.add(candidate.url)
    return result


def select_balanced(candidates: Iterable[Candidate], limit: int = 15) -> list[Candidate]:
    ranked = deduplicate(candidates)
    domestic = [item for item in ranked if item.region == "国内"]
    overseas = [item for item in ranked if item.region == "海外"]
    selected = domestic[:7] + overseas[:8]
    selected_urls = {item.url for item in selected}
    if len(selected) < limit:
        selected.extend(item for item in ranked if item.url not in selected_urls)
    return sorted(selected[:limit], key=lambda item: (-item.score, -item.published.timestamp()))


def categorize(candidate: Candidate) -> str:
    text = f"{candidate.title} {candidate.summary}".casefold()
    rules = (
        ("政策监管", ("监管", "法规", "版权", "诉讼", "policy", "regulation", "copyright", "lawsuit")),
        ("融资", ("融资", "估值", "收购", "完成投资", "funding", "fundraise", "valuation", "series a", "series b", "acquire", "acquisition")),
        ("芯片算力", ("芯片", "算力", "英伟达", "gpu", "tpu", "semiconductor", "chip")),
        ("具身智能", ("具身", "机器人", "physical ai", "robot")),
        ("Agent", ("智能体", "agent", "mcp")),
        ("研究论文", ("论文", "研究", "arxiv", "benchmark", "research")),
        ("大模型", ("大模型", "语言模型", "openai", "claude", "gemini", "deepseek", "qwen", "llm", "model")),
    )
    for category, keywords in rules:
        if any(keyword in text for keyword in keywords):
            return category
    return "产品动态"


WHY_IT_MATTERS = {
    "政策监管": "监管与司法判例会直接改变模型训练、产品上线和企业合规成本。",
    "融资": "资金流向反映市场正在为哪些 AI 能力与商业模式下注。",
    "芯片算力": "算力供给、能效与成本决定模型能否稳定地走向规模化应用。",
    "具身智能": "AI 正从屏幕进入真实世界，可靠感知和长期执行能力成为关键门槛。",
    "Agent": "智能体能否连接工具并稳定完成任务，决定 AI 从回答问题走向交付结果的速度。",
    "研究论文": "新研究可能改变模型能力边界，但仍需要复现、评测与同行检验。",
    "大模型": "基础模型能力、价格和开放策略的变化，会迅速传导到整个应用生态。",
    "产品动态": "新产品与功能展示了 AI 能力进入实际工作流的最新路径。",
}


def verification(candidate: Candidate) -> str:
    if candidate.source_group in {"官方", "开源社区"}:
        return "已确认"
    if candidate.source_group == "研究论文":
        return "专题分析"
    return "媒体报道"


def relative_time(published: datetime, now: datetime) -> str:
    minutes = max(0, int((now - published).total_seconds() // 60))
    if minutes < 60:
        return f"{max(1, minutes)} 分钟前"
    return f"{minutes // 60} 小时前"


def next_run(now: datetime) -> datetime:
    for hour in (0, 8, 16):
        candidate = datetime.combine(now.date(), time(hour, 15), BEIJING)
        if candidate > now:
            return candidate
    return datetime.combine(now.date() + timedelta(days=1), time(0, 15), BEIJING)


def edition_for(hour: int) -> str:
    if hour < 8:
        return "清晨版"
    if hour < 12:
        return "上午版"
    if hour < 18:
        return "午后版"
    return "夜间版"


def weekday_cn(value: datetime) -> str:
    return "星期" + "一二三四五六日"[value.weekday()]


def trend_lines(items: list[Candidate]) -> list[str]:
    counts = Counter(categorize(item) for item in items)
    templates = {
        "大模型": "大模型仍是今日高频主线，能力、价格与生态策略持续变化。",
        "Agent": "Agent 基础设施和产品落地同步推进，行业更关注任务完成率。",
        "具身智能": "具身智能继续升温，真实场景数据与可靠执行成为竞争焦点。",
        "芯片算力": "AI 算力竞争继续转向推理能效、供应能力与整体成本。",
        "政策监管": "AI 治理进入更具体的规则与执行阶段，合规边界继续收紧。",
        "融资": "资本继续筛选能够形成收入与基础设施壁垒的 AI 公司。",
        "研究论文": "研究侧出现新的方法与结果，后续复现和评测值得跟进。",
        "产品动态": "AI 产品更新加快，能力正进入更多日常工作流。",
    }
    lines = [templates[category] for category, _ in counts.most_common(3)]
    return lines or ["本轮尚未发现符合当天标准的高质量动态。"]


def build_snapshot(
    selected: list[Candidate],
    now: datetime,
    successful_sources: int,
    candidate_count: int,
    failures: list[str],
) -> dict:
    news_items = []
    for index, candidate in enumerate(selected):
        category = categorize(candidate)
        level = "头条" if index == 0 else ("重要" if candidate.score >= 108 else "关注")
        news_items.append(
            {
                "id": hashlib.sha1(candidate.url.encode("utf-8")).hexdigest()[:14],
                "level": level,
                "region": candidate.region,
                "category": category,
                "verification": verification(candidate),
                "title": candidate.title,
                "summary": candidate.summary,
                "whyItMatters": WHY_IT_MATTERS[category],
                "source": candidate.source_name,
                "sourceUrl": candidate.url,
                "publishedAt": candidate.published.strftime("%H:%M"),
                "relativeTime": relative_time(candidate.published, now),
            }
        )
    following = next_run(now)
    pending = []
    reported = sum(item["verification"] == "媒体报道" for item in news_items)
    if reported:
        pending.append(f"本轮有 {reported} 条来自可靠媒体的报道，后续将继续追踪官方确认。")
    if failures:
        pending.append(f"{len(failures)} 个信息源本轮暂时不可用，系统会在下一轮自动重试。")
    if not pending:
        pending.append("本轮信息源运行正常，媒体爆料仍会在后续更新中持续交叉核验。")
    return {
        "boardMeta": {
            "generatedAt": now.strftime("%Y-%m-%d %H:%M"),
            "date": f"{now.year}年{now.month}月{now.day}日 · {weekday_cn(now)}",
            "edition": edition_for(now.hour),
            "window": f"北京时间今日 00:00 至 {now:%H:%M}",
            "nextUpdate": f"下一轮 {following:%H:%M} 自动更新",
        },
        "newsItems": news_items,
        "trendLines": trend_lines(selected),
        "pendingItems": pending[:2],
        "scanStats": {
            "configuredSources": len(SOURCES),
            "successfulSources": successful_sources,
            "candidateCount": candidate_count,
        },
    }


def write_snapshot(snapshot: dict, output: Path = OUTPUT_PATH) -> None:
    output.write_text(
        json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def collect(now: datetime) -> tuple[list[Candidate], int, list[str]]:
    candidates: list[Candidate] = []
    failures: list[str] = []
    successful = 0
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(fetch_source, source, now): source for source in SOURCES}
        for future in as_completed(futures):
            items, error = future.result()
            if error:
                failures.append(error)
            else:
                successful += 1
                candidates.extend(items)
    return candidates, successful, sorted(failures)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Refresh AI Signal's same-day news snapshot.")
    parser.add_argument("--output", type=Path, default=OUTPUT_PATH)
    args = parser.parse_args(argv)
    now = current_beijing_time()
    candidates, successful, failures = collect(now)
    selected = select_balanced(candidates)
    if not selected:
        print("No same-day AI news was found; keeping the previously deployed snapshot.", file=sys.stderr)
        return 2
    snapshot = build_snapshot(selected, now, successful, len(candidates), failures)
    write_snapshot(snapshot, args.output)
    domestic = sum(item.region == "国内" for item in selected)
    print(
        f"Updated {args.output}: {len(selected)} stories "
        f"({domestic} domestic, {len(selected) - domestic} overseas), "
        f"{successful}/{len(SOURCES)} sources available."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
