import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: "https://makemindsrobotics.org/sitemap.xml",
    host: "https://makemindsrobotics.org",
  };
}
