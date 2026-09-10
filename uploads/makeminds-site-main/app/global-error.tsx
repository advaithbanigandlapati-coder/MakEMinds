"use client";

/*
  Last-resort error boundary. Next renders this when the root layout
  itself throws (which would also kill the regular error.tsx). Has to
  include its own <html>/<body> because the layout isn't available.

  Bare HTML/CSS only — no design tokens, since globals.css may not have
  loaded if the layout faulted.
*/

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#050506",
          color: "#e7e7ea",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: 560 }}>
          <p
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#ff6b35",
              margin: 0,
            }}
          >
            [err · root] application faulted
          </p>
          <h1
            style={{
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              fontFamily:
                "system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif",
              fontWeight: 700,
              letterSpacing: 0,
              marginTop: "1rem",
            }}
          >
            MakEMinds Robotics is temporarily down.
          </h1>
          <p style={{ marginTop: "1rem", color: "#8b8b8e", lineHeight: 1.6 }}>
            Email{" "}
            <a href="mailto:info@makemindsrobotics.org" style={{ color: "#649dc7" }}>
              info@makemindsrobotics.org
            </a>{" "}
            and we&apos;ll be in touch.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 1.25rem",
              background: "transparent",
              color: "#649dc7",
              border: "1px solid #649dc7",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              cursor: "pointer",
            }}
          >
            retry →
          </button>
        </div>
      </body>
    </html>
  );
}
