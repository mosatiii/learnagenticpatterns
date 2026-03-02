import { patterns } from "@/data/patterns";
import type { Pattern } from "@/data/patterns";

export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Learn Agentic Patterns",
    url: "https://learnagenticpatterns.com",
    description:
      "A free curriculum mapping 21 Agentic AI Design Patterns to Software Engineering concepts you already know.",
    author: {
      "@type": "Person",
      name: "Mousa Al-Jawaheri",
      url: "https://www.linkedin.com/in/mosatiii/",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function CourseJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Learn Agentic Design Patterns",
    description:
      "A free curriculum mapping 21 Agentic AI Design Patterns to Software Engineering concepts. Built for Senior Developers, Architects, and Technical Leaders.",
    url: "https://learnagenticpatterns.com",
    provider: {
      "@type": "Organization",
      name: "Learn Agentic Patterns",
      url: "https://learnagenticpatterns.com",
    },
    creator: {
      "@type": "Person",
      name: "Mousa Al-Jawaheri",
      url: "https://www.linkedin.com/in/mosatiii/",
    },
    isAccessibleForFree: true,
    inLanguage: "en",
    numberOfCredits: 0,
    educationalLevel: "Advanced",
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "Professional",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT10H",
    },
    hasPart: patterns.map((p, i) => ({
      "@type": "CreativeWork",
      position: i + 1,
      name: `${p.name} → ${p.sweParallel}`,
      description: p.description,
      url: `https://learnagenticpatterns.com/patterns/${p.slug}`,
    })),
    teaches: [
      "Agentic AI Design Patterns",
      "Multi-Agent Systems Architecture",
      "Prompt Chaining",
      "Reflection Pattern",
      "Tool Use Pattern",
      "Planning Pattern",
      "RAG Architecture",
      "Model Context Protocol",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function PatternArticleJsonLd({ pattern }: { pattern: Pattern }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${pattern.name} → ${pattern.sweParallel}`,
    description: pattern.description,
    url: `https://learnagenticpatterns.com/patterns/${pattern.slug}`,
    image: `https://learnagenticpatterns.com/patterns/${pattern.slug}/opengraph-image`,
    datePublished: "2025-01-15T00:00:00Z",
    dateModified: "2026-03-01T00:00:00Z",
    author: {
      "@type": "Person",
      name: "Mousa Al-Jawaheri",
      url: "https://www.linkedin.com/in/mosatiii/",
    },
    publisher: {
      "@type": "Organization",
      name: "Learn Agentic Patterns",
      url: "https://learnagenticpatterns.com",
      logo: {
        "@type": "ImageObject",
        url: "https://learnagenticpatterns.com/icon",
      },
    },
    inLanguage: "en",
    isAccessibleForFree: true,
    isPartOf: {
      "@type": "Course",
      name: "Learn Agentic Design Patterns",
      url: "https://learnagenticpatterns.com",
    },
    keywords: `${pattern.name}, ${pattern.sweParallel}, agentic AI, design patterns, LLM`,
    articleSection: "Agentic Design Patterns",
    wordCount: pattern.description.length + pattern.agenticDefinition.length,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQPageJsonLd({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ItemListJsonLd({
  items,
}: {
  items: { name: string; url: string; description: string; position: number }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      item: {
        "@type": "Course",
        name: item.name,
        url: item.url,
        description: item.description,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
