import Link from "next/link";
import { listPosts } from "@/lib/notebook";
import PageHero from "../_components/layout/PageHero";

export const metadata = {
  title: "Notebook",
  description:
    "Engineering notebook: build-season notes, post-mortems, and design decisions.",
};

export default function NotebookIndex() {
  const posts = listPosts();
  const tags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();

  return (
    <main className="relative">
      <PageHero
        index={7}
        label="Notebook"
        meta="engineering log"
        title={
          <>
          Build season,<br />
          <span className="text-accent">in writing.</span>
          </>
        }
        stats={[
          { label: "Posts", value: posts.length.toString().padStart(2, "0") },
          { label: "Tags", value: tags.length.toString().padStart(2, "0") },
          { label: "Latest", value: posts[0]?.date.slice(5, 7) ?? "--", detail: posts[0]?.date.slice(0, 4) },
          { label: "Feed", value: "RSS" },
        ]}
        panelTitle="Engineering Log"
        panelMeta="design reviews · post-mortems · build notes"
      >
        Short technical posts from the build team: design decisions,
        post-mortems, things that broke. Updated whenever something
        notable ships.
      </PageHero>

      {tags.length > 0 ? (
        <section className="border-b border-border px-6 py-6 md:px-12 lg:px-20">
          <ul className="flex flex-wrap gap-3">
            {tags.map((t) => (
              <li
                key={t}
                className="border border-border bg-bg px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-muted"
              >
                #{t}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="px-6 py-20 md:px-12 lg:px-20">
        <ul className="divide-y divide-border border-y border-border">
          {posts.length === 0 ? (
            <li className="py-10 font-mono text-[12px] uppercase tracking-[0.18em] text-fg-dim">
              [ empty ] no posts yet.
            </li>
          ) : null}
          {posts.map((p, i) => (
            <li key={p.slug}>
              <Link
                href={`/notebook/${p.slug}`}
                className="group grid grid-cols-12 items-baseline gap-4 py-6 transition-[padding] hover:pl-3 md:py-8"
              >
                <span className="col-span-2 font-mono text-[11px] uppercase tracking-[0.18em] text-accent md:col-span-1">
                  [{(i + 1).toString().padStart(2, "0")}]
                </span>
                <span className="col-span-10 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim md:col-span-2">
                  {p.date}
                </span>
                <span className="col-span-12 font-display text-[clamp(1.4rem,2.6vw,1.8rem)] font-semibold leading-tight text-fg group-hover:text-accent md:col-span-7">
                  {p.title}
                  {p.isPlaceholder ? (
                    <span className="ml-3 align-middle font-mono text-[9px] uppercase tracking-[0.18em] text-warn">
                      [draft]
                    </span>
                  ) : null}
                </span>
                <span
                  aria-hidden
                  className="col-span-12 mt-1 font-mono text-fg-dim transition-colors group-hover:text-accent md:col-span-2 md:mt-0 md:text-right"
                >
                  read →
                </span>
                {p.excerpt ? (
                  <p className="col-span-12 mt-2 max-w-2xl text-[13px] leading-[1.6] text-fg-muted md:col-start-4">
                    {p.excerpt}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
