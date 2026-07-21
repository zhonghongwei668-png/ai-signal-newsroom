"use client";

import { useMemo, useState } from "react";
import {
  boardMeta,
  newsItems,
  pendingItems,
  trendLines,
  type NewsItem,
} from "./news-data";

const filters = ["全部", "国内", "海外", "模型", "Agent", "芯片", "监管", "融资"];

function matchesFilter(item: NewsItem, filter: string) {
  if (filter === "全部") return true;
  if (filter === "国内" || filter === "海外") return item.region === filter;
  const haystack = `${item.category} ${item.title}`.toLowerCase();
  return haystack.includes(filter.toLowerCase());
}

function ArrowUpRight() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("全部");
  const [query, setQuery] = useState("");

  const visibleNews = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return newsItems.filter((item) => {
      const matchesTab = matchesFilter(item, activeFilter);
      const matchesQuery = !normalizedQuery ||
        `${item.title} ${item.summary} ${item.category}`.toLowerCase().includes(normalizedQuery);
      return matchesTab && matchesQuery;
    });
  }, [activeFilter, query]);

  const lead = visibleNews[0];
  const rest = visibleNews.slice(1);

  return (
    <main>
      <header className="masthead">
        <a className="brand" href="#top" aria-label="AI Signal 首页">
          <span className="brand-mark">AI</span>
          <span className="brand-name">SIGNAL</span>
        </a>
        <div className="masthead-center">
          <span>{boardMeta.date}</span>
          <span className="edition">{boardMeta.edition}</span>
        </div>
        <div className="live-pill"><i /> 每 8 小时更新</div>
      </header>

      <section className="ticker" aria-label="更新时间">
        <span className="ticker-label">最新</span>
        <p>AI 圈实时新闻 · 仅收录今日新发生或新确认事件</p>
        <time>更新于 {boardMeta.generatedAt}</time>
      </section>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">AI NEWSROOM · CHINA & WORLD</p>
          <h1>今天的 AI，<br />只看真正发生的。</h1>
          <p className="hero-intro">
            国内外 AI 新闻统一汇总，逐条核对事件与发布时间。
            不拿昨日旧闻凑数，不把营销稿当新闻。
          </p>
        </div>
        <aside className="brief-card">
          <div className="brief-topline">
            <span>本期速览</span>
            <span>{boardMeta.window}</span>
          </div>
          <div className="brief-number">{newsItems.length}</div>
          <p>条经筛选的当日动态</p>
          <div className="brief-stats">
            <span><strong>4</strong> 已确认</span>
            <span><strong>1</strong> 媒体报道</span>
            <span><strong>5</strong> 海外</span>
          </div>
          <div className="next-update">{boardMeta.nextUpdate}</div>
        </aside>
      </section>

      <section className="controls" aria-label="新闻筛选">
        <div className="filter-row">
          {filters.map((filter) => (
            <button
              className={activeFilter === filter ? "active" : ""}
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <span className="sr-only">搜索新闻</span>
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索今日新闻"
            type="search"
            value={query}
          />
        </label>
      </section>

      {lead ? (
        <section className="newsroom" aria-live="polite">
          <article className="lead-story">
            <div className="lead-index">01</div>
            <div className="lead-content">
              <div className="story-meta">
                <span className="level level-headline">{lead.level}</span>
                <span>{lead.region}</span>
                <span>{lead.category}</span>
                <span className={`verify ${lead.verification === "已确认" ? "confirmed" : "reported"}`}>
                  {lead.verification}
                </span>
              </div>
              <h2>{lead.title}</h2>
              <p className="summary">{lead.summary}</p>
              <div className="why-box">
                <span>为什么重要</span>
                <p>{lead.whyItMatters}</p>
              </div>
              <div className="story-footer">
                <span>北京时间 {lead.publishedAt} · {lead.relativeTime}</span>
                <a href={lead.sourceUrl} rel="noreferrer" target="_blank">
                  {lead.source} <ArrowUpRight />
                </a>
              </div>
            </div>
          </article>

          <div className="story-list">
            {rest.map((item, index) => (
              <article className="story-row" key={item.id}>
                <div className="story-number">{String(index + 2).padStart(2, "0")}</div>
                <div className="story-body">
                  <div className="story-meta">
                    <span className={`level ${item.level === "重要" ? "level-important" : "level-watch"}`}>
                      {item.level}
                    </span>
                    <span>{item.region}</span>
                    <span>{item.category}</span>
                    <span className={`verify ${item.verification === "已确认" ? "confirmed" : "reported"}`}>
                      {item.verification}
                    </span>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <details>
                    <summary>为什么重要</summary>
                    <p>{item.whyItMatters}</p>
                  </details>
                </div>
                <div className="story-source">
                  <time>{item.publishedAt}</time>
                  <span>{item.relativeTime}</span>
                  <a href={item.sourceUrl} rel="noreferrer" target="_blank" aria-label={`阅读 ${item.title} 的来源`}>
                    来源 <ArrowUpRight />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="empty-state">
          <strong>没有匹配的今日新闻</strong>
          <p>换一个筛选条件，或清除搜索关键词。</p>
        </section>
      )}

      <section className="insight-grid">
        <article className="trend-panel">
          <p className="section-kicker">EDITOR&apos;S NOTE</p>
          <h2>今日三条主线</h2>
          <ol>
            {trendLines.map((trend, index) => (
              <li key={trend}>
                <span>0{index + 1}</span>
                <p>{trend}</p>
              </li>
            ))}
          </ol>
        </article>
        <article className="pending-panel">
          <div className="pending-heading">
            <span className="pulse-dot" />
            <p>持续核验中</p>
          </div>
          <h2>待确认动态</h2>
          <ul>
            {pendingItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="policy">
            收录标准：官方公告、政府文件、项目博客、论文原文及可靠媒体。
            爆料一律标注，不确定信息不进入头条。
          </p>
        </article>
      </section>

      <footer>
        <div>
          <span className="brand-mark small">AI</span>
          <strong>AI SIGNAL</strong>
        </div>
        <p>每 8 小时更新 · 北京时间 · 只追踪当天新鲜事</p>
        <a href="#top">返回顶部 ↑</a>
      </footer>
    </main>
  );
}
