import { ImageResponse } from "next/og";

// 180x180 PNG returned to iOS / iPadOS for the home-screen "save to
// home" icon. Same generation strategy as icon.tsx — replace by
// dropping `apple-icon.png` into app/ when a brand asset is ready.

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          fontSize: 120,
          fontWeight: 700,
          letterSpacing: 0,
          fontFamily: "system-ui",
        }}
      >
        M
      </div>
    ),
    { ...size },
  );
}
