"use client";

/*
  Home hero (PLAN §2).

  - Display headline broken across two lines with stagger reveal.
  - WireRobot R3F scene behind the text, deferred until idle.
  - Mono viewport readout top-right.
  - Mono caption row below the headline: "FTC TEAM 23786 · 2025-26 · NJ".
  - Status pill bottom-left with current season + accent dot.
*/

import dynamic from "next/dynamic";
import Headline from "./Headline";
import ViewportReadout from "./ViewportReadout";
import SectionLabel from "../layout/SectionLabel";
import R3FBoundary from "./R3FBoundary";

const WireRobot = dynamic(() => import("./WireRobot"), { ssr: false });

export default function Hero() {
  return (
    <section
      id="hero"
      data-glow="on"
      className="relative isolate flex min-h-[88vh] flex-col px-6 pb-12 pt-10 md:px-12 md:pb-20 md:pt-16 lg:px-20"
    >
      {/* Top row: section label + viewport readout */}
      <div className="flex items-start justify-between">
        <SectionLabel index={1} label="Home" meta="Season 2025–26" />
        <ViewportReadout />
      </div>

      {/* R3F scene sits absolutely behind the text. Wrapped so a WebGL
          failure degrades silently — the headline alone is still on-brand. */}
      <R3FBoundary>
        <WireRobot />
      </R3FBoundary>

      <div className="relative mt-auto">
        <Headline lines={["MAKEMINDS", "ROBOTICS."]} />
        <p className="mt-6 max-w-md font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted md:mt-8">
          <span className="text-accent">FTC 23786</span>
          {" · "}Edison, NJ
          {" · "}rookie 2023
        </p>
      </div>

      {/* Bottom row: status + scroll hint */}
      <div className="mt-14 flex items-end justify-between">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted">
          <span className="grid h-2 w-2 place-items-center">
            <span className="block h-2 w-2 animate-pulse rounded-full bg-accent" />
          </span>
          Currently building · DECODE
        </div>
        <p className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-fg-dim md:block">
          scroll ↓
        </p>
      </div>
    </section>
  );
}
