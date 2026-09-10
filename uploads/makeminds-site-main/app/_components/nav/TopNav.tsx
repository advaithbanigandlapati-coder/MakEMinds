"use client";

/*
  Top nav (PLAN §4). Mono uppercase labels. Hovering a label slides a 1px
  underline left→right and advances a counter (NN) next to the active item.
  Click on the menu pill opens MenuOverlay.

  Scroll-aware backdrop: once we're past ~80px of scroll, the bar gets a
  bg-bg/80 + backdrop-blur and a hairline bottom border. Over the hero it
  stays fully transparent so the wireframe robot reads clean.
*/

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, findActive } from "@/lib/nav";
import { cn } from "@/lib/cn";
import MenuOverlay from "./MenuOverlay";

export default function TopNav() {
  const pathname = usePathname();
  const active = findActive(pathname);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reset scrolled state when route changes so the backdrop matches the
  // new page's starting scroll position. One-shot read of window.scrollY
  // synced from the router (external system) to React state.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScrolled(window.scrollY > 80);
  }, [pathname]);

  const counter = (hoverIndex ?? active?.index ?? 1).toString().padStart(2, "0");

  return (
    <header
      data-boot-fade
      className={cn(
        "fixed inset-x-0 top-0 z-[80] flex items-center justify-between px-5 py-4 md:px-8 md:py-5",
        "transition-[background-color,backdrop-filter,border-color] duration-300 ease-out",
        scrolled
          ? "border-b border-border bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      {/* Wordmark */}
      <Link
        href="/"
        className="group flex items-center gap-2.5"
        aria-label="MakEMinds Robotics, home"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full border border-border text-accent transition-colors group-hover:border-accent">
          <span className="font-display text-[12px] font-bold leading-none">M</span>
        </span>
        <span className="font-display text-[14px] font-semibold tracking-normal text-fg">
          MakEMinds
        </span>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-fg-dim sm:inline">
          FTC 23786
        </span>
      </Link>

      {/* Desktop nav — abbreviated. Full index lives in the menu overlay. */}
      <nav
        aria-label="Primary"
        className="hidden items-center gap-7 lg:flex"
      >
        {NAV.slice(0, 5).map((item) => {
          const isActive = active?.href === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => setHoverIndex(item.index)}
              onMouseLeave={() => setHoverIndex(null)}
              className={cn(
                "group relative font-mono text-[11px] uppercase tracking-[0.18em] transition-colors",
                isActive ? "text-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              {item.label}
              <span
                aria-hidden
                className={cn(
                  "absolute -bottom-1 left-0 h-px bg-accent transition-[width] duration-300 ease-out",
                  isActive ? "w-full" : "w-0 group-hover:w-full",
                )}
              />
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        <span
          aria-hidden
          className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-fg-dim md:inline"
        >
          ({counter}) / 08
        </span>
        {/* Dedicated Contact CTA — always reachable from the bar, not just the
            overlay. Accent-tinted to read as the primary action. */}
        <Link
          href="/contact"
          aria-current={active?.href === "/contact" ? "page" : undefined}
          className={cn(
            "hidden items-center border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors sm:inline-flex",
            active?.href === "/contact"
              ? "border-accent bg-accent/10 text-accent"
              : "border-accent/40 text-accent hover:border-accent hover:bg-accent/10",
          )}
        >
          Contact
        </Link>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-expanded={menuOpen}
          aria-controls="mm-menu-overlay"
          className="group inline-flex items-center gap-2 border border-border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-fg transition-colors hover:border-accent hover:text-accent"
        >
          <span className="grid place-items-center">
            <span className="block h-px w-3.5 bg-current" />
            <span className="mt-1 block h-px w-3.5 bg-current" />
          </span>
          Menu
        </button>
      </div>

      <MenuOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeHref={active?.href}
      />
    </header>
  );
}
