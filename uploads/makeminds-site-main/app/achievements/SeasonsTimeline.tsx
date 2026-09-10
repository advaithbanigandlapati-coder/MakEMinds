"use client";

/*
  Drag-scrubbable season timeline for /achievements. Same UX as the home
  Marquee but no auto-scroll — purely manual. Award-row visual treatment
  matches: 2px accent left border + glow dot.
*/

import { useRef } from "react";
import { useDragScroll } from "@/lib/hooks/useDragScroll";

type EventRecord = {
  season: string;
  year: number;
  name: string;
  result: string;
};

const AWARD_KEYWORDS = [
  "Inspire",
  "Control",
  "Think",
  "Connect",
  "Innovate",
  "Motivate",
  "Winning Alliance",
  "Finalist Alliance",
];

function isAwardish(result: string): boolean {
  return AWARD_KEYWORDS.some((k) => result.includes(k));
}

type Props = {
  seasonOrder: string[];
  seasons: Record<string, EventRecord[]>;
};

export default function SeasonsTimeline({ seasonOrder, seasons }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useDragScroll(ref, { wheelToHorizontal: true });

  return (
    <div
      ref={ref}
      // a11y: make the scrolling region a labelled focusable landmark so
      // keyboard users can tab here and use arrow keys to scroll. Cards
      // inside are static text, so without this they couldn't reach
      // off-screen seasons at all.
      role="region"
      aria-label="Season timeline — use arrow keys to scroll"
      tabIndex={0}
      className="mt-8 cursor-grab overflow-x-auto pb-4 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&.mm-dragging]:cursor-grabbing"
      style={{ scrollbarWidth: "thin" }}
    >
      <div className="flex w-max gap-6">
        {seasonOrder.map((key) => {
          const sEvents = seasons[key];
          const season = sEvents[0];
          return (
            <article
              key={key}
              className="flex w-[320px] shrink-0 flex-col gap-3 border-l border-border pl-5"
            >
              <header>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                  {season.year} · {season.season}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-dim">
                  {sEvents.length} events
                </p>
              </header>
              <ol className="mt-2 flex flex-col gap-2">
                {sEvents.map((e, i) => {
                  const award = isAwardish(e.result);
                  return (
                    <li
                      key={`${key}-${i}`}
                      className="border-l border-border pl-3"
                      style={
                        award
                          ? {
                              borderColor: "var(--accent)",
                              boxShadow: "inset 2px 0 0 0 var(--accent)",
                            }
                          : undefined
                      }
                    >
                      <p className="font-display text-[14px] font-semibold leading-tight text-fg">
                        {e.name}
                      </p>
                      <p
                        className={
                          "mt-1 font-mono text-[10px] uppercase tracking-[0.16em] " +
                          (award ? "text-accent" : "text-fg-muted")
                        }
                      >
                        {e.result}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </article>
          );
        })}
      </div>
    </div>
  );
}
