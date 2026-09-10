import Image from "next/image";
import teamData from "@/content/team.json";
import HairlineDivider from "../_components/layout/HairlineDivider";
import PageHero from "../_components/layout/PageHero";
import PhotoFrame from "../_components/ui/PhotoFrame";

type Member = {
  name: string;
  role: string;
  year: string;
  bio: string;
  headshot: string | null;
};

type Mentor = Omit<Member, "year">;

export const metadata = {
  title: "Team",
  description:
    "Roster of FTC Team 23786 MakEMinds — students and mentors.",
};

function PortraitPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <div className="relative aspect-[4/5] overflow-hidden border border-border bg-bg-elev">
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,157,199,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,157,199,0.05)_1px,transparent_1px)] bg-[size:32px_32px]"
      />
      <Image
        src="/logo-full.png"
        alt=""
        width={180}
        height={180}
        className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 object-contain opacity-20"
        sizes="144px"
      />
      <div className="absolute inset-x-5 bottom-5 border-t border-border pt-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-dim">
          portrait pending
        </p>
        <p className="mt-2 font-display text-4xl font-bold leading-none tracking-normal text-accent">
          {initials || "MM"}
        </p>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const members = teamData.members as Member[];
  const mentors = teamData.mentors as Mentor[];

  return (
    <main className="relative">
      <PageHero
        index={2}
        label="Team"
        meta="roster · 2025–26"
        title={
          <>
          The students <span className="text-accent">who build</span> the robot.
          </>
        }
        stats={[
          { label: "Students", value: members.length.toString().padStart(2, "0") },
          { label: "Mentors", value: mentors.length.toString().padStart(2, "0") },
          { label: "Season", value: "26" },
          { label: "Team", value: "23786" },
        ]}
        panelTitle="Roster Manifest"
        panelMeta="build · code · outreach"
      >
        A small team. Every member owns at least one system end-to-end, from
        CAD to drive practice to scouting alliances.
      </PageHero>

      <section className="px-6 py-20 md:px-12 lg:px-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted">
          [a] / students · {members.length.toString().padStart(2, "0")}
        </p>
        <ul className="mt-8 grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {members.map((m, i) => (
            <li
              key={i}
              className="group flex flex-col gap-4 bg-bg p-6 transition-colors hover:bg-bg-elev"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                  [{(i + 1).toString().padStart(2, "0")}]
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-dim">
                  {m.year}
                </span>
              </div>
              {m.headshot ? (
                <PhotoFrame
                  src={m.headshot}
                  alt={`${m.name}, ${m.role}`}
                  width={400}
                  height={500}
                  aspect="aspect-[4/5]"
                  // First row is above the fold on every viewport; hint
                  // it as LCP so the loader doesn't lazy-defer it.
                  priority={i < 3}
                />
              ) : (
                <PortraitPlaceholder name={m.name} />
              )}
              <h3 className="font-display text-[20px] font-semibold tracking-normal text-fg">
                {m.name}
              </h3>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                {m.role}
              </p>
              <p className="mt-auto text-[13px] leading-[1.6] text-fg-muted">
                {m.bio}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <HairlineDivider className="my-12 px-6 md:px-12 lg:px-20" />

      <section className="px-6 pb-24 md:px-12 lg:px-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted">
          [b] / mentors · {mentors.length.toString().padStart(2, "0")}
        </p>
        <ul className="mt-8 grid grid-cols-1 gap-px bg-border md:grid-cols-2">
          {mentors.map((m, i) => (
            <li
              key={i}
              className="flex flex-col gap-4 bg-bg p-6"
            >
              {m.headshot ? (
                <PhotoFrame
                  src={m.headshot}
                  alt={`${m.name}, ${m.role}`}
                  width={400}
                  height={500}
                  aspect="aspect-[4/5]"
                />
              ) : (
                <PortraitPlaceholder name={m.name} />
              )}
              <h3 className="font-display text-[20px] font-semibold tracking-normal text-fg">
                {m.name}
              </h3>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                {m.role}
              </p>
              <p className="text-[13px] leading-[1.6] text-fg-muted">{m.bio}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
