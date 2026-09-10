/*
  Home sponsor strip (PLAN §Pages Home). Single horizontal row of sponsor
  names rendered as mono labels — the full tier grid lives at /sponsors.
  Names only since logos are placeholder.
*/

import Link from "next/link";
import sponsorsData from "@/content/sponsors.json";
import SectionLabel from "../layout/SectionLabel";

type Sponsor = { name: string; url: string | null };
type Tier = { id: string; label: string; sponsors: Sponsor[] };

export default function SponsorStrip() {
  const all = (sponsorsData.tiers as Tier[]).flatMap((t) => t.sponsors);

  return (
    <section
      id="sponsors"
      className="relative border-t border-border px-6 py-20 md:px-12 lg:px-20"
    >
      <div className="flex items-baseline justify-between">
        <SectionLabel index={5} label="Sponsors" meta="powering the build" />
        <Link
          href="/sponsors"
          className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-accent hover:text-accent-hi md:inline"
        >
          full tiers →
        </Link>
      </div>
      <ul className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
        {all.map((s, i) => (
          <li
            key={`${s.name}-${i}`}
            className="font-display text-[clamp(1rem,1.6vw,1.4rem)] font-medium text-fg-muted transition-colors hover:text-fg"
          >
            {s.url ? (
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.name}
              </a>
            ) : (
              <span>{s.name}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
