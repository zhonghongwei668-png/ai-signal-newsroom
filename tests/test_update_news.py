from __future__ import annotations

import sys
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from news_sources import Source  # noqa: E402
from update_news import (  # noqa: E402
    BEIJING,
    Candidate,
    build_snapshot,
    canonical_url,
    deduplicate,
    parse_feed,
    select_balanced,
)


FIXTURES = ROOT / "tests" / "fixtures"
NOW = datetime(2026, 7, 22, 8, 10, tzinfo=BEIJING)


class FeedParsingTests(unittest.TestCase):
    def test_filters_domestic_general_feed_by_beijing_date_and_ai_topic(self) -> None:
        source = Source(
            "domestic-fixture",
            "国内测试源",
            "https://example.cn/feed",
            "国内",
            "国内媒体",
            80,
            False,
        )
        items = parse_feed((FIXTURES / "domestic.xml").read_bytes(), source, NOW)

        self.assertEqual([item.title for item in items], ["国产大模型发布新一代智能体能力"])
        self.assertEqual(items[0].published.strftime("%Y-%m-%d %H:%M"), "2026-07-22 07:30")
        self.assertEqual(items[0].url, "https://example.cn/ai-agent")

    def test_keeps_same_day_entry_from_ai_specific_atom_feed(self) -> None:
        source = Source(
            "global-fixture",
            "Global fixture",
            "https://example.com/feed",
            "海外",
            "国际媒体",
            85,
            True,
        )
        items = parse_feed((FIXTURES / "global.xml").read_bytes(), source, NOW)

        self.assertEqual(len(items), 1)
        self.assertEqual(items[0].published.strftime("%H:%M"), "08:05")
        self.assertEqual(items[0].url, "https://example.com/model-release")

    def test_removes_tracking_parameters_but_keeps_meaningful_query(self) -> None:
        value = canonical_url("https://Example.com/post?a=1&utm_medium=rss&b=2#section")
        self.assertEqual(value, "https://example.com/post?a=1&b=2")


class SelectionTests(unittest.TestCase):
    def candidate(self, title: str, url: str, region: str, score: float) -> Candidate:
        return Candidate(
            title=title,
            summary=title,
            url=url,
            published=NOW - timedelta(minutes=10),
            source_key="fixture",
            source_name="Fixture",
            source_group="国际媒体" if region == "海外" else "国内媒体",
            region=region,
            score=score,
        )

    def test_deduplicates_near_identical_titles(self) -> None:
        candidates = [
            self.candidate("OpenAI releases a new agent model", "https://a.example/1", "海外", 110),
            self.candidate("OpenAI releases new agent model", "https://b.example/2", "海外", 105),
        ]
        self.assertEqual(len(deduplicate(candidates)), 1)

    def test_deduplicates_same_event_with_different_wording(self) -> None:
        candidates = [
            self.candidate("OpenAI says Hugging Face was breached by its pre-release models", "https://a.example/1", "海外", 110),
            self.candidate("OpenAI says it accidentally hacked Hugging Face with a new AI system", "https://b.example/2", "海外", 105),
        ]
        self.assertEqual(len(deduplicate(candidates)), 1)

    def test_balances_domestic_and_overseas_items(self) -> None:
        domestic_topics = ["模型", "芯片", "机器人", "医疗", "教育", "汽车", "科研", "监管", "融资", "开源"]
        global_topics = ["models", "chips", "robotics", "health", "education", "cars", "science", "policy", "funding", "open-source"]
        candidates = [
            self.candidate(f"{topic}领域出现人工智能新进展", f"https://cn.example/{index}", "国内", 120 - index)
            for index, topic in enumerate(domestic_topics)
        ] + [
            self.candidate(f"New AI development in {topic}", f"https://global.example/{index}", "海外", 120 - index)
            for index, topic in enumerate(global_topics)
        ]
        selected = select_balanced(candidates, 15)

        self.assertEqual(len(selected), 15)
        self.assertEqual(sum(item.region == "国内" for item in selected), 7)
        self.assertEqual(sum(item.region == "海外" for item in selected), 8)

    def test_snapshot_contains_next_run_and_scan_statistics(self) -> None:
        item = self.candidate("AI agent model released", "https://example.com/release", "海外", 120)
        snapshot = build_snapshot([item], NOW, successful_sources=17, candidate_count=23, failures=[])

        self.assertEqual(snapshot["boardMeta"]["nextUpdate"], "下一轮 08:15 自动更新")
        self.assertEqual(snapshot["scanStats"]["successfulSources"], 17)
        self.assertEqual(snapshot["newsItems"][0]["level"], "头条")
        self.assertEqual(snapshot["newsItems"][0]["publishedAt"], "08:00")


if __name__ == "__main__":
    unittest.main()
