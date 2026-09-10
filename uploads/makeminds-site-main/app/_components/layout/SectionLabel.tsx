import { cn } from "@/lib/cn";

/*
  Section marker rendered at the top-left of every major section.
  Looks like: `[02] PROGRAMS · 2025–26`. PLAN §Layout system.

  Index is mandatory; meta is optional.
*/

type Props = {
  index: number | string;
  label: string;
  meta?: string;
  as?: "h2" | "h3" | "p" | "div";
  className?: string;
};

function pad(index: number | string): string {
  if (typeof index === "string") return index;
  return index.toString().padStart(2, "0");
}

export default function SectionLabel({
  index,
  label,
  meta,
  as: Tag = "p",
  className,
}: Props) {
  return (
    <Tag
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted",
        className,
      )}
    >
      <span className="text-accent">[{pad(index)}]</span>{" "}
      <span className="text-fg">{label}</span>
      {meta ? (
        <>
          <span className="mx-2 text-fg-dim">·</span>
          <span className="text-fg-dim">{meta}</span>
        </>
      ) : null}
    </Tag>
  );
}
