import path from "node:path";
import type { NextConfig } from "next";

// Baseline security headers. CSP intentionally omitted — we inject inline
// JSON-LD scripts and an IIFE console banner, both of which would need
// nonces/hashes to keep CSP strict-mode. The headers below are pure wins
// with no risk of breaking inline content.
const securityHeaders = [
  // HSTS: 2 years, include subdomains, preloadable. Vercel terminates TLS so
  // this is safe immediately; remove `preload` if a manual cutover happens.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Block iframe embedding entirely. We never intend to be embedded.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable browser features we don't use; reduces fingerprinting surface.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    // Pin workspace root to this project so a sibling lockfile higher
    // up the tree doesn't get auto-detected.
    root: path.resolve(__dirname),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
