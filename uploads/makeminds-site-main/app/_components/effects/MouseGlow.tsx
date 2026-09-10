"use client";

/*
  MouseGlow (PLAN §5). Faint --accent glow follows the cursor through hero
  and CTA blocks. Implemented as a fixed, pointer-events:none div that
  tracks the mouse. Opacity capped at ~12%. Disabled on touch / reduced
  motion.

  We mount one global glow; sections that should "receive" it set
  data-glow="on" — the effect's parent is fixed full-viewport but masked
  by a radial gradient that's only visible when a glow-receptive ancestor
  is hovered.
*/

import { useEffect, useRef, useState } from "react";
import { useReducedMotion, useCoarsePointer } from "@/lib/hooks/useMediaQuery";

export default function MouseGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const enabled = !reduced && !coarse;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      const inGlow = !!(e.target as HTMLElement)?.closest?.("[data-glow='on']");
      setVisible(inGlow);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className={
        "pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-out " +
        (visible ? "opacity-100" : "opacity-0")
      }
      style={{
        zIndex: 5,
        width: 800,
        height: 800,
        background:
          "radial-gradient(circle, rgba(100,157,199,0.12) 0%, rgba(100,157,199,0) 60%)",
      }}
    />
  );
}
