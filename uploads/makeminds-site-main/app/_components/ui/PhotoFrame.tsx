import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/cn";

/*
  PhotoFrame (PLAN §Photo treatment).

  Wraps next/image with the brand duotone + grain pipeline:
    grayscale(1) contrast(1.05) on the image,
    lighten blend over a tinted --bg-elev surface,
    SVG noise overlay at low opacity,
    soft inner vignette.

  Optional mono coordinate caption renders below the image.
*/

type Props = Omit<ImageProps, "className"> & {
  className?: string;
  /** Mono caption rendered below the frame, right-aligned. e.g. "FIG. 04 — DECODE / 2025" */
  caption?: string;
  /** Aspect ratio class — e.g. "aspect-[4/3]" or "aspect-video". Defaults to 4/3. */
  aspect?: string;
};

export default function PhotoFrame({
  className,
  caption,
  aspect = "aspect-[4/3]",
  alt,
  ...imgProps
}: Props) {
  return (
    <figure className={cn("group/photo block", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden bg-bg-elev",
          aspect,
        )}
      >
        {/* The image itself, desaturated + tinted via blend mode. */}
        <Image
          alt={alt}
          {...imgProps}
          className="absolute inset-0 h-full w-full object-cover mix-blend-lighten transition-transform duration-700 ease-out group-hover/photo:scale-[1.02] [filter:grayscale(1)_contrast(1.05)]"
        />
        {/* Accent wash so the photo reads as part of the page. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-accent/[0.06] mix-blend-overlay"
        />
        {/* Grain. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
        {/* Inner vignette. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(5,5,6,0.55) 100%)",
          }}
        />
      </div>
      {caption ? (
        <figcaption className="mt-2 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-fg-dim">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
