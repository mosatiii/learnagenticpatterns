import type { Metadata } from "next";
import { getPatternBySlug, patterns } from "@/data/patterns";

interface Props {
  params: { slug: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pattern = getPatternBySlug(params.slug);

  if (!pattern) {
    return {
      title: "Pattern Not Found | Learn Agentic Patterns",
    };
  }

  const title = `${pattern.name} → ${pattern.sweParallel} (Free Guide)`;
  const shortDesc = `What is ${pattern.name} in agentic AI? It maps to ${pattern.sweParallel} in SWE. Free breakdown with code examples, architecture diagram, and interactive exercise.`;

  return {
    title,
    description: shortDesc,
    keywords: [
      pattern.name,
      `what is ${pattern.name.toLowerCase()}`,
      `${pattern.name.toLowerCase()} pattern`,
      `${pattern.name.toLowerCase()} agentic AI`,
      pattern.sweParallel,
      "agentic AI",
      "design pattern",
      "LLM",
      "AI architecture",
      "build AI agents",
    ],
    authors: [
      {
        name: "Mousa Al-Jawaheri",
        url: "https://www.linkedin.com/in/mosatiii/",
      },
    ],
    alternates: {
      canonical: `https://learnagenticpatterns.com/patterns/${pattern.slug}`,
    },
    openGraph: {
      title,
      description: shortDesc,
      url: `https://learnagenticpatterns.com/patterns/${pattern.slug}`,
      siteName: "Learn Agentic Patterns",
      type: "article",
      publishedTime: "2025-01-15T00:00:00Z",
      modifiedTime: "2026-03-01T00:00:00Z",
      authors: ["Mousa Al-Jawaheri"],
      section: "Agentic Design Patterns",
      tags: [pattern.name, pattern.sweParallel, "Agentic AI", "Design Patterns"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pattern.name} → ${pattern.sweParallel} | Free Guide`,
      description: shortDesc,
    },
  };
}

export async function generateStaticParams() {
  return patterns.map((p) => ({ slug: p.slug }));
}

export default function PatternLayout({ children }: Props) {
  return children;
}
