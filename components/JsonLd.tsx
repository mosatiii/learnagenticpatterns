import { patterns } from "@/data/patterns";
import type { Pattern } from "@/data/patterns";
import type { BlogPost } from "@/data/blog";

const AUTHOR_SCHEMA = {
  "@type": "Person" as const,
  name: "Mousa Al-Jawaheri",
  url: "https://www.linkedin.com/in/mosatiii/",
  jobTitle: "Agentic AI Architect & Educator",
  alumniOf: [
    {
      "@type": "EducationalOrganization" as const,
      name: "University of Waterloo",
      department: "Master of Business, Entrepreneurship & Technology (MBET)",
    },
    {
      "@type": "EducationalOrganization" as const,
      name: "American University of Iraq, Sulaimani",
      department: "BSc. Software Engineering",
    },
  ],
  knowsAbout: [
    "Agentic AI Design Patterns",
    "Software Architecture",
    "Multi-Agent Systems",
    "LLM Orchestration",
    "AI Product Development",
  ],
  sameAs: [
    "https://www.linkedin.com/in/mosatiii/",
    "https://github.com/mosatiii",
  ],
};

export function WebSiteJsonLd() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Learn Agentic Patterns",
    alternateName: [
      "learnagenticpatterns",
      "learnagenticpatterns.com",
      "Learn Agentic AI Patterns",
    ],
    url: "https://learnagenticpatterns.com",
    description:
      "Free curriculum teaching agentic AI design patterns through two tracks: a Developer Track (21 patterns mapped to SWE concepts, code examples, and build games) and a Product Manager Track (10 decision modules, tradeoff frameworks, and product games). Complements LangChain, Anthropic, and DeepLearning.AI by teaching the architectural 'why' behind AI agent systems.",
    author: AUTHOR_SCHEMA,
    potentialAction: {
      "@type": "SearchAction",
      target: "https://learnagenticpatterns.com/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Learn Agentic Patterns",
    alternateName: [
      "learnagenticpatterns",
      "learnagenticpatterns.com",
      "Learn Agentic AI Patterns",
    ],
    url: "https://learnagenticpatterns.com",
    logo: "https://learnagenticpatterns.com/icon",
    description:
      "Free educational platform teaching agentic AI design patterns to developers and product managers. Developer Track: 21 patterns with SWE mappings and build exercises. PM Track: 10 decision-focused modules with product games. Built for senior developers, architects, technical leaders, and product managers.",
    founder: AUTHOR_SCHEMA,
    sameAs: [
      "https://learnagenticpatterns.com",
    ],
    knowsAbout: [
      "Agentic AI Design Patterns",
      "AI Agent Architecture",
      "Multi-Agent Systems",
      "RAG (Retrieval-Augmented Generation)",
      "Model Context Protocol (MCP)",
      "LLM Orchestration",
      "Prompt Chaining",
      "AI Software Engineering",
      "AI Product Management",
      "AI Product Strategy",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
    </>
  );
}

export function CourseJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Learn Agentic Design Patterns",
    description:
      "Free two-track curriculum for agentic AI. Developer Track: 21 design patterns mapped to SWE concepts (Prompt Chaining → Pipe & Filter, Reflection → TDD, Multi-Agent → Microservices, RAG, MCP, and 16 more) with code examples and build exercises. Product Manager Track: 11 decision-focused modules (including a deep-dive on AI coding tools: Claude Code, OpenAI Codex, Cursor, Copilot, Gemini, Windsurf, Amazon Q) with tradeoff frameworks, product games (Ship or Skip, Budget Builder), and zero code required.",
    url: "https://learnagenticpatterns.com",
    provider: {
      "@type": "Organization",
      name: "Learn Agentic Patterns",
      url: "https://learnagenticpatterns.com",
    },
    creator: AUTHOR_SCHEMA,
    isAccessibleForFree: true,
    inLanguage: "en",
    numberOfCredits: 0,
    educationalLevel: "Advanced",
    audience: [
      {
        "@type": "EducationalAudience",
        educationalRole: "Professional",
        audienceType: "Senior Developers & Software Architects",
      },
      {
        "@type": "EducationalAudience",
        educationalRole: "Professional",
        audienceType: "Product Managers & Product Leaders",
      },
    ],
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: "PT10H",
    },
    numberOfLessons: 32,
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
      "Guardrails and Safety Patterns",
      "Agent-to-Agent Communication (A2A)",
      "AI Product Decision Frameworks",
      "Cost vs Quality vs Latency Tradeoffs",
      "AI Architecture for Product Managers",
      "Token Budget Allocation",
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
  const articleBody = [
    pattern.agenticDefinition,
    pattern.description,
    `How ${pattern.name} maps to ${pattern.sweParallelFull}: ${pattern.mapping.similarity}`,
    `Key divergence from classical ${pattern.sweParallel}: ${pattern.mapping.divergence}`,
    `Key takeaway: ${pattern.keyTakeaway}`,
  ].join("\n\n");

  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${pattern.name} → ${pattern.sweParallel}`,
    description: pattern.description,
    articleBody,
    url: `https://learnagenticpatterns.com/patterns/${pattern.slug}`,
    image: `https://learnagenticpatterns.com/patterns/${pattern.slug}/opengraph-image`,
    datePublished: "2025-01-15T00:00:00Z",
    dateModified: "2026-03-01T00:00:00Z",
    author: AUTHOR_SCHEMA,
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
    about: [
      {
        "@type": "Thing",
        name: pattern.name,
        description: pattern.agenticDefinition,
      },
      {
        "@type": "Thing",
        name: pattern.sweParallelFull,
        description: `Classical software engineering pattern that maps to ${pattern.name}. Similarity: ${pattern.mapping.similarity}`,
      },
    ],
    keywords: `${pattern.name}, ${pattern.sweParallel}, ${pattern.sweParallelFull}, agentic AI, design patterns, LLM, software engineering`,
    articleSection: "Agentic Design Patterns",
    wordCount: articleBody.length,
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

