import { Metadata } from "next";
import { getAllBlogPosts } from "@/data/blog";
import { BlogListJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Blog | Learn Agentic Patterns",
  description:
    "Concise, AI-optimized articles about building AI agents. Each post answers one question about agentic design patterns, RAG, MCP, multi-agent systems, and more. Learn one thing, leave knowing it.",
  keywords: [
    "agentic AI blog",
    "AI agents tutorial",
    "build AI agents",
    "agentic design patterns",
    "RAG tutorial",
    "MCP guide",
    "multi-agent systems",
    "prompt chaining",
    "reflection pattern",
    "tool use AI",
    "LLM patterns",
  ],
  alternates: {
    canonical: "https://learnagenticpatterns.com/blog",
  },
  openGraph: {
    title: "Blog | Learn Agentic Patterns",
    description:
      "Concise articles about building AI agents. Each post teaches one concept — no fluff.",
    url: "https://learnagenticpatterns.com/blog",
    type: "website",
    siteName: "Learn Agentic Patterns",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Learn Agentic Patterns",
    description:
      "Concise articles about building AI agents. Each post teaches one concept — no fluff.",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = getAllBlogPosts();

  return (
    <>
      <BlogListJsonLd
        posts={posts.map((p) => ({
          title: p.title,
          slug: p.slug,
          description: p.description,
        }))}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://learnagenticpatterns.com" },
          { name: "Blog", url: "https://learnagenticpatterns.com/blog" },
        ]}
      />
      {children}
    </>
  );
}
