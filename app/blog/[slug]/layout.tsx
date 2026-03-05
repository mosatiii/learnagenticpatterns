import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBlogPosts, getBlogPostBySlug } from "@/data/blog";

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const url = `https://learnagenticpatterns.com/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: [
      ...post.tags,
      "agentic AI",
      "AI agents",
      "design patterns",
      "software engineering",
      "build AI agents",
      "LLM patterns",
      "agentic design patterns",
      "learn agentic patterns",
    ],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: ["Mousa Al-Jawaheri"],
      tags: post.tags,
      siteName: "Learn Agentic Patterns",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
