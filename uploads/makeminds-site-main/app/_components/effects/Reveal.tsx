"use client";

/*
  Scroll reveal primitive (PLAN §3 — a choreographed clip-wipe, not the
  forbidden generic float-up-from-below). Each target uncovers from the top
  edge down (`clip-path` inset) while rising and fading in, eased on a long
  decelerating curve so it reads as a panel seating into place.

  Pass `stagger` to cascade the wrapper's direct children (card grids, stat
  rows) instead of the box itself.

  ── Why this is structured for safety ──────────────────────────────────────
  Reveal wraps PRIMARY page content, so a hide-by-default reveal turns any
  animation hiccup into invisible content. Three guarantees:

  1. Content renders VISIBLE on the server and with JS disabled. The hidden
     state is only ever applied by script.
  2. `restore()` (clears every inline style we set) runs after the reveal
     completes AND on cleanup AND for reduced motion. So unmounting, a
     dependency change, or a reduced-motion flip can never strand content in
     the hidden state. (This is the bug that previously blanked /programs and
     the home CTA: the old cleanup disconnected the observer but left the
     `opacity:0` inline styles in place, and the reduced-motion path bailed
     without restoring.)
  3. Two independent triggers — IntersectionObserver (primary) and a
     rAF-throttled scroll/resize check against getBoundingClientRect
     (fallback, works on any native scroll incl. Lenis). Whichever fires
     first wins; the reveal is idempotent. If IO ever misbehaves, the scroll
     check still uncovers the content.

  Reduced motion: nothing is hidden; the element is left in its visible state.
*/

import {
  createElement,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import { useReducedMotion } from "@/lib/hooks/useMediaQuery";

// Run before paint on the client to minimise the first-frame flash; fall back
// to useEffect during SSR where layout effects are a no-op (and warn).
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const TRAVEL_MS = 900;
const FADE_MS = 700;

type Props = {
  children: ReactNode;
  className?: string;
  // Delay before this reveal starts, ms.
  delay?: number;
  // If > 0, the wrapper's direct children cascade by this many ms each.
  stagger?: number;
  // Vertical travel in px. Default 32.
  y?: number;
  // IntersectionObserver threshold (0–1). Default 0.15.
  threshold?: number;
  as?: "div" | "section" | "article" | "li" | "p" | "span" | "ul" | "ol";
  id?: string;
};

export default function Reveal({
  children,
  className,
  delay = 0,
  stagger = 0,
  y = 32,
  threshold = 0.15,
  as: Tag = "div",
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = (
      stagger > 0 ? (Array.from(el.children) as HTMLElement[]) : [el]
    ).filter(Boolean);
    if (targets.length === 0) return;

    // Return every target to its natural, visible resting state. Safe to call
    // multiple times. This is the load-bearing guarantee: content can never be
    // left hidden by this component.
    const restore = () => {
      for (const t of targets) {
        t.style.opacity = "";
        t.style.transform = "";
        t.style.clipPath = "";
        t.style.transition = "";
        t.style.willChange = "";
      }
    };

    // Reduced motion (initial, or toggled on after mount): show everything,
    // never animate.
    if (reduced) {
      restore();
      return;
    }

    // Park hidden — in script only, so SSR/no-JS render everything visible.
    for (const t of targets) {
      t.style.opacity = "0";
      t.style.transform = `translate3d(0, ${y}px, 0)`;
      t.style.clipPath = "inset(0% 0% 100% 0%)";
      t.style.willChange = "opacity, transform, clip-path";
    }

    let done = false;
    let settleTimer: number | undefined;
    let rafGate = 0;
    let rafScroll = 0;
    let io: IntersectionObserver | undefined;

    const isInView = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // Trigger once the top edge has crossed ~88% of the viewport height.
      return r.top < vh * 0.88 && r.bottom > 0;
    };

    const detach = () => {
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafScroll) cancelAnimationFrame(rafScroll);
    };

    const reveal = () => {
      if (done) return;
      done = true;
      detach();
      targets.forEach((t, i) => {
        const d = delay + i * stagger;
        t.style.transition =
          `opacity ${FADE_MS}ms ${EASE} ${d}ms, ` +
          `transform ${TRAVEL_MS}ms ${EASE} ${d}ms, ` +
          `clip-path ${TRAVEL_MS}ms ${EASE} ${d}ms`;
        t.style.opacity = "1";
        t.style.transform = "translate3d(0, 0, 0)";
        t.style.clipPath = "inset(0% 0% 0% 0%)";
      });
      // Clear inline styles once the longest transition (+ its delay) is done,
      // so the clip can't crop focus rings / hover overflow at rest.
      const total = TRAVEL_MS + delay + (targets.length - 1) * stagger + 80;
      settleTimer = window.setTimeout(restore, total);
    };

    // Fallback trigger — independent of IntersectionObserver.
    const onScroll = () => {
      if (rafScroll || done) return;
      rafScroll = requestAnimationFrame(() => {
        rafScroll = 0;
        if (isInView()) reveal();
      });
    };

    // Primary trigger.
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) reveal();
        },
        { threshold, rootMargin: "0px 0px -8% 0px" },
      );
      io.observe(el);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Paint the hidden state for two frames, then handle the already-in-view
    // case (and act as the no-IO safety net on first evaluation).
    rafGate = requestAnimationFrame(() => {
      rafGate = requestAnimationFrame(() => {
        if (isInView()) reveal();
      });
    });

    return () => {
      detach();
      if (rafGate) cancelAnimationFrame(rafGate);
      if (settleTimer) clearTimeout(settleTimer);
      // If we tear down before revealing, leave content visible — never hidden.
      if (!done) restore();
    };
  }, [reduced, delay, stagger, y, threshold]);

  // createElement sidesteps the JSX-generic ref intersection issue you get
  // putting a single ref<HTMLElement> on a polymorphic <Tag>.
  /* eslint-disable react-hooks/refs */
  return createElement(Tag, { ref, id, className }, children);
  /* eslint-enable react-hooks/refs */
}
