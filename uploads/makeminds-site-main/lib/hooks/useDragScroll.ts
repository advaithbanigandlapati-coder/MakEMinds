"use client";

import { useEffect, type RefObject } from "react";

/*
  Attach pointer-drag horizontal scroll to a container with overflow-x:auto.
  Cursor changes to grab/grabbing. Touch is left to the native scroller.
  PLAN §1.5 marquee uses the same pattern inline; this hook factors it out
  for other scroll-snappy strips (achievements timeline, gallery rows).

  Optionally hijacks vertical wheel input over the container and routes it
  to horizontal scroll (PLAN §3 achievements: "Vertical wheel = horizontal
  page motion"). The hijack releases when the container has scrolled past
  the end in the wheel's direction, so vertical page scroll resumes
  naturally at the edges.
*/

type Options = {
  /** Convert vertical wheel to horizontal scroll over this element. */
  wheelToHorizontal?: boolean;
};

export function useDragScroll(
  ref: RefObject<HTMLElement | null>,
  { wheelToHorizontal = false }: Options = {},
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let dragging = false;
    let startX = 0;
    let startScroll = 0;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.pointerType === "touch") return;
      dragging = true;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
      el.classList.add("mm-dragging");
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      el.scrollLeft = startScroll - (e.clientX - startX);
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      el.releasePointerCapture(e.pointerId);
      el.classList.remove("mm-dragging");
    };

    const onWheel = (e: WheelEvent) => {
      // Trackpad horizontal swipe already produces deltaX — let native
      // handle it. We're only translating *vertical* wheel input.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const cur = el.scrollLeft;
      const atStart = cur <= 0 && e.deltaY < 0;
      const atEnd = cur >= max - 1 && e.deltaY > 0;
      if (atStart || atEnd) return; // let the page scroll vertically
      e.preventDefault();
      el.scrollLeft = cur + e.deltaY;
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    if (wheelToHorizontal) el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      if (wheelToHorizontal) el.removeEventListener("wheel", onWheel);
    };
  }, [ref, wheelToHorizontal]);
}
