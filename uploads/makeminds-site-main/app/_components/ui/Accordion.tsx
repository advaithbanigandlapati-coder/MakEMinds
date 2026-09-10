"use client";

/*
  Accordion (PLAN §Pages /contact FAQ). Uses native <details>/<summary> so
  it remains keyboard-accessible and works without JS. Styling matches the
  rest of the system: 1px hairline rows, mono bracket index, accent on hover.
*/

import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Item = {
  q: string;
  a: ReactNode;
};

type Props = {
  items: Item[];
  className?: string;
};

export default function Accordion({ items, className }: Props) {
  return (
    <div className={cn("divide-y divide-border border-y border-border", className)}>
      {items.map((item, i) => (
        <details
          key={i}
          className="group/acc px-1 py-4 [&_summary::-webkit-details-marker]:hidden [&_summary]:list-none"
        >
          <summary className="flex cursor-pointer items-baseline gap-4 text-left">
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim group-hover/acc:text-accent">
              [{(i + 1).toString().padStart(2, "0")}]
            </span>
            <span className="flex-1 font-display text-[18px] font-medium text-fg group-hover/acc:text-accent">
              {item.q}
            </span>
            <span
              aria-hidden
              className="font-mono text-fg-dim transition-transform duration-300 group-open/acc:rotate-45 group-hover/acc:text-accent"
            >
              +
            </span>
          </summary>
          <div className="mt-3 pl-[calc(0.18em+44px)] text-[14px] leading-[1.65] text-fg-muted">
            {item.a}
          </div>
        </details>
      ))}
    </div>
  );
}
