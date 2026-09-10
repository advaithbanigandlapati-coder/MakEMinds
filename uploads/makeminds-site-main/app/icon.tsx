import { ImageResponse } from "next/og";

// Next App Router picks this up automatically as the site favicon (32x32).
// Generated server-side at build time via ImageResponse — no runtime cost
// and no large SVG payload on every tab.
//
// Replace by dropping a brand-finished `icon.png` (or `icon.svg`) into
// app/ alongside this file; that takes precedence.

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050506",
          color: "#649dc7",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: 0,
          fontFamily: "system-ui",
          borderRadius: 4,
        }}
      >
        M
      </div>
    ),
    { ...size },
  );
}
