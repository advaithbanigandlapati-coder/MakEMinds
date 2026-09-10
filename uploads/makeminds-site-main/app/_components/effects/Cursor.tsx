"use client";

/*
  Custom cursor (PLAN §5).
  - 6px filled dot at cursor position
  - 28px ring lagging behind via spring (stiffness/damping match lib/motion)
  - On interactive elements (a, button, [data-cursor=expand]) the ring
    expands to 60px and the dot inverts.
  - Disabled on touch primary (no native cursor anyway) and on
    prefers-reduced-motion.
*/

import { useEffect, useRef, useState } from "react";
import { useReducedMotion, useCoarsePointer } from "@/lib/hooks/useMediaQuery";

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const enabled = !reduced && !coarse;
  const [hovering, setHovering] = useState(false);
  const target = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${e.clientX - 3}px, ${e.clientY - 3}px, 0)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const interactive = el.closest(
        "a, button, [role='button'], input, select, textarea, [data-cursor='expand']",
      );
      setHovering(!!interactive);
    };

    const tick = () => {
      const r = ring.current;
      const t = target.current;
      // Spring lag: about 0.18 per frame for a soft, premium feel.
      r.x += (t.x - r.x) * 0.18;
      r.y += (t.y - r.y) * 0.18;
      const ringEl = ringRef.current;
      if (ringEl) {
        const size = ringEl.classList.contains("mm-cursor-expanded") ? 60 : 28;
        ringEl.style.transform = `translate3d(${r.x - size / 2}px, ${r.y - size / 2}px, 0)`;
      }
      rafRef.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className={
          "pointer-events-none fixed left-0 top-0 z-[150] rounded-full border transition-[width,height,border-color,background-color] duration-150 ease-out " +
          (hovering
            ? "mm-cursor-expanded h-[60px] w-[60px] border-accent bg-accent/10"
            : "h-[28px] w-[28px] border-fg-muted/60")
        }
      />
      <div
        ref={dotRef}
        aria-hidden
        className={
          "pointer-events-none fixed left-0 top-0 z-[151] h-1.5 w-1.5 rounded-full transition-colors " +
          (hovering ? "bg-bg" : "bg-fg")
        }
      />
      <style>{`
        html, body, a, button { cursor: none; }
        @media (pointer: coarse), (prefers-reduced-motion: reduce) {
          html, body, a, button { cursor: auto; }
        }
      `}</style>
    </>
  );
}
