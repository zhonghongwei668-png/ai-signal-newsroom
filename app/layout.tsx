import type { Metadata } from "next";
import "./globals.css";

const title = "AI Signal｜今日 AI 新闻看板";
const description = "每 8 小时更新的国内外 AI 新闻看板，只收录当天新发生或新确认的消息。";
const siteUrl = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title,
  description,
  icons: { icon: `${siteUrl}/favicon.svg`, shortcut: `${siteUrl}/favicon.svg` },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "zh_CN",
    images: [{ url: `${siteUrl}/og.png`, width: 1732, height: 908, alt: "AI Signal 今日 AI 新闻看板" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [`${siteUrl}/og.png`] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
