/*
  Programs preview (PLAN §3). Compressed version for Home — three vertical
  cards. The full kinetic-panel treatment lives at /programs.
*/

import Link from "next/link";
import programsData from "@/content/programs.json";
import SectionLabel from "../layout/SectionLabel";
import Reveal from "../effects/Reveal";

type Program = {
  id: string;
  code: string;
  name: string;
  ages: string;
  headline: string;
  metrics?: { label: string; value: string }[];
};

export default function ProgramsPreview() {
  const programs = programsData.programs as Program[];

  return (
    <section
      id="programs"
      className="relative border-t border-border px-6 py-24 md:px-12 md:py-32 lg:px-20"
    >
      <div className="flex items-baseline justify-between">
        <SectionLabel index={3} label="Programs" meta="FTC · FLL · Outreach" />
        <Link
          href="/programs"
          className="hidden font-mono text-[11px] uppercase tracking-[0.18em] text-accent hover:text-accent-hi md:inline"
        >
          all programs →
        </Link>
      </div>

      <Reveal
        as="div"
        stagger={90}
        className="mt-10 grid grid-cols-1 gap-px bg-border md:grid-cols-3"
      >
        {programs.map((p, i) => (
          <Link
            key={p.id}
            href={`/programs#${p.id}`}
            className="group relative flex flex-col justify-between gap-10 bg-bg p-6 transition-colors hover:bg-bg-elev md:p-8"
          >
            <div>
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                  [{(i + 1).toString().padStart(2, "0")}] {p.code}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-dim">
                  ages {p.ages}
                </span>
              </div>
              <h3 className="mt-6 font-display text-[clamp(1.5rem,2.8vw,2rem)] font-semibold tracking-normal text-fg group-hover:text-accent">
                {p.name}
              </h3>
              <p className="mt-3 text-[14px] leading-[1.6] text-fg-muted">
                {p.headline}
              </p>
            </div>
            {p.metrics ? (
              <dl className="flex gap-6">
                {p.metrics.map((m) => (
                  <div key={m.label}>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-dim">
                      {m.label}
                    </dt>
                    <dd className="mt-1 font-display text-[24px] font-bold tabular-nums text-fg">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
            <span
              aria-hidden
              className="absolute right-6 top-6 font-mono text-fg-dim transition-colors group-hover:text-accent"
            >
              →
            </span>
          </Link>
        ))}
      </Reveal>
    </section>
  );
}
