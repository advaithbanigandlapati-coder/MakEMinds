import Link from "next/link";

export const metadata = {
  title: "404 · Connection refused",
};

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] flex-col items-start px-6 py-20 font-mono text-[13px] leading-[1.7] text-fg-muted md:px-12 lg:px-20">
      <pre className="whitespace-pre-wrap text-[clamp(11px,1.5vw,13px)]">
        <span className="text-accent">[ make-minds-robotics.boot ]</span>
        {"\n"}
        <span className="text-fg">{`> resolving requested route`}</span>
        {"\n"}
        <span>{`  ▸ ENOENT — route not found`}</span>
        {"\n"}
        <span>{`  ▸ status 404`}</span>
        {"\n"}
        <span className="text-warn">{`> connection refused.`}</span>
      </pre>
      <p className="mt-10 max-w-md text-fg-muted">
        Either the page moved or never existed. The boot loader doesn&apos;t
        replay on internal navigation, so this isn&apos;t lost in a typewriter
        somewhere — it just isn&apos;t there.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center border border-accent px-6 font-mono text-[12px] uppercase tracking-[0.2em] text-accent transition-colors hover:bg-accent hover:text-bg"
        >
          ← home
        </Link>
        <Link
          href="/notebook"
          className="inline-flex h-12 items-center justify-center border border-border px-6 font-mono text-[12px] uppercase tracking-[0.2em] text-fg transition-colors hover:border-accent hover:text-accent"
        >
          notebook
        </Link>
        <Link
          href="/contact"
          className="inline-flex h-12 items-center justify-center border border-border px-6 font-mono text-[12px] uppercase tracking-[0.2em] text-fg transition-colors hover:border-accent hover:text-accent"
        >
          contact
        </Link>
      </div>
    </main>
  );
}
