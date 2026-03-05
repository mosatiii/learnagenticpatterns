import type { Metadata } from "next";
import { getPMModuleBySlug, pmModules } from "@/data/pm-curriculum";

interface Props {
  params: { slug: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const mod = getPMModuleBySlug(params.slug);

  if (!mod) {
    return {
      title: "Module Not Found | Learn Agentic Patterns",
    };
  }

  const title = `${mod.title} — Agentic AI for Product Managers`;
  const shortDesc = `${mod.subtitle}. ${mod.description.slice(0, 140)}...`;

  return {
    title,
    description: shortDesc,
    keywords: [
      mod.title,
      "agentic AI product manager",
      "AI product decisions",
      "agentic design patterns PM",
      ...mod.relatedPatterns,
    ],
    alternates: {
      canonical: `https://learnagenticpatterns.com/pm/${mod.slug}`,
    },
    openGraph: {
      title,
      description: shortDesc,
      url: `https://learnagenticpatterns.com/pm/${mod.slug}`,
      siteName: "Learn Agentic Patterns",
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  return pmModules.map((m) => ({ slug: m.slug }));
}

export default function PMModuleLayout({ children }: Props) {
  return children;
}
