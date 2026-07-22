# GitHub-hosted AI News Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Execute this plan task-by-task in the current session; no subagent is required for this repository-sized migration.

**Goal:** Move AI Signal from Codex-triggered updates to a self-contained GitHub repository that gathers news and deploys GitHub Pages every eight hours.

**Architecture:** A Python collector reads configured RSS/Atom feeds, filters entries to the current Asia/Shanghai day, scores and deduplicates them, then writes a typed JSON snapshot consumed by the existing React page. A single GitHub Actions workflow runs the collector, tests it, exports the Next.js site, stores the refreshed snapshot in Git history, and deploys the static output to GitHub Pages.

**Tech Stack:** Python 3.12, feedparser, Next.js 16 static export, React 19, GitHub Actions, GitHub Pages.

---

### Task 1: Separate generated news from presentation code

**Files:**
- Create: `app/generated-news.json`
- Modify: `app/news-data.ts`
- Modify: `app/layout.tsx`

- [ ] Move mutable metadata, stories, trend lines, and pending checks into `app/generated-news.json`.
- [ ] Keep TypeScript types and the visible source-coverage catalogue in `app/news-data.ts`.
- [ ] Replace request-header metadata generation with static metadata so the route can be exported.
- [ ] Run `pnpm exec tsc --noEmit`; expect exit code 0.

### Task 2: Implement the feed collector

**Files:**
- Create: `scripts/news_sources.py`
- Create: `scripts/update_news.py`
- Create: `scripts/requirements.txt`
- Create: `tests/fixtures/domestic.xml`
- Create: `tests/fixtures/global.xml`
- Create: `tests/test_update_news.py`

- [ ] Define official, domestic-media, international-media, open-source, and research Atom/RSS sources with explicit region and trust metadata.
- [ ] Parse feed dates as UTC and convert them to `Asia/Shanghai` before applying the same-day rule.
- [ ] Filter general feeds with bilingual AI keywords, retain AI-specific feeds without keyword loss, remove tracking parameters, and reject entries without a usable timestamp or URL.
- [ ] Deduplicate normalized titles, balance domestic and overseas coverage, cap the result at 15 items, and write deterministic UTF-8 JSON.
- [ ] Generate category, verification label, importance, Chinese “why it matters” text, board edition, update window, and next scheduled run.
- [ ] Run `python -m unittest discover -s tests -p 'test_*.py' -v`; expect all fixture tests to pass.

### Task 3: Add a GitHub Pages build target

**Files:**
- Modify: `next.config.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Replace: `tests/rendered-html.test.mjs`

- [ ] Configure `output: "export"`, trailing slashes, unoptimized images, and a repository base path supplied by `PAGES_BASE_PATH`.
- [ ] Add `build:pages`, `test:collector`, and `test:pages` scripts while preserving the local vinext workflow.
- [ ] Test the exported HTML for the headline, source radar, and generated story count.
- [ ] Run `PAGES_BASE_PATH=/ai-signal-newsroom pnpm run test:pages`; expect `out/index.html` and hashed assets to exist.

### Task 4: Automate refresh and deployment

**Files:**
- Create: `.github/workflows/update-news.yml`

- [ ] Trigger on manual dispatch, pushes to `main`, and `0 0,8,16 * * *` UTC, corresponding to 08:00, 16:00, and 00:00 in Beijing.
- [ ] Grant only `contents: write`, `pages: write`, and `id-token: write`; serialize runs with one Pages concurrency group.
- [ ] Install Python and Node, update the snapshot, run collector and Pages tests, commit only `app/generated-news.json` when it changes, upload `out`, and deploy through the `github-pages` environment.
- [ ] Validate the workflow with `actionlint` when available and `pnpm run test:pages` locally.

### Task 5: Publish and verify

**Files:**
- Modify: `README.md`

- [ ] Document the architecture, schedule, source policy, local commands, and manual-run procedure.
- [ ] Create the public repository `zhonghongwei668-png/ai-signal-newsroom`, configure it as the local `origin`, and push `main`.
- [ ] Enable GitHub Pages with GitHub Actions as the build source.
- [ ] Run the workflow manually and follow its checks until the Pages deployment succeeds.
- [ ] Open the production URL and verify it shows the current Beijing date and a non-empty source-backed story list.
