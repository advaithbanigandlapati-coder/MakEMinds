"use client";

/*
  Lenis smooth scroll (PLAN §Decisions locked).
  Wraps the app. rAF loop drives the lerp; pauses on prefers-reduced-motion
  and on touch devices.

  Integrates with GSAP ScrollTrigger via a shared rAF tick so the two
  don't fight: on every Lenis scroll we call ScrollTrigger.update(), and
  GSAP's gsap.ticker is bridged to drive Lenis. Reference pattern from
  Lenis docs.
*/

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LenisProvider() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // Bridge Lenis → ScrollTrigger.
    lenis.on("scroll", ScrollTrigger.update);

    // Single rAF source: GSAP ticker drives Lenis.
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Jump to the top of every new route. Next's default scroll-to-top is
  // defeated by Lenis holding its own scroll position (which is why next/prev
  // landed the user at the BOTTOM of the new page), so reset Lenis's internal
  // target directly; fall back to the window when Lenis is off (reduced
  // motion / touch). Skip the very first render so we don't fight the boot.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
