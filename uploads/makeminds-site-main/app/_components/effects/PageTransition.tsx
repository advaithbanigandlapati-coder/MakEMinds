"use client";

/*
  Page transition (PLAN §6). On route change, an accent panel slides in
  from right, covers everything, page swaps under it, then panel slides
  off-left. ~520ms total.

  We hook usePathname; on change we flip a state that triggers two
  back-to-back transforms via setTimeout. Because App Router shares
  layouts across routes, the panel itself never unmounts — it just
  animates.

  Skipped on first load (the BootLoader handles that) and on reduced
  motion.
*/

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type State = "idle" | "cover" | "reveal";

export default function PageTransition() {
  const pathname = usePathname();
  const [state, setState] = useState<State>("idle");
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    if (prevPath.current === null) {
      prevPath.current = pathname;
      return;
    }
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Effect drives a three-step DOM animation in response to a pathname
    // change. Each setState is the "external system → React" callback
    // arm of the rule (the external system being the router).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState("cover");
    const id1 = window.setTimeout(() => setState("reveal"), 260);
    const id2 = window.setTimeout(() => setState("idle"), 800);
    return () => {
      window.clearTimeout(id1);
      window.clearTimeout(id2);
    };
  }, [pathname]);

  const transform =
    state === "cover"
      ? "translateX(0%)"
      : state === "reveal"
        ? "translateX(-105%)"
        : "translateX(105%)";

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[95] bg-accent"
      style={{
        transform,
        transition:
          state === "reveal"
            ? "transform 520ms cubic-bezier(0.85, 0, 0.15, 1)"
            : state === "cover"
              ? "transform 240ms cubic-bezier(0.22, 1, 0.36, 1)"
              : "none",
      }}
    />
  );
}
