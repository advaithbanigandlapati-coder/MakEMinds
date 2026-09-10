import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import SectionLabel from "./SectionLabel";

type HeroStat = {
  label: string;
  value: string;
  detail?: string;
};

type Props = {
  index: number | string;
  label: string;
  meta?: string;
  title: ReactNode;
  children?: ReactNode;
  stats?: HeroStat[];
  panelTitle?: string;
  panelMeta?: string;
  className?: string;
};

export default function PageHero({
  index,
  label,
  meta,
  title,
  children,
  stats = [],
  panelTitle = "MakEMinds Robotics",
  panelMeta = "FTC 23786 · Edison NJ",
  className,
}: Props) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border px-6 py-16 md:px-12 md:py-20 lg:px-20 lg:py-24",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(100,157,199,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,157,199,0.045)_1px,transparent_1px)] bg-[size:64px_64px] opacity-40"
      />
      <div className="relative grid grid-cols-12 gap-10 lg:items-end">
        <div className="col-span-12 lg:col-span-7">
          <SectionLabel index={index} label={label} meta={meta} />
          <h1 className="mt-8 max-w-5xl font-display text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.94] tracking-normal text-fg">
            {title}
          </h1>
          {children ? (
            <p className="mt-6 max-w-2xl text-[15px] leading-[1.75] text-fg-muted md:text-base">
              {children}
            </p>
          ) : null}
        </div>

        <aside className="col-span-12 border-y border-border py-6 lg:col-span-4 lg:col-start-9 lg:border-l lg:border-y-0 lg:py-0 lg:pl-8">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                live system
              </p>
              <p className="mt-2 font-display text-2xl font-semibold leading-tight tracking-normal text-fg">
                {panelTitle}
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-dim">
                {panelMeta}
              </p>
            </div>
            <div className="relative hidden h-20 w-20 shrink-0 place-items-center overflow-hidden border border-border bg-bg sm:grid">
              <Image
                src="/logo-full.png"
                alt=""
                width={96}
                height={96}
                className="h-16 w-16 object-contain opacity-90"
                sizes="80px"
              />
            </div>
          </div>

          {stats.length > 0 ? (
            <dl className="mt-8 grid grid-cols-2 gap-px bg-border">
              {stats.slice(0, 4).map((stat) => (
                <div key={`${stat.label}-${stat.value}`} className="bg-bg p-4">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-fg-dim">
                    {stat.label}
                  </dt>
                  <dd className="mt-2 font-display text-3xl font-bold leading-none tracking-normal text-fg tabular-nums">
                    {stat.value}
                  </dd>
                  {stat.detail ? (
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-fg-muted">
                      {stat.detail}
                    </p>
                  ) : null}
                </div>
              ))}
            </dl>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
