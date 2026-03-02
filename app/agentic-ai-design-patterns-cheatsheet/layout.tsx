import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agentic AI Design Patterns Cheat Sheet — Free PDF Download",
  description:
    "Free PDF mapping 21 agentic AI design patterns to classical software engineering concepts. Prompt Chaining → Pipe & Filter, Reflection → TDD, and 19 more. Built for senior architects and developers.",
  keywords: [
    "agentic AI design patterns",
    "agentic design patterns",
    "AI agent patterns",
    "LLM architecture patterns",
    "agentic AI cheat sheet",
    "AI design patterns PDF",
    "software engineering AI patterns",
    "multi-agent systems",
    "prompt chaining",
    "reflection pattern",
    "tool use pattern",
    "AI agent architecture",
    "Gang of Four AI",
    "classical design patterns AI",
    "agentic orchestration patterns",
    "context engineering",
  ],
  alternates: {
    canonical:
      "https://learnagenticpatterns.com/agentic-ai-design-patterns-cheatsheet",
  },
  openGraph: {
    title:
      "21 Agentic AI Design Patterns Cheat Sheet — Free PDF for Senior Engineers",
    description:
      "Download the free reference card mapping 21 agentic AI patterns to classical SWE concepts. Prompt Chaining → Pipe & Filter, Reflection → TDD, Multi-Agent → Microservices.",
    url: "https://learnagenticpatterns.com/agentic-ai-design-patterns-cheatsheet",
    type: "website",
    images: [
      {
        url: "/agentic-ai-design-patterns-cheatsheet/opengraph-image",
        width: 1200,
        height: 630,
        alt: "21 Agentic AI Design Patterns Cheat Sheet — Free PDF",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "21 Agentic AI Design Patterns Cheat Sheet — Free PDF",
    description:
      "Free reference card: 21 agentic AI patterns mapped to classical SWE. Prompt Chaining → Pipe & Filter, Reflection → TDD, and 19 more.",
    images: ["/agentic-ai-design-patterns-cheatsheet/opengraph-image"],
  },
};

export default function CheatSheetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
