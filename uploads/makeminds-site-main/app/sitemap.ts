/*
  Sitemap (PLAN — implicit, but locked target domain is makemindsrobotics.org).
  Pulls page paths from lib/nav so a new entry in NAV automatically lands in the
  sitemap. Notebook slugs come from the markdown loader.
*/

import type { MetadataRoute } from "next";
import { NAV } from "@/lib/nav";
import { listPosts } from "@/lib/notebook";

const BASE = "https://makemindsrobotics.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = NAV.map((n) => ({
    url: `${BASE}${n.href}`,
    lastModified: now,
    changeFrequency: n.href === "/" ? "weekly" : "monthly",
    priority: n.href === "/" ? 1 : 0.7,
  }));

  const posts: MetadataRoute.Sitemap = listPosts().map((p) => ({
    url: `${BASE}/notebook/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : now,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...pages, ...posts];
}
