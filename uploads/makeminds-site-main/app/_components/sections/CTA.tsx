/*
  Home closer CTA + footer-adjacent block (PLAN §Pages Home).
  Three large mono-coded actions: Sponsor, Mentor, Join. Each is a real
  link to /contact with a reason query so the form preselects.
*/

import Link from "next/link";
import SectionLabel from "../layout/SectionLabel";
import MagneticCard from "../ui/MagneticCard";
import Reveal from "../effects/Reveal";

const ACTIONS = [
  {
    code: "01",
    label: "Sponsor us",
    blurb: "Cover registration, parts, or travel for the 2025-26 season.",
    href: "/contact?reason=sponsorship",
  },
  {
    code: "02",
    label: "Mentor us",
    blurb: "Engineers, machinists, software folks — we want your time.",
    href: "/contact?reason=mentor",
  },
  {
    code: "03",
    label: "Join us",
    blurb: "Edison-area student? Tryouts open before each season.",
    href: "/contact?reason=join",
  },
];

export default function CTA() {
  return (
    <section
      id="cta"
      data-glow="on"
      className="relative border-t border-border px-6 py-24 md:px-12 md:py-32 lg:px-20"
    >
      <SectionLabel index={6} label="Work with us" meta="three ways in" />
      <Reveal
        as="div"
        className="mt-10 grid grid-cols-1 divide-y divide-border border-y border-border md:grid-cols-3 md:divide-x md:divide-y-0"
      >
        {ACTIONS.map((a) => (
          <MagneticCard key={a.code} pull={5}>
            <Link
              href={a.href}
              className="group flex h-full flex-col gap-6 px-2 py-8 transition-colors hover:bg-bg-elev md:px-6"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
                [{a.code}]
              </span>
              <h3 className="font-display text-[clamp(1.8rem,3.5vw,2.6rem)] font-semibold leading-[1] tracking-normal text-fg group-hover:text-accent">
                {a.label}
              </h3>
              <p className="text-[14px] leading-[1.6] text-fg-muted">{a.blurb}</p>
              <span
                aria-hidden
                className="mt-auto font-mono text-[12px] uppercase tracking-[0.18em] text-fg-dim group-hover:text-accent"
              >
                transmit →
              </span>
            </Link>
          </MagneticCard>
        ))}
      </Reveal>
    </section>
  );
}
