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

  const title = `${pattern.name} → ${pattern.sweParallel} | Learn Agentic Patterns`;
  const description = `${pattern.description} Mapped to the ${pattern.sweParallelFull} pattern from Software Engineering.`;

  return {
    title,
    description,
    keywords: [
      pattern.name,
      pattern.sweParallel,
      "agentic AI",
      "design pattern",
      "LLM",
      "AI architecture",
      "senior developer",
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
      description,
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
      title: `${pattern.name} → ${pattern.sweParallel}`,
      description,
    },
  };
}

export async function generateStaticParams() {
  return patterns.map((p) => ({ slug: p.slug }));
}

export default function PatternLayout({ children }: Props) {
  return children;
}
