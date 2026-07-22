# AI Signal Newsroom

一个自动更新的国内外 AI 新闻看板。GitHub Actions 每 8 小时抓取 RSS、Atom、GitHub Releases 和 arXiv，按北京时间筛选当天内容，去重后发布到 GitHub Pages。

## 在线地址

<https://zhonghongwei668-png.github.io/ai-signal-newsroom/>

## 自动化流程

工作流位于 `.github/workflows/update-news.yml`，在北京时间每天 `00:15`、`08:15`、`16:15` 自动运行，也支持在 GitHub Actions 页面手动触发。

每次运行会：

1. 并行读取配置的新闻源；
2. 将发布时间统一换算为北京时间，只保留当天内容；
3. 过滤非 AI 内容、清理追踪参数并合并重复事件；
4. 尽量平衡国内与海外新闻，并限制单一来源占比，最多保留 40 条；
5. 更新 `app/generated-news.json` 并记录到 Git 历史；
6. 导出静态网站并部署到 GitHub Pages。

采集流程不依赖 Codex 对话或常驻电脑，也不需要第三方 AI API 密钥。某一个信息源暂时不可用时，其余来源仍会继续更新；失败来源会在下一轮重试。

## 新闻源

来源配置在 `scripts/news_sources.py`，当前覆盖：

- 官方：OpenAI、Google AI、Google DeepMind、NVIDIA；
- 国内媒体：IT之家、雷锋网、cnBeta、少数派；
- 国际媒体：TechCrunch、The Verge、VentureBeat、MIT Technology Review、WIRED；
- 开源社区：Hugging Face、OpenAI/Anthropic SDK、Transformers、MCP Releases；
- 研究：arXiv `cs.AI`、`cs.CL`、`cs.LG`。

原始出处和开源发布标为“已确认”，研究内容标为“专题分析”，媒体信息标为“媒体报道”。自动分类用于整理阅读，不代表对事件真实性的独立背书。

## 本地运行

需要 Node.js 22、pnpm 和 Python 3.12。

```bash
python -m pip install -r scripts/requirements.txt
python scripts/update_news.py
python -m unittest discover -s tests -p 'test_*.py' -v
corepack enable
pnpm install --frozen-lockfile
PAGES_BASE_PATH=/ai-signal-newsroom \
SITE_URL=https://zhonghongwei668-png.github.io/ai-signal-newsroom \
pnpm run test:pages
```

开发预览仍可使用：

```bash
pnpm run dev
```

## 手动更新

进入仓库的 **Actions → Update AI news and deploy Pages → Run workflow**。工作流完成后，Pages 地址会显示本轮最新内容。
