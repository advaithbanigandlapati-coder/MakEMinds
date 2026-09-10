/*
  Canonical site nav. Index drives the [01] [02] markers shown in the
  TopNav counter and the MenuOverlay left column. Order matters and is
  the same as PLAN §Pages.
*/

export type NavItem = {
  index: number;
  label: string;
  href: string;
  // Short tagline shown in the menu overlay preview pane.
  blurb: string;
};

export const NAV: readonly NavItem[] = [
  { index: 1, label: "Home", href: "/", blurb: "Mission, boot loader, current season at a glance." },
  { index: 2, label: "Team", href: "/team", blurb: "Roster, roles, build leads, mentor crew." },
  { index: 3, label: "Programs", href: "/programs", blurb: "FTC, FLL, outreach. Season timeline." },
  { index: 4, label: "Robot", href: "/robot", blurb: "Current-season robot. Specs. Build journal." },
  { index: 5, label: "Achievements", href: "/achievements", blurb: "27 events, 8 awards, climbing." },
  { index: 6, label: "Sponsors", href: "/sponsors", blurb: "Who funds the build. Sponsor packet." },
  { index: 7, label: "Notebook", href: "/notebook", blurb: "Engineering blog. Build-season tags." },
  { index: 8, label: "Contact", href: "/contact", blurb: "Talk to us. Sponsor, mentor, judge, partner." },
] as const;

export function findActive(pathname: string): NavItem | undefined {
  // Exact match wins, then longest-prefix match (so /notebook/[slug]
  // highlights "Notebook").
  const exact = NAV.find((n) => n.href === pathname);
  if (exact) return exact;
  return NAV.filter((n) => n.href !== "/" && pathname.startsWith(n.href)).sort(
    (a, b) => b.href.length - a.href.length,
  )[0];
}
