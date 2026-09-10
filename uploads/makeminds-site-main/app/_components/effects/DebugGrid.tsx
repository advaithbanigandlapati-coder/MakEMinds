"use client";

/*
  ?debug=1 → on-screen 12-column grid + element box-model outlines.
  PLAN §7 easter egg. Useful for spot-checking layout drift in prod.
*/

import { useEffect, useState } from "react";

export default function DebugGrid() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    // One-shot read of the URL on mount. The grid is a debug tool; we don't
    // need to react to pushState changes (full reload toggles it).
    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOn(params.get("debug") === "1");
  }, []);

  if (!on) return null;

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[180] mx-auto grid max-w-[1440px] grid-cols-12 gap-0 px-6 md:px-12 lg:px-20"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-full border-r border-warn/30 bg-warn/[0.04]"
          />
        ))}
      </div>
      <div className="pointer-events-none fixed bottom-4 right-4 z-[181] border border-warn px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-warn">
        debug · grid · ?debug=1
      </div>
      <style>{`
        body.mm-debug * {
          outline: 1px solid rgba(255, 107, 53, 0.18);
        }
      `}</style>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.body.classList.add('mm-debug');`,
        }}
      />
    </>
  );
}
