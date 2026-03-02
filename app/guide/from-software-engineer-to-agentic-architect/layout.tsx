import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "From Software Engineer to Agentic Architect — A Reskilling Guide for the AI Era",
  description:
    "You've shipped production systems for years. AI agents aren't replacing you — they're the next architecture you'll master. A practical guide mapping 21 agentic AI patterns to the SWE concepts you already know.",
  keywords: [
    "will AI replace software engineers",
    "how to stay relevant as a developer with AI",
    "software engineer AI reskilling",
    "agentic AI for senior developers",
    "AI agent architecture guide",
    "from software engineer to AI engineer",
    "agentic design patterns for engineers",
    "AI skills for product managers",
    "survive AI as a developer",
    "transition to AI engineering",
    "agentic AI career guide",
    "software engineering AI patterns",
    "LLM architecture for experienced developers",
  ],
  alternates: {
    canonical:
      "https://learnagenticpatterns.com/guide/from-software-engineer-to-agentic-architect",
  },
  openGraph: {
    title:
      "From Software Engineer to Agentic Architect — Reskilling Guide",
    description:
      "You already know 80% of what agentic AI requires. This guide maps 21 AI agent patterns to classical SWE concepts like Pipe & Filter, TDD, Microservices, and more.",
    url: "https://learnagenticpatterns.com/guide/from-software-engineer-to-agentic-architect",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "From Software Engineer to Agentic Architect",
    description:
      "AI agents aren't replacing senior engineers — they're the next architecture to master. 21 patterns mapped to SWE concepts you already know.",
  },
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
