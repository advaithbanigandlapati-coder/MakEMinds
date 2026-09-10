"use client";

/*
  End-of-page sequential nav (PLAN §Pages order). A wide band that sits below
  the page content and above the footer, offering the previous and next page
  in the canonical NAV order — the "you finished scrolling, here's where to go
  next" pattern from docs sites.

  The order is cyclical so the tour never dead-ends: Contact → Home wraps.
  Renders nothing on routes that aren't one of the eight primary pages (e.g.
  notebook posts, error screens) so it never guesses an order it doesn't know.
*/

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/nav";

export default function PageEndNav() {
  const pathname = usePathname();

  // Only show on exact primary-page matches; deep routes (notebook slugs) have
  // no obvious sibling order.
  const i = NAV.findIndex((n) => n.href === pathname);
  if (i === -1) return null;

  const prev = NAV[(i - 1 + NAV.length) % NAV.length];
  const next = NAV[(i + 1) % NAV.length];

  return (
    <nav
      aria-label="Page navigation"
      className="relative grid grid-cols-2 border-t border-border"
    >
      <Link
        href={prev.href}
        className="group flex flex-col gap-2 border-r border-border px-6 py-10 transition-colors hover:bg-bg-elev md:px-12 md:py-14 lg:px-20"
      >
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-dim">
          <span aria-hidden className="inline-block transition-transform duration-300 ease-out group-hover:-translate-x-1">
            ←
          </span>
          prev / [{prev.index.toString().padStart(2, "0")}]
        </span>
        <span className="font-display text-[clamp(1.4rem,3.4vw,2.4rem)] font-semibold leading-[1] tracking-normal text-fg-muted transition-colors group-hover:text-fg">
          {prev.label}
        </span>
      </Link>

      <Link
        href={next.href}
        className="group flex flex-col items-end gap-2 px-6 py-10 text-right transition-colors hover:bg-bg-elev md:px-12 md:py-14 lg:px-20"
      >
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-dim group-hover:text-accent">
          next / [{next.index.toString().padStart(2, "0")}]
          <span aria-hidden className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">
            →
          </span>
        </span>
        <span className="font-display text-[clamp(1.4rem,3.4vw,2.4rem)] font-semibold leading-[1] tracking-normal text-fg transition-colors group-hover:text-accent">
          {next.label}
        </span>
      </Link>
    </nav>
  );
}
