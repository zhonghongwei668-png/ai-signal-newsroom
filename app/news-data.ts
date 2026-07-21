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

export const boardMeta = {
  generatedAt: "2026-07-21 15:02",
  date: "2026年7月21日 · 星期二",
  edition: "午后版",
  window: "北京时间今日 00:00 至 15:02",
  nextUpdate: "下一轮 16:00 自动更新",
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
    id: "waic-2026-industry-trends",
    level: "重要",
    region: "国内",
    category: "产业趋势",
    verification: "专题分析",
    title: "WAIC 2026 收官：AI 竞赛重心转向 Agent、具身智能与国产算力",
    summary:
      "智东西在走访 500 多个展位后归纳出 15 条趋势：AI 手机从功能叠加走向原生智能体，机器人开始追求真实场景交付，国产算力从单卡性能转向超节点与集群能力。",
    whyItMatters:
      "这份一线复盘把密集发布会压缩成产业方向图。国内 AI 的评价标准，正在从参数和演示转向成本、可靠性与规模化交付。",
    source: "智东西 / 36氪",
    sourceUrl: "https://36kr.com/p/3904188372485763",
    publishedAt: "07:48",
    relativeTime: "7 小时前",
  },
  {
    id: "fable-jacobian-counterexample",
    level: "重要",
    region: "国内",
    category: "AI for Science",
    verification: "媒体报道",
    title: "Anthropic 模型被指协助找到雅可比猜想反例",
    summary:
      "机器之心报道，Anthropic 数学家 Levent Alpoge 公布了一个由 Claude Fable 5 协助发现的三维多项式反例，多位数学家已进行数值复算，但结果尚未经过正式同行评审。",
    whyItMatters:
      "如果最终成立，这会成为通用模型参与开放数学问题的醒目标志；目前更重要的是分清“社区复算通过”与“学界正式确认”的距离。",
    source: "机器之心 / 36氪",
    sourceUrl: "https://36kr.com/p/3904017130210950",
    publishedAt: "09:50",
    relativeTime: "5 小时前",
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
    id: "sensortower-ai-app-report-2026",
    level: "关注",
    region: "国内",
    category: "行业报告",
    verification: "专题分析",
    title: "Sensor Tower：上半年生成式 AI 应用使用时长预计翻倍",
    summary:
      "Sensor Tower 发布 2026 年 AI 应用市场洞察：上半年全球生成式 AI 应用总使用时长预计达到 360 亿小时；AI 助手也在加速进入购物决策、内容发现和广告投放链路。",
    whyItMatters:
      "竞争不再只看模型榜单，而是看分发、留存、导购与商业化。AI 正从独立应用变成互联网产品的底层交互入口。",
    source: "Sensor Tower / 36氪",
    sourceUrl: "https://36kr.com/p/3904793158977413",
    publishedAt: "10:59",
    relativeTime: "4 小时前",
  },
  {
    id: "robosense-e2-physical-ai",
    level: "关注",
    region: "国内",
    category: "具身智能",
    verification: "已确认",
    title: "速腾聚创发布第二代全固态感知平台 E2",
    summary:
      "RoboSense 速腾聚创发布基于自研“孔雀”SPAD-SoC 芯片的全固态感知平台 E2，希望把激光雷达从导航部件扩展为物理 AI 的高精度三维数据入口。",
    whyItMatters:
      "具身模型缺的往往不是更多二维图像，而是稳定、可复用的真实空间数据。传感器厂商正在争夺机器人数据闭环的基础设施位置。",
    source: "36氪 · 最前线",
    sourceUrl: "https://36kr.com/p/3903885834028931",
    publishedAt: "09:05",
    relativeTime: "5 小时前",
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

export const sourceCoverage = [
  {
    group: "官方与监管",
    sources: "企业公告 · 政府文件 · 产品博客",
    cadence: "实时核验",
  },
  {
    group: "国内科技媒体",
    sources: "36氪 · 机器之心 · 量子位 · 智东西 · IT之家 · 界面",
    cadence: "滚动扫描",
  },
  {
    group: "国际主流媒体",
    sources: "Reuters · AP · FT · Bloomberg · TechCrunch · The Verge",
    cadence: "滚动扫描",
  },
  {
    group: "开源社区",
    sources: "GitHub Releases · Hugging Face · MCP · Model Cards",
    cadence: "每轮扫描",
  },
  {
    group: "研究与论文",
    sources: "arXiv · 实验室博客 · 会议论文 · 研究机构报告",
    cadence: "每日追踪",
  },
  {
    group: "资本与产业",
    sources: "公司融资公告 · 交易所公告 · 创投数据库线索",
    cadence: "每日追踪",
  },
];

export const trendLines = [
  "版权成本开始兑现：数据来源合规正在成为模型公司的硬成本。",
  "AI 竞争从参数扩张转向推理能效、真实场景与全栈交付。",
  "Agent 与物理 AI 同时补基础设施：协议、支付、感知和数据闭环。",
];

export const pendingItems = [
  "Google Frozen v2 芯片仍属媒体爆料，量产时间与性能目标尚未获官方确认。",
  "Claude Fable 5 协助找到的雅可比猜想反例已获社区复算，但仍待正式论文与同行评审。",
];
