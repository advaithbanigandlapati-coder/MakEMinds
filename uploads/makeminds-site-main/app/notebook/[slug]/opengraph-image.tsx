import { loadPost, listPosts } from "@/lib/notebook";
import { renderOg, ogSize, ogContentType } from "@/lib/ogTemplate";

export const runtime = "nodejs"; // listPosts uses fs, can't run on edge
export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Engineering notebook post · MakEMinds Robotics";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return listPosts().map((p) => ({ slug: p.slug }));
}

export default async function PostOG({ params }: Props) {
  const { slug } = await params;
  const post = loadPost(slug);
  const title = post
    ? post.title.length > 32
      ? post.title.slice(0, 30).toUpperCase() + "..."
      : post.title.toUpperCase()
    : "NOTEBOOK";
  return renderOg({
    title,
    meta: post ? `NOTEBOOK · ${post.date}` : "NOTEBOOK",
  });
}
