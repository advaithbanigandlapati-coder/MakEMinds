/*
  Latest achievement card (PLAN §Pages Home). Pulls the most recent entry
  from majorAwards and renders it as a one-shot poster — giant year,
  award name, event, link to /achievements.
*/

import Link from "next/link";
import achievementsData from "@/content/achievements.json";
import SectionLabel from "../layout/SectionLabel";
import Reveal from "../effects/Reveal";

type Award = {
  year: number;
  name: string;
  event: string;
};

function pickLatest(awards: Award[]): Award {
  return [...awards].sort((a, b) => b.year - a.year)[0];
}

export default function LatestAchievement() {
  const latest = pickLatest(achievementsData.majorAwards as Award[]);

  return (
    <section
      id="latest"
      className="relative border-t border-border bg-bg-elev/40 px-6 py-24 md:px-12 md:py-32 lg:px-20"
    >
      <SectionLabel index={4} label="Latest" meta="most recent major award" />
      <Reveal as="div" stagger={140} className="mt-10 grid grid-cols-12 items-end gap-6">
        <p className="col-span-12 font-display font-bold leading-[0.85] tracking-normal text-[clamp(5rem,18vw,16rem)] tabular-nums text-accent md:col-span-6">
          {latest.year}
        </p>
        <div className="col-span-12 md:col-span-6">
          <p className="font-display text-[clamp(1.6rem,3.4vw,2.4rem)] font-semibold leading-tight text-fg">
            {latest.name}
          </p>
          <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.18em] text-fg-muted">
            {latest.event}
          </p>
          <Link
            href="/achievements"
            className="mt-8 inline-flex items-center gap-2 border border-border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-fg transition-colors hover:border-accent hover:text-accent"
          >
            full timeline →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
