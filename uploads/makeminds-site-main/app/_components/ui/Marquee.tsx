"use client";

/*
  Scrubbable events marquee (PLAN §1.5).

  Renders children twice in the DOM, animates translateX(0 → -50%) on the
  inner track so the loop is seamless. Linear easing. Default 220s loop.

  Interactions:
  - Pause on hover (CSS class flip, no React state in hot path).
  - Drag horizontally with mouse or touch to scrub at your own pace; resumes
    after release.
  - Trackpad horizontal scroll / shift+wheel scrolls natively because the
    container is overflow-x:auto. While scrolling, animation pauses; it
    resumes 600ms after the last wheel event.
  - prefers-reduced-motion: animation off, manual scroll still works.

  Container has a 140px gradient mask on each edge so chips don't pop.
*/

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  // Loop duration in seconds. PLAN locks 220s desktop, slower mobile.
  durationSec?: number;
  className?: string;
  // Override the per-child gap. Defaults to 28px.
  gapPx?: number;
};

export default function Marquee({
  children,
  durationSec = 220,
  className,
  gapPx = 28,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Restart anim on resume.
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    let wheelTimer: number | null = null;
    let dragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;

    const pause = () => container.classList.add("mm-marquee-paused");
    const resume = () => container.classList.remove("mm-marquee-paused");

    const onWheel = (e: WheelEvent) => {
      // Horizontal trackpad gestures: let the browser handle the scroll,
      // just pause the animation while it's happening.
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      pause();
      if (wheelTimer) window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(resume, 600);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      dragStartX = e.clientX;
      dragStartScroll = container.scrollLeft;
      pause();
      container.setPointerCapture(e.pointerId);
      container.classList.add("mm-marquee-dragging");
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - dragStartX;
      container.scrollLeft = dragStartScroll - dx;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      container.releasePointerCapture(e.pointerId);
      container.classList.remove("mm-marquee-dragging");
      resume();
    };

    container.addEventListener("wheel", onWheel, { passive: true });
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      if (wheelTimer) window.clearTimeout(wheelTimer);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`mm-marquee group relative overflow-x-auto ${className ?? ""}`}
      style={
        {
          // Edge fade mask, 140px on each side per PLAN.
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, #000 140px, #000 calc(100% - 140px), transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0, #000 140px, #000 calc(100% - 140px), transparent 100%)",
          scrollbarWidth: "none",
          touchAction: "pan-x",
        } as React.CSSProperties
      }
    >
      <div
        ref={trackRef}
        className="mm-marquee-track flex w-max items-stretch hover:[animation-play-state:paused]"
        style={{
          gap: `${gapPx}px`,
          animation: `mm-marquee-scroll ${durationSec}s linear infinite`,
        }}
      >
        <div className="flex shrink-0 items-stretch" style={{ gap: `${gapPx}px` }}>
          {children}
        </div>
        <div
          aria-hidden
          className="flex shrink-0 items-stretch"
          style={{ gap: `${gapPx}px` }}
        >
          {children}
        </div>
      </div>

      <style>{`
        .mm-marquee::-webkit-scrollbar { display: none; }
        .mm-marquee-paused .mm-marquee-track,
        .mm-marquee-dragging .mm-marquee-track { animation-play-state: paused; }
        @keyframes mm-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mm-marquee-track { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
