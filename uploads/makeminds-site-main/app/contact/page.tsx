import SectionLabel from "../_components/layout/SectionLabel";
import PageHero from "../_components/layout/PageHero";
import Accordion from "../_components/ui/Accordion";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with MakEMinds Robotics — sponsorship, mentorship, partnerships, judging.",
};

const CHANNELS = [
  {
    code: "01",
    label: "Email",
    value: "info@makemindsrobotics.org",
    href: "mailto:info@makemindsrobotics.org",
    arrow: "→",
  },
  {
    code: "02",
    label: "Instagram",
    value: "@makemindsrobotics",
    href: "https://instagram.com/makemindsrobotics",
    arrow: "↗",
  },
  {
    code: "03",
    label: "YouTube",
    value: "MakEMinds Robotics",
    href: "https://youtube.com/@makemindsrobotics",
    arrow: "↗",
  },
  {
    code: "04",
    label: "Location",
    value: "Edison, NJ — USA",
    href: null,
    arrow: "·",
  },
];

const FAQ = [
  {
    q: "How do we sponsor the team?",
    a: "Pick a tier on the Sponsors page, then send us a message — we'll mail back our sponsor packet (tax-deductible info, logo placement spec, season-end report cadence).",
  },
  {
    q: "Are you taking on mentors?",
    a: "Yes — especially engineers, machinists, software folks, and former FIRST alumni. The commitment can be one workshop a season or weekly build meetings.",
  },
  {
    q: "When are tryouts?",
    a: "We hold tryouts in August before the season kickoff. If you're an Edison-area student in grades 9-12, send us a note and we'll add you to the interest list.",
  },
  {
    q: "Can you judge or volunteer at our event?",
    a: "Several of our students and alumni are FIRST-certified judges and referees. Reach out with your event date and we'll see who's available.",
  },
];

type Props = { searchParams: Promise<{ reason?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const { reason } = await searchParams;

  return (
    <main className="relative">
      <PageHero
        index={8}
        label="Contact"
        meta="open channels"
        title={
          <>
          Get in <span className="text-accent">touch.</span>
          </>
        }
        stats={[
          { label: "Channels", value: CHANNELS.length.toString().padStart(2, "0") },
          { label: "Reply", value: "48h" },
          { label: "Packet", value: "24h" },
          { label: "Email", value: "ON" },
        ]}
        panelTitle="Open Comms"
        panelMeta="sponsor · mentor · partner · judge"
      >
        Sponsor packets, mentor inquiries, partnership ideas, judging
        requests, or just hi from another team. Pick a channel.
      </PageHero>

      <section className="grid grid-cols-1 gap-px bg-border md:grid-cols-2">
        <div className="bg-bg p-6 md:p-12 lg:p-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted">
            [a] / direct channels
          </p>
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {CHANNELS.map((c) => {
              const Inner = (
                <div className="grid w-full grid-cols-[1fr_auto] gap-2 py-5 transition-[padding] hover:pl-4 sm:grid-cols-[auto_1fr_auto] sm:items-baseline sm:gap-5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
                    [{c.code} / {c.label.toUpperCase()}]
                  </span>
                  <span className="col-span-2 font-display text-[clamp(1.2rem,2.2vw,1.6rem)] font-medium text-fg break-words sm:col-span-1">
                    {c.value}
                  </span>
                  <span
                    aria-hidden
                    className="row-start-1 col-start-2 justify-self-end font-mono text-fg-dim transition-colors group-hover:text-accent sm:row-auto sm:col-auto"
                  >
                    {c.arrow}
                  </span>
                </div>
              );
              return (
                <li key={c.code} className="group relative">
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="block hover:bg-bg-elev/40"
                    >
                      {Inner}
                    </a>
                  ) : (
                    Inner
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="bg-bg p-6 md:p-12 lg:p-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted">
            [b] / message form
          </p>
          <div className="mt-8">
            <ContactForm defaultReason={reason} />
          </div>
        </div>
      </section>

      <section className="px-6 py-24 md:px-12 md:py-32 lg:px-20">
        <SectionLabel index={9} label="FAQ" meta="quick answers" />
        <div className="mt-10 max-w-3xl">
          <Accordion items={FAQ} />
        </div>
      </section>
    </main>
  );
}
