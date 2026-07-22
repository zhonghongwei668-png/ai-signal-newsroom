import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";


const root = new URL("../", import.meta.url);

test("exports a self-contained GitHub Pages homepage", async () => {
  const html = await readFile(new URL("out/index.html", root), "utf8");

  assert.match(html, /AI Signal｜今日 AI 新闻看板/);
  assert.match(html, /本轮扫描源/);
  assert.match(html, /每 8 小时更新/);
  assert.match(html, /条经筛选的当日动态/);
  assert.doesNotMatch(html, /Your site is taking shape/);
});

test("exports static assets required by the newsroom", async () => {
  await Promise.all([
    access(new URL("out/favicon.svg", root)),
    access(new URL("out/og.png", root)),
    access(new URL("out/_next", root)),
  ]);
});
