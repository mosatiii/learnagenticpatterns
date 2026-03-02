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
    provider: {
      "@type": "Organization",
      name: "Learn Agentic Patterns",
      url: "https://learnagenticpatterns.com",
    },
    author: {
      "@type": "Person",
      name: "Mousa Al-Jawaheri",
    },
    isAccessibleForFree: true,
    numberOfCredits: 0,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT10H",
    },
    syllabusSections: patterns.map((p) => ({
      "@type": "Syllabus",
      name: `${p.name} → ${p.sweParallel}`,
      description: p.description,
    })),
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
    "@type": "Article",
    headline: `${pattern.name} → ${pattern.sweParallel}`,
    description: pattern.description,
    url: `https://learnagenticpatterns.com/patterns/${pattern.slug}`,
    author: {
      "@type": "Person",
      name: "Mousa Al-Jawaheri",
      url: "https://www.linkedin.com/in/mosatiii/",
    },
    publisher: {
      "@type": "Organization",
      name: "Learn Agentic Patterns",
      url: "https://learnagenticpatterns.com",
    },
    isAccessibleForFree: true,
    isPartOf: {
      "@type": "Course",
      name: "Learn Agentic Design Patterns",
      url: "https://learnagenticpatterns.com",
    },
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
