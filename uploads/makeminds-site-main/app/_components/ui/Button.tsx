import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/*
  Three variants:
  - "primary": filled with accent, dark text. Headline CTA.
  - "ghost": transparent, border in fg-dim, accent text on hover. Most nav uses this.
  - "terminal": mono uppercase with a bracketed arrow, e.g. `TRANSMIT →`.

  Polymorphic via `as` so we can swap between <button>, <a>, or Next <Link>.
*/

type Variant = "primary" | "ghost" | "terminal";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 select-none transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "rounded-none bg-accent text-bg hover:bg-accent-hi font-display font-semibold tracking-normal",
  ghost:
    "rounded-none border border-border text-fg hover:border-accent hover:text-accent font-display font-medium tracking-normal",
  terminal:
    "rounded-none font-mono uppercase tracking-[0.16em] text-accent hover:text-accent-hi",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[12px]",
  md: "h-12 px-6 text-[14px]",
};

type ButtonOwnProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type PolyProps<E extends ElementType> = ButtonOwnProps & {
  as?: E;
} & Omit<ComponentPropsWithoutRef<E>, keyof ButtonOwnProps | "as">;

export default function Button<E extends ElementType = "button">({
  as,
  variant = "ghost",
  size = "md",
  className,
  children,
  ...rest
}: PolyProps<E>) {
  // Loosen the type so React 19's stricter ElementType<children: never> default
  // doesn't reject our generic <Tag>. The runtime constraint comes from the
  // PolyProps signature, which already validates allowed props per element.
  const Tag = (as ?? "button") as React.ElementType<{ className?: string; children?: ReactNode }>;
  return (
    <Tag
      className={cn(base, variants[variant], sizes[size], className)}
      {...(rest as Record<string, unknown>)}
    >
      {children}
    </Tag>
  );
}
