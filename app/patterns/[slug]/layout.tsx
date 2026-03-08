import type { Metadata } from "next";
import { getPatternBySlug, patterns } from "@/data/patterns";
import { FAQPageJsonLd } from "@/components/JsonLd";

interface Props {
  params: { slug: string };
  children: React.ReactNode;
}

function buildPatternFaqs(pattern: { name: string; agenticDefinition: string; sweParallelFull: string; mapping: { similarity: string; divergence: string }; productionNotes: string[] }) {
  return [
    { question: `When should I use the ${pattern.name} pattern?`, answer: pattern.agenticDefinition },
    { question: `How does ${pattern.name} relate to ${pattern.sweParallelFull}?`, answer: `${pattern.mapping.similarity} However, there is a key divergence: ${pattern.mapping.divergence}` },
    { question: `What are the production trade-offs of ${pattern.name}?`, answer: pattern.productionNotes.join(" ") },
  ];
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

export default async function PatternLayout({ children, params }: Props) {
  const pattern = getPatternBySlug(params.slug);
  const faqs = pattern ? buildPatternFaqs(pattern) : [];

  return (
    <>
      {faqs.length > 0 && <FAQPageJsonLd faqs={faqs} />}
      {children}
    </>
  );
}
