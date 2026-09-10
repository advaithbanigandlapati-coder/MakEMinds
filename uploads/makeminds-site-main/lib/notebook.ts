/*
  Tiny markdown loader for the engineering notebook. We don't pull in a
  full MDX runtime in v1 — the posts are short, structure is predictable.
  This module reads markdown files from content/notebook/ at build time,
  parses YAML-style frontmatter by hand, and renders body via a minimal
  markdown-to-React renderer.

  When the notebook grows beyond ~20 posts or needs code blocks, swap
  this for `next-mdx-remote` or `contentlayer`.
*/

import fs from "node:fs";
import path from "node:path";

export type NotebookPost = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  body: string;
  isPlaceholder: boolean;
};

const DIR = path.join(process.cwd(), "content", "notebook");

function parseFrontmatter(raw: string): { meta: Record<string, unknown>; body: string } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta: Record<string, unknown> = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    const [, key, valRaw] = kv;
    let val: unknown = valRaw.trim();
    if (typeof val === "string") {
      if (val.startsWith("[") && val.endsWith("]")) {
        val = val
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^["']|["']$/g, ""))
          .filter(Boolean);
      } else if (val === "true" || val === "false") {
        val = val === "true";
      } else if (/^-?\d+(\.\d+)?$/.test(val)) {
        val = Number(val);
      } else {
        val = val.replace(/^["']|["']$/g, "");
      }
    }
    meta[key] = val;
  }
  return { meta, body: m[2] };
}

export function listPosts(): NotebookPost[] {
  if (!fs.existsSync(DIR)) return [];
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".md"));
  const posts = files
    .map((f) => loadPost(f.replace(/\.md$/, "")))
    .filter((p): p is NotebookPost => p !== null);
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export function loadPost(slug: string): NotebookPost | null {
  const p = path.join(DIR, `${slug}.md`);
  if (!fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, "utf-8");
  const { meta, body } = parseFrontmatter(raw);
  return {
    slug: typeof meta.slug === "string" ? meta.slug : slug,
    title: typeof meta.title === "string" ? meta.title : slug,
    date: typeof meta.date === "string" ? meta.date : "",
    tags: Array.isArray(meta.tags) ? (meta.tags as string[]) : [],
    excerpt: typeof meta.excerpt === "string" ? meta.excerpt : "",
    body,
    isPlaceholder: meta.__placeholder === true,
  };
}

// Minimal markdown → React. Handles headings (##/###), paragraphs, lists.
// Sufficient for engineering notes; swap for next-mdx-remote when the
// notebook outgrows it.
export type MarkdownBlock =
  | { kind: "heading"; level: 2 | 3; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] };

export function renderMarkdownToTree(md: string): MarkdownBlock[] {
  const lines = md.split("\n");
  const out: MarkdownBlock[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];

  const flushPara = () => {
    if (paragraph.length === 0) return;
    out.push({ kind: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };
  const flushList = () => {
    if (listItems.length === 0) return;
    out.push({ kind: "list", items: listItems });
    listItems = [];
  };

  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      flushPara();
      flushList();
      out.push({ kind: "heading", level: 2, text: line.replace(/^##\s+/, "") });
    } else if (/^###\s+/.test(line)) {
      flushPara();
      flushList();
      out.push({ kind: "heading", level: 3, text: line.replace(/^###\s+/, "") });
    } else if (/^-\s+/.test(line)) {
      flushPara();
      listItems.push(line.replace(/^-\s+/, ""));
    } else if (line.trim() === "") {
      flushPara();
      flushList();
    } else {
      paragraph.push(line.trim());
    }
  }
  flushPara();
  flushList();
  return out;
}
