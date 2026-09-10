import { cn } from "@/lib/cn";

/*
  1px horizontal divider in --border. Never thicker. PLAN §Layout system.
  Pass `inset` to indent left/right (in Tailwind spacing units).
*/

type Props = {
  className?: string;
  inset?: number;
  // Optional mono caption rendered above the line, far-right.
  caption?: string;
};

export default function HairlineDivider({ className, inset = 0, caption }: Props) {
  return (
    <div
      className={cn("relative w-full", className)}
      style={inset ? { paddingLeft: `${inset * 4}px`, paddingRight: `${inset * 4}px` } : undefined}
    >
      {caption ? (
        <p className="mb-2 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-fg-dim">
          {caption}
        </p>
      ) : null}
      <div className="h-px w-full bg-border" />
    </div>
  );
}
