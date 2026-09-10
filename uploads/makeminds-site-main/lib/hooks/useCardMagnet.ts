"use client";

import { useEffect, type RefObject } from "react";

/*
  Card cursor magnet (PLAN §5). Within `range` px of the cursor, the
  element translates `pull` px toward the cursor with a soft spring.
  Outside the range it lerps back to (0, 0). No-op on touch or
  reduced-motion. Cheap rAF loop; one shared loop per component.

  The effect uses inline transforms via the ref; consumers should NOT
  apply a separate transform to the same element or it'll fight.
*/

type Options = {
  range?: number; // distance in px to start pulling, default 80
  pull?: number; // max translation in px, default 6
  damping?: number; // 0–1, default 0.18 (~spring 18)
};

export function useCardMagnet(
  ref: RefObject<HTMLElement | null>,
  { range = 80, pull = 6, damping = 0.18 }: Options = {},
) {
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let rafId = 0;
    let active = true;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const closest = Math.min(r.width, r.height) / 2;
      const reach = closest + range;
      if (dist > reach) {
        targetX = 0;
        targetY = 0;
        return;
      }
      const strength = 1 - dist / reach;
      targetX = (dx / reach) * pull * strength * 2;
      targetY = (dy / reach) * pull * strength * 2;
    };

    const tick = () => {
      if (!active) return;
      curX += (targetX - curX) * damping;
      curY += (targetY - curY) * damping;
      el.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`;
      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      active = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      el.style.transform = "";
    };
  }, [ref, range, pull, damping]);
}
