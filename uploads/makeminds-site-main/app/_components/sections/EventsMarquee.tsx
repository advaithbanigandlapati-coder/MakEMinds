/*
  Home page events marquee (PLAN §1.5).
  Renders every event from content/achievements.json as a 64px-tall chip.
  Award-winning events get an accent left-border + glowing dot — never
  size or color variation. Uniform visual rhythm.
*/

import achievementsData from "@/content/achievements.json";
import Marquee from "../ui/Marquee";

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

export default function EventsMarquee() {
  const events = achievementsData.events as EventRecord[];

  return (
    <section
      id="events"
      aria-label="Event ticker — decorative; full list on /achievements"
      className="relative border-y border-border bg-bg-elev/40 py-6"
    >
      {/* aria-hidden: the marquee is decorative and duplicates the
          /achievements page; without this, screen readers would announce
          every event as it scrolls past. */}
      <div aria-hidden="true">
      <Marquee durationSec={220} gapPx={24}>
        {events.map((e, i) => {
          const award = isAwardish(e.result);
          return (
            <div
              key={`${e.year}-${e.name}-${i}`}
              className={[
                "relative flex h-16 items-center gap-4 whitespace-nowrap border-l px-5",
                award
                  ? "border-accent shadow-[inset_2px_0_0_0_var(--accent)]"
                  : "border-border",
              ].join(" ")}
            >
              {award ? (
                <span
                  aria-hidden
                  className="absolute -left-[5px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_2px_var(--accent)]"
                />
              ) : null}
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                {e.year} · {e.season}
              </span>
              <span className="font-display text-[14px] font-semibold tracking-normal text-fg">
                {e.name}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg-muted">
                {e.result}
              </span>
            </div>
          );
        })}
      </Marquee>
      </div>
    </section>
  );
}
