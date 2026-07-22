import generatedNews from "./generated-news.json";

export type NewsLevel = "头条" | "重要" | "关注";
export type NewsRegion = "国内" | "海外";
export type Verification = "已确认" | "媒体报道" | "专题分析";

export type NewsItem = {
  id: string;
  level: NewsLevel;
  region: NewsRegion;
  category: string;
  verification: Verification;
  title: string;
  summary: string;
  whyItMatters: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  relativeTime: string;
};

type BoardMeta = {
  generatedAt: string;
  date: string;
  edition: string;
  window: string;
  nextUpdate: string;
};

type ScanStats = {
  configuredSources: number;
  successfulSources: number;
  candidateCount: number;
};

type GeneratedNews = {
  boardMeta: BoardMeta;
  newsItems: NewsItem[];
  trendLines: string[];
  pendingItems: string[];
  scanStats: ScanStats;
};

const snapshot = generatedNews as GeneratedNews;

export const boardMeta = snapshot.boardMeta;
export const newsItems = snapshot.newsItems;
export const trendLines = snapshot.trendLines;
export const pendingItems = snapshot.pendingItems;
export const scanStats = snapshot.scanStats;

export const sourceCoverage = [
  {
    group: "官方与监管",
    sources: "OpenAI · Google AI · Google DeepMind · NVIDIA · 产品博客",
    cadence: "每轮直连",
  },
  {
    group: "国内科技媒体",
    sources: "IT之家 · 雷锋网 · cnBeta · 少数派",
    cadence: "滚动扫描",
  },
  {
    group: "国际主流媒体",
    sources: "TechCrunch · The Verge · VentureBeat · MIT Technology Review",
    cadence: "滚动扫描",
  },
  {
    group: "开源社区",
    sources: "GitHub Releases · Hugging Face · MCP · Model Cards",
    cadence: "每轮扫描",
  },
  {
    group: "研究与论文",
    sources: "arXiv cs.AI / cs.CL / cs.LG · 实验室博客",
    cadence: "每轮扫描",
  },
  {
    group: "资本与产业",
    sources: "公司公告 · 可靠媒体融资线索 · 上市公司披露",
    cadence: "每日追踪",
  },
];
