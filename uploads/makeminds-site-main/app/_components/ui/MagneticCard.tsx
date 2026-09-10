"use client";

/*
  Client wrapper that applies useCardMagnet to its single child. Use it
  to opt any card-shaped element into the cursor-magnet interaction
  without converting the whole parent tree to client components.
*/

import { useRef, type ReactNode } from "react";
import { useCardMagnet } from "@/lib/hooks/useCardMagnet";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
  range?: number;
  pull?: number;
};

export default function MagneticCard({ children, className, range, pull }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useCardMagnet(ref, { range, pull });
  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
