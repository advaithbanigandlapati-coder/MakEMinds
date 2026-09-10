/*
  Shared OG image template. Per-route opengraph-image.tsx files import
  this and pass their own title + meta strip. Keeps the brand look in
  lockstep across every share preview.
*/

import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

type Args = {
  // One- or two-line title, e.g. ["MAKEMINDS", "ROBOTICS"] or ["ROBOT"].
  title: string | string[];
  meta?: string; // e.g. "FTC TEAM 23786 · TEAM"
  accent?: string; // hex
};

export function renderOg({ title, meta = "FTC TEAM 23786", accent = "#649dc7" }: Args) {
  const lines = Array.isArray(title) ? title : [title];
  const longest = Math.max(...lines.map((l) => l.length));
  const fontSize = longest > 14 ? "120px" : "180px";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px",
          backgroundColor: "#050506",
          color: "#e8eef4",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "999px",
              border: "1px solid #1a2028",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: accent,
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            M
          </div>
          <span style={{ fontSize: "20px", letterSpacing: "0.2em", color: "#8090a4" }}>
            {meta}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize,
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: 0,
          }}
        >
          {lines.map((line, i) => (
            <div key={i} style={{ display: "flex" }}>
              {line}
              {i === lines.length - 1 ? (
                <span style={{ color: accent }}>.</span>
              ) : null}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "18px",
            color: "#8090a4",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <span>EDISON · NJ · USA</span>
          <span>makemindsrobotics.org</span>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
