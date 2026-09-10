"use client";

/*
  Route-segment error boundary. Next renders this when a server component
  in any route throws. Matches the 404 aesthetic so a runtime error still
  looks intentional rather than off-brand.
*/

import Link from "next/link";
import { useEffect } from "react";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.error("[route-error]", error);
    }
  }, [error]);

  return (
    <main className="relative grid min-h-[70vh] place-items-center px-6 md:px-12 lg:px-20">
      <div className="w-full max-w-3xl border border-border bg-bg-elev/60 p-8 md:p-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-warn">
          [err · 500] route faulted
        </p>
        <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight tracking-normal">
          Something tripped a wire.
        </h1>
        <p className="mt-4 max-w-xl text-[14px] leading-[1.6] text-fg-muted">
          The page hit an unexpected error on the server. Try again — most are
          transient. If it keeps happening, we&apos;d love a ping at{" "}
          <a
            href="mailto:info@makemindsrobotics.org"
            className="text-accent underline-offset-4 hover:underline"
          >
            info@makemindsrobotics.org
          </a>
          .
        </p>
        {error.digest ? (
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
            digest · <span className="text-fg-muted">{error.digest}</span>
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center justify-center border border-accent bg-transparent px-5 font-mono text-[11px] uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent hover:text-bg"
          >
            retry →
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center border border-border bg-transparent px-5 font-mono text-[11px] uppercase tracking-[0.2em] text-fg transition-colors hover:border-accent hover:text-accent"
          >
            return home ↗
          </Link>
        </div>
      </div>
    </main>
  );
}
