/*
  RSS 2.0 feed for /notebook. Plain hand-rolled XML — feedgen-style libs
  would be overkill for ≤20 posts. Returns text/xml with a 1-hour
  Cache-Control. The <head> auto-links it via app/layout.tsx alternates.
*/

import { listPosts } from "@/lib/notebook";

const SITE = "https://makemindsrobotics.org";
const TITLE = "MakEMinds Robotics — Engineering Notebook";
const DESCRIPTION =
  "Short technical posts from FTC Team 23786: build-season notes, post-mortems, design decisions.";

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const dynamic = "force-static";

export async function GET() {
  const posts = listPosts();
  const items = posts
    .map((p) => {
      const url = `${SITE}/notebook/${p.slug}`;
      const pubDate = p.date
        ? new Date(p.date).toUTCString()
        : new Date().toUTCString();
      return [
        "    <item>",
        `      <title>${escape(p.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        p.excerpt ? `      <description>${escape(p.excerpt)}</description>` : "",
        ...p.tags.map((t) => `      <category>${escape(t)}</category>`),
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escape(TITLE)}</title>`,
    `    <link>${SITE}/notebook</link>`,
    `    <description>${escape(DESCRIPTION)}</description>`,
    `    <language>en-us</language>`,
    `    <atom:link href="${SITE}/notebook/feed.xml" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
