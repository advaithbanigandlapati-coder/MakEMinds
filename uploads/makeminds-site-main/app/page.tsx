import Hero from "./_components/hero/Hero";
import EventsMarquee from "./_components/sections/EventsMarquee";
import Mission from "./_components/sections/Mission";
import ProgramsPreview from "./_components/sections/ProgramsPreview";
import LatestAchievement from "./_components/sections/LatestAchievement";
import SponsorStrip from "./_components/sections/SponsorStrip";
import CTA from "./_components/sections/CTA";
import HudRail from "./_components/layout/HudRail";

const HOME_SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "events", label: "Events" },
  { id: "mission", label: "Mission" },
  { id: "programs", label: "Programs" },
  { id: "latest", label: "Latest" },
  { id: "sponsors", label: "Sponsors" },
  { id: "cta", label: "Work with us" },
];

export default function Home() {
  return (
    <>
      <HudRail sections={HOME_SECTIONS} />
      <Hero />
      <EventsMarquee />
      <Mission />
      <ProgramsPreview />
      <LatestAchievement />
      <SponsorStrip />
      <CTA />
    </>
  );
}