export function CheatSheetJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "21 Agentic AI Design Patterns Cheat Sheet",
    description:
      "Free PDF mapping 21 agentic AI design patterns to classical software engineering concepts. Prompt Chaining → Pipe & Filter, Reflection → TDD, and 19 more.",
    url: "https://learnagenticpatterns.com/agentic-ai-design-patterns-cheatsheet",
    isAccessibleForFree: true,
    author: AUTHOR_SCHEMA,
    publisher: {
      "@type": "Organization",
      name: "Learn Agentic Patterns",
      url: "https://learnagenticpatterns.com",
    },
    mainEntity: {
      "@type": "DigitalDocument",
      name: "21 Agentic AI Design Patterns Every Senior Engineer Needs in 2026",
      description:
        "A comprehensive reference card mapping 21 agentic AI design patterns to classical software engineering concepts including Pipe & Filter, TDD, Microservices, and more.",
      encodingFormat: "application/pdf",
      isAccessibleForFree: true,
      educationalLevel: "Advanced",
      audience: {
        "@type": "EducationalAudience",
        educationalRole: "Professional",
        audienceType: "Senior Software Engineers",
      },
      author: AUTHOR_SCHEMA,
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
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://learnagenticpatterns.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Agentic AI Design Patterns Cheat Sheet",
          item: "https://learnagenticpatterns.com/agentic-ai-design-patterns-cheatsheet",
        },
      ],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are agentic AI design patterns?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Agentic AI design patterns are reusable architectural blueprints for building AI systems that can perceive, reason, plan, and act autonomously. They include patterns like Prompt Chaining, Reflection, Tool Use, Planning, and Multi-Agent Collaboration. Each maps directly to classical software engineering patterns.",
        },
      },
      {
        "@type": "Question",
        name: "Who is this cheat sheet for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Senior software engineers, architects, engineering managers, and technical leaders who already understand distributed systems, design patterns, and production software — and want to translate that expertise into agentic AI fluency.",
        },
      },
      {
        "@type": "Question",
        name: "Is this really free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The PDF is a direct download with no email gate and no signup wall. If you find it valuable, share it with your team.",
        },
      },
      {
        "@type": "Question",
        name: "How is this different from Andrew Ng's agentic patterns?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Andrew Ng identified 4 core agentic patterns. This cheat sheet covers all 21 patterns from Antonio Gullí's framework and uniquely maps each one to a classical software engineering equivalent — something no other resource does.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Blog — Article + FAQPage (dual schema for maximum AI discoverability)
// ---------------------------------------------------------------------------

export function BlogPostJsonLd({ post }: { post: BlogPost }) {
  const url = `https://learnagenticpatterns.com/blog/${post.slug}`;

  const articleBody = [
    post.tldr,
    ...post.sections.map((s) => [s.heading, s.body].filter(Boolean).join(": ")),
    `Key Takeaway: ${post.keyTakeaway}`,
  ].join("\n\n");

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.description,
    articleBody,
    url,
    datePublished: `${post.publishedAt}T00:00:00Z`,
    dateModified: `${post.updatedAt}T00:00:00Z`,
    author: AUTHOR_SCHEMA,
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
      "@type": "Blog",
      name: "Learn Agentic Patterns Blog",
      url: "https://learnagenticpatterns.com/blog",
    },
    keywords: post.tags.join(", ") + ", agentic AI, AI agents, design patterns",
    articleSection: "Agentic AI",
    wordCount: articleBody.split(/\s+/).length,
    timeRequired: `PT${post.readingTime}M`,
    about: {
      "@type": "Thing",
      name: post.title.replace(/[?:]/g, ""),
      description: post.aiAnswer,
    },
  };

  // FAQ schema with the AI Q&A — this makes the post show up when AI
  // systems or search engines encounter the question.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: post.aiQuestion,
        acceptedAnswer: {
          "@type": "Answer",
          text: post.aiAnswer,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

export function BlogListJsonLd({
  posts,
}: {
  posts: { title: string; slug: string; description: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Learn Agentic Patterns Blog",
    description:
      "Concise, AI-optimized articles about building AI agents — agentic design patterns, RAG, MCP, multi-agent systems, and more.",
    url: "https://learnagenticpatterns.com/blog",
    author: AUTHOR_SCHEMA,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      url: `https://learnagenticpatterns.com/blog/${p.slug}`,
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
