import Link from "next/link";
import { notFound } from "next/navigation";
import { listPosts, loadPost, renderMarkdownToTree } from "@/lib/notebook";
import SectionLabel from "../../_components/layout/SectionLabel";
import HairlineDivider from "../../_components/layout/HairlineDivider";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return listPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = loadPost(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function NotebookPost({ params }: Props) {
  const { slug } = await params;
  const post = loadPost(slug);
  if (!post) notFound();

  const tree = renderMarkdownToTree(post.body);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "SportsTeam",
      name: "MakEMinds Robotics",
      url: "https://makemindsrobotics.org",
    },
    publisher: {
      "@type": "SportsTeam",
      name: "MakEMinds Robotics",
      logo: {
        "@type": "ImageObject",
        url: "https://makemindsrobotics.org/icon.png",
      },
    },
    mainEntityOfPage: `https://makemindsrobotics.org/notebook/${slug}`,
    keywords: post.tags.join(", "),
  };

  return (
    <main className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <section className="px-6 pb-12 pt-10 md:px-12 md:pt-16 lg:px-20">
        <Link
          href="/notebook"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-muted hover:text-accent"
        >
          ← notebook
        </Link>
        <SectionLabel
          index="07"
          label="Post"
          meta={post.date}
          className="mt-8"
        />
        <h1 className="mt-8 max-w-4xl font-display text-[clamp(2.2rem,5.5vw,4rem)] font-bold leading-[1.02] tracking-normal">
          {post.title}
        </h1>
        {post.tags.length ? (
          <ul className="mt-6 flex flex-wrap gap-3">
            {post.tags.map((t) => (
              <li
                key={t}
                className="border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-muted"
              >
                #{t}
              </li>
            ))}
          </ul>
        ) : null}
        {post.isPlaceholder ? (
          <p className="mt-6 inline-block border border-warn/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-warn">
            draft · placeholder content
          </p>
        ) : null}
      </section>

      <HairlineDivider className="my-12 px-6 md:px-12 lg:px-20" />

      <article className="prose-mm mx-auto max-w-3xl px-6 pb-32 md:px-12 lg:px-0">
        {tree.map((node, i) => {
          if (node.kind === "list") {
            return (
              <ul
                key={i}
                className="my-5 list-none space-y-2 border-l border-border pl-4"
              >
                {node.items.map((text, j) => (
                  <li
                    key={j}
                    className="text-[15px] leading-[1.7] text-fg-muted"
                  >
                    <span className="mr-2 font-mono text-[11px] uppercase tracking-[0.18em] text-fg-dim">
                      ›
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            );
          }
          if (node.kind === "heading" && node.level === 2)
            return (
              <h2
                key={i}
                className="mt-12 font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold tracking-normal text-fg"
              >
                {node.text}
              </h2>
            );
          if (node.kind === "heading" && node.level === 3)
            return (
              <h3
                key={i}
                className="mt-8 font-display text-[clamp(1.2rem,2vw,1.5rem)] font-medium tracking-normal text-fg"
              >
                {node.text}
              </h3>
            );
          return (
            <p
              key={i}
              className="mt-5 text-[15px] leading-[1.7] text-fg-muted"
            >
              {node.text}
            </p>
          );
        })}
      </article>
    </main>
  );
}
