"use client";

/*
  Mission section (PLAN §3). Asymmetric grid: left column has a vertical
  meter that fills as we scroll through the locked panel; right column has
  the mission copy broken into phrases that resolve from dim to bright one
  at a time as the meter advances.

  Mechanism: the section is a tall scroll *track*; an inner wrapper is
  `position: sticky` so it locks to the viewport while the track scrolls
  past. A scrubbed GSAP timeline (no pin) maps the track's scroll range to
  the meter fill + phrase reveals. We deliberately avoid ScrollTrigger
  `pin:true` here — the section is a flex child of #main-content, and a
  pinned flex child can't reserve its pin-spacing reliably, which made the
  locked panel overlap the next section. Sticky has none of that fragility.

  Desktop + motion only. On mobile or prefers-reduced-motion the track
  collapses to natural height (no `motion-safe:md:h-*`) and the phrases
  render at rest — the copy is never gated behind motion.
*/

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "../layout/SectionLabel";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PHRASES = [
  "MakEMinds is a student-led FTC team out of Edison, NJ.",
  "We design, build, code, and field competition robots — three seasons in.",
  "We run a summer build camp, mentor two FLL teams, and host library STEM days.",
  "Engineering rigor with a community-first attitude. We win when our chapter wins.",
];

export default function Mission() {
  const sectionRef = useRef<HTMLElement>(null);
  const meterRef = useRef<HTMLDivElement>(null);
  const phrasesRef = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    const section = sectionRef.current;
    const meter = meterRef.current;
    const phrases = phrasesRef.current.filter(
      (p): p is HTMLParagraphElement => p !== null,
    );
    if (!section || !meter || phrases.length === 0) return;

    // Initial state: meter empty, phrases dimmed + offset.
    gsap.set(meter, { scaleY: 0, transformOrigin: "top" });
    gsap.set(phrases, { opacity: 0.18, y: 12 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          // Range == the sticky lock duration: from the track entering the
          // top of the viewport to its bottom edge reaching the bottom.
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      });
      tl.to(meter, { scaleY: 1, ease: "none" }, 0);
      // Stagger phrase reveals across the first 85% of the scrub.
      phrases.forEach((p, i) => {
        const at = (i / phrases.length) * 0.85;
        tl.to(
          p,
          { opacity: i === 0 ? 1 : 0.92, y: 0, duration: 0.2, ease: "power2.out" },
          at,
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="mission"
      className="relative motion-safe:md:h-[220vh]"
    >
      <div className="flex items-center px-6 py-20 md:min-h-screen md:px-12 md:py-32 lg:px-20 md:sticky md:top-0">
        <div className="grid w-full grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <SectionLabel index={2} label="Mission" meta="who · what · why" />
            <div
              aria-hidden
              className="relative mt-6 hidden h-40 w-px bg-border md:block md:h-64"
            >
              <div
                ref={meterRef}
                className="absolute inset-0 w-px bg-accent"
                style={{ transform: "scaleY(0)", transformOrigin: "top" }}
              />
            </div>
          </div>
          <div className="col-span-12 md:col-span-8 md:col-start-5">
            <div className="space-y-5 font-display text-[clamp(1.4rem,3.2vw,2.4rem)] font-medium leading-[1.18] tracking-[-0.01em]">
              {PHRASES.map((p, i) => (
                <p
                  key={i}
                  ref={(el) => {
                    phrasesRef.current[i] = el;
                  }}
                  className={i === 0 ? "text-fg" : "text-fg-muted"}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
