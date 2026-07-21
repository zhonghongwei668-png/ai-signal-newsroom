export type NewsLevel = "头条" | "重要" | "关注";
export type NewsRegion = "国内" | "海外";
export type Verification = "已确认" | "媒体报道";

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

export const boardMeta = {
  generatedAt: "2026-07-21 14:42",
  date: "2026年7月21日 · 星期二",
  edition: "午后版",
  window: "北京时间今日 00:00 至 14:42",
  nextUpdate: "预计 22:42 更新",
};

export const newsItems: NewsItem[] = [
  {
    id: "anthropic-copyright-settlement",
    level: "头条",
    region: "海外",
    category: "版权监管",
    verification: "已确认",
    title: "Anthropic 15 亿美元版权和解获法院最终批准",
    summary:
      "美国联邦法官批准 Anthropic 与作者、出版商达成的集体诉讼和解。约 50 万部作品预计按每部 3,000 美元赔付；法院此前认为模型训练可能属于合理使用，但从盗版网站取得训练资料仍然违法。",
    whyItMatters:
      "AI 版权争议开始从原则讨论进入真实赔付阶段。它给整个行业划出一条关键界线：不只要回答“能不能训练”，还要回答“训练数据从哪里来”。",
    source: "TechCrunch / Reuters",
    sourceUrl:
      "https://techcrunch.com/2026/07/20/anthropics-landmark-1-5b-copyright-settlement-is-approved/",
    publishedAt: "08:12",
    relativeTime: "6 小时前",
  },
  {
    id: "google-frozen-v2-chip",
    level: "重要",
    region: "海外",
    category: "芯片算力",
    verification: "媒体报道",
    title: "Google 被曝研发新一代 Gemini 推理芯片",
    summary:
      "Google 正研发代号 Frozen v2 的服务器芯片。报道称其单位功耗下的 token 生成效率目标是现有芯片的 6—10 倍，可能于 2028 年推出；Google 尚未正式确认量产计划。",
    whyItMatters:
      "前沿模型竞争正转向推理成本与能耗。Google 在强化“模型、芯片、云平台”的垂直整合，同时降低对英伟达的依赖。",
    source: "TechCrunch / The Information",
    sourceUrl:
      "https://techcrunch.com/2026/07/20/google-is-working-on-a-new-ai-chip-designed-to-make-gemini-more-efficient/",
    publishedAt: "05:21",
    relativeTime: "9 小时前",
  },
  {
    id: "caisi-director-resigns",
    level: "重要",
    region: "海外",
    category: "政策监管",
    verification: "已确认",
    title: "美国 AI 标准机构负责人上任约三个月后辞职",
    summary:
      "美国 AI 标准与创新中心 CAISI 主任 Chris Fall 已辞职，官方未公布原因。该机构负责 AI 模型测试方法、技术标准与网络安全风险评估。",
    whyItMatters:
      "美国正在讨论前沿模型测试、中国开源模型与 AI 出口限制，监管机构连续换帅可能影响政策执行的稳定性。",
    source: "TechCrunch / CNBC",
    sourceUrl:
      "https://techcrunch.com/2026/07/20/trumps-latest-ai-czar-has-already-resigned/",
    publishedAt: "06:21",
    relativeTime: "8 小时前",
  },
  {
    id: "mcp-session-update",
    level: "关注",
    region: "海外",
    category: "Agent 基础设施",
    verification: "已确认",
    title: "MCP 即将调整会话机制，面向大规模部署减负",
    summary:
      "Model Context Protocol 下一版本将弱化服务器对会话状态的依赖，让 MCP 服务更容易通过负载均衡进行跨服务器、跨区域部署。",
    whyItMatters:
      "这类底层改动不显眼，却会直接改善企业 Agent 连接邮箱、数据库与内部工具时的稳定性、维护成本和扩展能力。",
    source: "TechCrunch / MCP 官方规范",
    sourceUrl:
      "https://techcrunch.com/2026/07/20/ais-most-important-protocol-is-getting-a-little-bit-easier-to-use/",
    publishedAt: "04:50",
    relativeTime: "10 小时前",
  },
  {
    id: "natural-agent-payments",
    level: "关注",
    region: "海外",
    category: "融资",
    verification: "已确认",
    title: "Natural 获 3,000 万美元融资，押注 AI Agent 支付",
    summary:
      "Natural 完成 3,000 万美元 A 轮融资，累计融资 4,000 万美元。公司希望为 AI Agent 提供储存和移动资金、向人类或其他 Agent 收付款的基础设施。",
    whyItMatters:
      "Agent 要真正完成采购与商业任务，必须跨过授权、支付、争议处理和追责这道门槛。支付基础设施正在成为 Agent 商业化的新战场。",
    source: "TechCrunch",
    sourceUrl:
      "https://techcrunch.com/2026/07/20/natural-raises-30m-to-reinvent-payments-for-ai-agents-and-take-on-stripe/",
    publishedAt: "03:11",
    relativeTime: "11 小时前",
  },
];

export const trendLines = [
  "版权成本开始兑现：数据来源合规正在成为模型公司的硬成本。",
  "算力竞争从峰值性能转向每瓦 token 产出与全栈效率。",
  "Agent 产业继续补齐协议、支付和规模化运行等基础设施。",
];

export const pendingItems = [
  "Google Frozen v2 芯片仍属媒体爆料，量产时间与性能目标尚未获官方确认。",
  "截至本次更新，国内暂无达到头条标准、且在北京时间今天正式官宣的重大新增。",
];
