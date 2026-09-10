import programsData from "@/content/programs.json";
import SectionLabel from "../_components/layout/SectionLabel";
import PageHero from "../_components/layout/PageHero";
import Reveal from "../_components/effects/Reveal";

type Program = {
  id: string;
  code: string;
  name: string;
  ages: string;
  headline: string;
  body: string;
  metrics?: { label: string; value: string }[];
};

export const metadata = {
  title: "Programs",
  description: "FTC, FLL, and outreach programs run by Team 23786.",
};

const TIMELINE = [
  { month: "Sep", phase: "Kickoff", note: "Season game reveal, brainstorm" },
  { month: "Oct", phase: "Prototype", note: "Three to five mechanism iterations" },
  { month: "Nov", phase: "Build", note: "Lock drivetrain, integrate intake" },
  { month: "Dec", phase: "Code", note: "Autonomous routines, vision pipeline" },
  { month: "Jan", phase: "League", note: "Weekly meets, defensive iteration" },
  { month: "Feb", phase: "States", note: "Awards, alliance selection" },
  { month: "Apr", phase: "Worlds", note: "If we qualify" },
];

export default function ProgramsPage() {
  const programs = programsData.programs as Program[];

  return (
    <main className="relative">
      <PageHero
        index={3}
        label="Programs"
        meta="Outreach · FLL · FTC"
        title={
          <>
          Three programs.<br />
          <span className="text-accent">One pipeline.</span>
          </>
        }
        stats={[
          { label: "Tracks", value: programs.length.toString().padStart(2, "0") },
          { label: "FTC events", value: "27" },
          { label: "FLL teams", value: "02" },
          { label: "Reach / yr", value: "300+" },
        ]}
        panelTitle="Learning Pipeline"
        panelMeta="competition · mentoring · outreach"
      >
        Students enter through outreach and FLL mentoring, then grow into FTC
        builders who can own mechanical, software, strategy, and documentation
        systems.
      </PageHero>

      <section className="space-y-px bg-border">
        <Reveal
          as="p"
          className="bg-bg px-6 py-8 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim md:px-12 lg:px-20"
        >
          Outreach{" "}
          <span className="text-accent">→</span> FLL{" "}
          <span className="text-accent">→</span> FTC
          <span className="ml-4 text-fg-muted">entry to flagship</span>
        </Reveal>
        {programs.map((p, i) => (
          <Reveal
            key={p.id}
            id={p.id}
            as="article"
            className="grid grid-cols-12 gap-6 bg-bg px-6 py-16 md:px-12 md:py-20 lg:px-20"
            delay={50}
          >
            <div className="col-span-12 md:col-span-3">
              <p className="font-display text-[clamp(3rem,8vw,7rem)] font-bold leading-[0.9] text-accent tabular-nums">
                {(i + 1).toString().padStart(2, "0")}
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
                {p.code} · ages {p.ages}
              </p>
            </div>
            <div className="col-span-12 md:col-span-8 md:col-start-5">
              <h2 className="font-display text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-tight tracking-normal text-fg">
                {p.name}
              </h2>
              <p className="mt-4 max-w-xl font-display text-[clamp(1.1rem,1.8vw,1.4rem)] font-medium text-fg-muted leading-[1.4]">
                {p.headline}
              </p>
              <p className="mt-6 max-w-xl text-[14px] leading-[1.7] text-fg-muted">
                {p.body}
              </p>
              {p.metrics ? (
                <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-6">
                  {p.metrics.map((m) => (
                    <div key={m.label}>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-dim">
                        {m.label}
                      </dt>
                      <dd className="mt-1 font-display text-[28px] font-bold tabular-nums text-fg">
                        {m.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </Reveal>
        ))}
      </section>

      <section className="px-6 py-24 md:px-12 lg:px-20">
        <SectionLabel index={4} label="Season timeline" meta="Sep → April" />
        <ol className="mt-10 grid grid-cols-1 gap-px overflow-hidden border border-border md:grid-cols-7">
          {TIMELINE.map((t) => (
            <li key={t.month} className="flex flex-col gap-2 bg-bg p-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                {t.month}
              </span>
              <span className="font-display text-[20px] font-semibold tracking-normal text-fg">
                {t.phase}
              </span>
              <span className="text-[12px] leading-[1.55] text-fg-muted">
                {t.note}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
