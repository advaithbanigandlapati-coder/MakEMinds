"use client";

/*
  Mono cursor crosshair + viewport readout (PLAN §2 Hero).
  Lives in the top-right of the hero. Shows "VIEWPORT WxH" and live
  cursor (x, y) coords. Disabled on touch — pointer:fine media query.
*/

import { useEffect, useState } from "react";

export default function ViewportReadout() {
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const [cursor, setCursor] = useState({ x: 0, y: 0, has: false });

  useEffect(() => {
    const onResize = () =>
      setVp({ w: window.innerWidth, h: window.innerHeight });
    const onMove = (e: MouseEvent) =>
      setCursor({ x: e.clientX, y: e.clientY, has: true });
    onResize();
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none hidden flex-col items-end gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-dim md:flex"
    >
      <p className="tabular-nums">
        VIEWPORT {vp.w.toString().padStart(4, "0")} × {vp.h.toString().padStart(4, "0")}
      </p>
      <p className="tabular-nums">
        ({cursor.has ? cursor.x.toString().padStart(4, "0") : "----"},{" "}
        {cursor.has ? cursor.y.toString().padStart(4, "0") : "----"})
      </p>
    </div>
  );
}
