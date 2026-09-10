"use client";

/*
  Full-bleed menu overlay (PLAN §4). Left half: giant index list.
  Right half: live preview of the hovered page (blurb + accent meta).
  Open animates in via 12 vertical bars expanding from edges to fill;
  close reverses. Esc closes. Click outside closes.

  Focus management: on open we move focus to the close button and trap
  Tab inside the dialog; the previously focused element is restored on
  close. PLAN §4 specs the keyboard-test path.

  Portaled to document.body: the overlay is `fixed inset-0` and must be
  viewport-relative. TopNav's <header> applies a backdrop-filter once
  scrolled, which establishes a containing block for fixed descendants
  and would otherwise clamp this overlay to the header's small box. The
  portal escapes that (and any future transformed/filtered ancestor).
*/

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/cn";

type Props = {
  open: boolean;
  onClose: () => void;
  activeHref?: string;
};

export default function MenuOverlay({ open, onClose, activeHref }: Props) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Portal target only exists in the browser. Gate the createPortal call on
  // a post-mount flag so server render and first client render agree (no
  // hydration mismatch) and document is guaranteed to exist. This one-shot
  // commit-time flip is the standard SSR portal pattern, not a synchronizing
  // effect; the lint rule's perf concern (cascading renders) does not apply.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = overlayRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(
          "a[href], button, [tabindex]:not([tabindex='-1'])",
        ),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  const previewItem = hoverIndex
    ? NAV.find((n) => n.index === hoverIndex)
    : NAV.find((n) => n.href === activeHref) ?? NAV[0];

  if (!mounted) return null;

  return createPortal(
    <div
      id="mm-menu-overlay"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className={cn(
        "fixed inset-0 z-[90]",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      {/* Vertical bars: 12 columns sliding in from the top */}
      <div className="absolute inset-0 grid grid-cols-12">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            aria-hidden
            className={cn(
              "h-full origin-top bg-bg-elev transition-transform ease-out",
              open ? "scale-y-100" : "scale-y-0",
            )}
            style={{
              transitionDuration: "520ms",
              transitionDelay: open ? `${i * 18}ms` : `${(11 - i) * 14}ms`,
            }}
          />
        ))}
      </div>

      {/* Content layer */}
      <div
        className={cn(
          "relative grid h-full grid-cols-1 gap-10 px-6 py-10 md:grid-cols-12 md:px-12 md:py-16",
          "transition-opacity ease-out",
          open ? "opacity-100 delay-[280ms] duration-500" : "opacity-0 duration-150",
        )}
      >
        {/* Top bar */}
        <div className="col-span-full flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-muted">
            [ index ] / make-minds-robotics
          </p>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="group inline-flex items-center gap-2 border border-border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-fg transition-colors hover:border-accent hover:text-accent"
            aria-label="Close menu"
          >
            <span aria-hidden>×</span> Close
          </button>
        </div>

        {/* Index */}
        <nav
          aria-label="All pages"
          className="col-span-full flex flex-col gap-1 md:col-span-7"
        >
          {NAV.map((item) => {
            const isActive = item.href === activeHref;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                onMouseEnter={() => setHoverIndex(item.index)}
                onFocus={() => setHoverIndex(item.index)}
                className={cn(
                  "group grid grid-cols-[auto_1fr_auto] items-baseline gap-5 border-b border-border/60 py-3 transition-colors hover:border-accent",
                  isActive ? "text-fg" : "text-fg-muted hover:text-fg",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[12px] tracking-[0.16em]",
                    isActive ? "text-accent" : "text-fg-dim group-hover:text-accent",
                  )}
                >
                  [{item.index.toString().padStart(2, "0")}]
                </span>
                <span className="font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1] tracking-normal">
                  {item.label}
                </span>
                <span
                  aria-hidden
                  className="font-mono text-[12px] text-fg-dim group-hover:text-accent"
                >
                  →
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Preview pane */}
        <aside
          aria-live="polite"
          className="hidden flex-col justify-between border-l border-border pl-8 md:col-span-5 md:flex"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg-dim">
              now hovering
            </p>
            <p className="mt-4 font-display text-2xl font-medium leading-tight text-fg">
              {previewItem?.label}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-[1.6] text-fg-muted">
              {previewItem?.blurb}
            </p>
          </div>
          <div className="space-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
            <p>FTC team 23786 · edison nj</p>
            <p>season 2025–26</p>
            <p>info@makemindsrobotics.org</p>
          </div>
        </aside>
      </div>
    </div>,
    document.body,
  );
}
