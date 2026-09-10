import fs from "node:fs";
import path from "node:path";
import HairlineDivider from "../_components/layout/HairlineDivider";
import PageHero from "../_components/layout/PageHero";
import PhotoFrame from "../_components/ui/PhotoFrame";

// Read public/robot/ at build time. Whatever images live there appear in
// the gallery with the brand duotone — no JSON wiring required. Empty
// directory or missing directory falls through to the placeholder cells.
function loadGalleryPhotos(): string[] {
  const dir = path.join(process.cwd(), "public", "robot");
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
      .sort()
      .map((f) => `/robot/${f}`);
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Robot",
  description:
    "Current-season FTC robot for Team 23786 — specs, subsystems, and build journal.",
};

const SPECS = [
  { label: "Season", value: "DECODE" },
  { label: "Year", value: "2025-26" },
  { label: "Mass", value: "16.2 kg" },
  { label: "Drivetrain", value: "Mecanum" },
  { label: "Top speed", value: "1.8 m/s" },
  { label: "Auto routines", value: "04" },
  { label: "Vision", value: "AprilTag" },
  { label: "Control", value: "Java · OnBot" },
];

const SUBSYSTEMS = [
  {
    code: "01",
    name: "Drivetrain",
    blurb: "Four mecanum wheels, REV Hex Cores 5.4 ratio. PID on heading.",
  },
  {
    code: "02",
    name: "Intake",
    blurb: "Compliant wheels on a sprung arm. Pivots out of bumper plane.",
  },
  {
    code: "03",
    name: "Scoring",
    blurb: "Cascade lift, sprocket-driven. Closed-loop position control.",
  },
  {
    code: "04",
    name: "Vision",
    blurb: "Limelight 3A, AprilTag pose estimation, MT2 for relocalization.",
  },
];

export default function RobotPage() {
  const galleryPhotos = loadGalleryPhotos();
  return (
    <main className="relative">
      <PageHero
        index={4}
        label="Robot"
        meta="DECODE · 2025-26"
        title={
          <>
          The 2025-26<br />
          <span className="text-accent">DECODE</span> machine.
          </>
        }
        stats={[
          { label: "Mass", value: "16.2", detail: "kg" },
          { label: "Drive", value: "MEC", detail: "mecanum" },
          { label: "Auto", value: "04", detail: "routines" },
          { label: "Vision", value: "TAG", detail: "apriltag" },
        ]}
        panelTitle="Robot Telemetry"
        panelMeta="weekly iteration log"
      >
        Mecanum drive, cascade scoring lift, vision-assisted autonomous.
        Iterating weekly. Photos and CAD renders land here as the season
        progresses.
      </PageHero>

      <section className="px-6 py-20 md:px-12 lg:px-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted">
          [a] / specs
        </p>
        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-border md:grid-cols-4">
          {SPECS.map((s) => (
            <div key={s.label} className="flex flex-col gap-2 bg-bg p-5">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-dim">
                {s.label}
              </dt>
              <dd className="font-display text-[clamp(1.1rem,1.6vw,1.4rem)] font-semibold text-fg">
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <HairlineDivider className="my-12 px-6 md:px-12 lg:px-20" />

      <section className="px-6 pb-24 md:px-12 lg:px-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted">
          [b] / subsystems
        </p>
        <ul className="mt-8 grid grid-cols-1 gap-px bg-border md:grid-cols-2">
          {SUBSYSTEMS.map((s) => (
            <li key={s.code} className="flex flex-col gap-3 bg-bg p-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                [{s.code}] {s.name}
              </span>
              <p className="text-[14px] leading-[1.6] text-fg-muted">{s.blurb}</p>
            </li>
          ))}
        </ul>
      </section>

      <HairlineDivider className="my-12 px-6 md:px-12 lg:px-20" />

      <section className="px-6 pb-24 md:px-12 lg:px-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted">
          [c] / gallery
          {galleryPhotos.length > 0
            ? ` · ${galleryPhotos.length.toString().padStart(2, "0")}`
            : null}
        </p>
        {galleryPhotos.length === 0 ? (
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-dim">
            placeholder — drop photos in public/robot/ to fill
          </p>
        ) : null}
        <div className="mt-8 grid grid-cols-2 gap-px bg-border md:grid-cols-3">
          {galleryPhotos.length > 0
            ? galleryPhotos.map((src, i) => (
                <PhotoFrame
                  key={src}
                  src={src}
                  alt={`Robot — figure ${(i + 1).toString().padStart(2, "0")}`}
                  width={800}
                  height={600}
                  caption={`FIG. ${(i + 1).toString().padStart(2, "0")} — DECODE / 2025`}
                  // First photo is the gallery LCP candidate; rest lazy.
                  priority={i === 0}
                />
              ))
            : Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="relative aspect-[4/3] bg-bg-elev"
                >
                  <div className="absolute inset-0 grid place-items-center font-mono text-[10px] uppercase tracking-[0.18em] text-fg-dim">
                    [ fig.{(i + 1).toString().padStart(2, "0")} — pending ]
                  </div>
                </div>
              ))}
        </div>
      </section>
    </main>
  );
}
