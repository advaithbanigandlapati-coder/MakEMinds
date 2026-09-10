"use client";

/*
  Display headline with a SplitText-style mask-reveal on mount.
  PLAN §2 Hero: characters mask-reveal from below with stagger 0.012s.

  We don't pull in GSAP SplitText premium plugin — simple per-character
  spans with a transform + staggered transition are indistinguishable at
  this scale and ship 0KB of extra JS.

  Reduced motion: render the text immediately, no transform.
*/

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks/useMediaQuery";

type Props = {
  // Each entry is a separate line. Whitespace inside is preserved.
  lines: string[];
};

export default function Headline({ lines }: Props) {
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // One frame delay so the initial state paints before the transition flips.
    const id = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <h1
      ref={ref}
      className="font-display text-[clamp(3rem,11vw,11rem)] font-bold leading-[0.92] tracking-normal"
    >
      {lines.map((line, lineIdx) => {
        const chars = Array.from(line);
        return (
          <span key={lineIdx} className="block overflow-hidden">
            {chars.map((ch, i) => (
              <span
                key={`${lineIdx}-${i}`}
                aria-hidden={false}
                className="inline-block will-change-transform"
                style={
                  reduced
                    ? undefined
                    : {
                        transform: mounted ? "translateY(0%)" : "translateY(110%)",
                        opacity: mounted ? 1 : 0,
                        transition: `transform 620ms cubic-bezier(0.22, 1, 0.36, 1) ${
                          (lineIdx * line.length + i) * 12
                        }ms, opacity 240ms ease-out ${
                          (lineIdx * line.length + i) * 12
                        }ms`,
                      }
                }
              >
                {ch === " " ? " " : ch}
              </span>
            ))}
          </span>
        );
      })}
    </h1>
  );
}
