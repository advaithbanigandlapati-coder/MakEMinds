"use client";

/*
  HudRail — persistent left-edge HUD on desktop (PLAN §Layout system).

  Why active-only instead of the full section list: the stacked 7-item mono
  list was wide enough ("Work with us") to cross out of the left gutter and
  collide with page content. We now show a single, vertically-set active
  label plus a vertical scroll-progress rail with a position marker. The whole
  thing is a thin column that lives entirely inside the gutter, so it can
  never overlap content. Shown only at xl (>=1280px) where the gutter is real.

  Updates on scroll via passive listener + rAF throttle; honors
  prefers-reduced-motion by dropping the smooth transitions.

  Section labels are passed in by the page since the HUD doesn't know the
  page's IA. If no sections are provided we render a minimal progress rail.
*/

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks/useMediaQuery";

type Section = {
  id: string;
  label: string;
};

type Props = {
  sections?: Section[];
};

const RAIL_HEIGHT = 160;

export default function HudRail({ sections = [] }: Props) {
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const tickRef = useRef<number | null>(null);

  useEffect(() => {
    const compute = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      setProgress(p);

      if (sections.length > 0) {
        // Active = the section whose top is closest to (but above) viewport center.
        const center = window.scrollY + window.innerHeight / 2;
        let bestId: string | null = null;
        let bestDelta = Number.POSITIVE_INFINITY;
        for (const s of sections) {
          const el = document.getElementById(s.id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top + window.scrollY;
          const delta = center - top;
          if (delta >= 0 && delta < bestDelta) {
            bestDelta = delta;
            bestId = s.id;
          }
        }
        setActiveId(bestId);
      }
    };

    const onScroll = () => {
      if (tickRef.current != null) return;
      tickRef.current = window.requestAnimationFrame(() => {
        compute();
        tickRef.current = null;
      });
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (tickRef.current != null) cancelAnimationFrame(tickRef.current);
    };
  }, [sections]);

  const activeIndex = activeId
    ? sections.findIndex((s) => s.id === activeId)
    : -1;
  const activeSection = activeIndex >= 0 ? sections[activeIndex] : null;
  const total = sections.length;

  const transition = reducedMotion ? "none" : undefined;
  const markerTop = RAIL_HEIGHT * progress;

  return (
    <aside
      aria-hidden
      data-boot-fade
      className="pointer-events-none fixed left-5 top-1/2 z-[70] hidden w-12 -translate-y-1/2 flex-col items-center gap-4 xl:flex"
    >
      {/* Index readout: active section position / total. */}
      {total > 0 ? (
        <p className="font-mono text-[10px] tabular-nums tracking-[0.18em] text-fg-dim">
          <span className="text-accent">
            {(activeIndex >= 0 ? activeIndex + 1 : 0)
              .toString()
              .padStart(2, "0")}
          </span>
          <span className="text-fg-dim">/{total.toString().padStart(2, "0")}</span>
        </p>
      ) : (
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-dim">
          scroll
        </p>
      )}

      {/* Vertical progress rail with a position marker. */}
      <div
        className="relative w-px bg-border"
        style={{ height: RAIL_HEIGHT }}
      >
        <div
          className="absolute left-0 top-0 w-px bg-accent"
          style={{
            height: `${progress * 100}%`,
            transition: transition ?? "height 200ms ease-out",
          }}
        />
        <span
          className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
          style={{
            top: markerTop,
            transition: transition ?? "top 200ms ease-out",
          }}
        />
      </div>

      {/* Percentage. */}
      <p className="font-mono text-[10px] tabular-nums tracking-[0.16em] text-fg-muted">
        {(progress * 100).toFixed(0).padStart(2, "0")}%
      </p>

      {/* Active section label, set vertically so it stays inside the gutter. */}
      {activeSection ? (
        <p
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-muted"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          {activeSection.label}
        </p>
      ) : null}
    </aside>
  );
}
