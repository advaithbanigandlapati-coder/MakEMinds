"use client";

/*
  Devtools console banner (PLAN §7). Prints once on mount, in dev or prod.
  Wrapped in client component because it touches console.* which we don't
  want firing during server prerender.
*/

import { useEffect } from "react";

const BANNER = `
              MAKEMINDS
              ROBOTICS
              FTC 23786
              EDISON · NJ

  ──────────────────────────────────────
  built by the team · 2026 rebuild
  recruiting · info@makemindsrobotics.org
  ──────────────────────────────────────
`;

export default function ConsoleBanner() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as unknown as { __mm_banner__?: boolean };
    if (w.__mm_banner__) return;
    w.__mm_banner__ = true;
    console.log(
      "%c" + BANNER,
      "color: #649dc7; font-family: ui-monospace, monospace; line-height: 1.4;",
    );
    console.log(
      "%cTip: ↑↑↓↓←→←→BA",
      "color: #8090a4; font-family: ui-monospace, monospace; font-size: 11px;",
    );
  }, []);
  return null;
}
