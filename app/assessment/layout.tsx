import type { Metadata } from "next";
import { FAQPageJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Will AI Replace Me? Free AI-Readiness Assessment",
  description:
    "Find out if AI will replace your job. Free AI-powered assessment for Product Managers, Developers, Designers, and Writers. Get your AI-proof score in 3 minutes.",
  keywords: [
    "will AI replace me",
    "will AI replace product managers",
    "will AI replace PMs",
    "will AI replace software engineers",
    "will AI replace designers",
    "will AI replace writers",
    "AI proof career",
    "AI readiness assessment",
    "AI career assessment",
    "will AI take my job",
    "AI skills assessment",
    "product manager AI",
    "PM AI readiness",
    "developer AI readiness",
    "future proof career AI",
    "AI product management",
  ],
  alternates: {
    canonical: "https://learnagenticpatterns.com/assessment",
  },
  openGraph: {
    title: "Will AI Replace Me? — Free AI-Readiness Assessment",
    description:
      "Get an honest, AI-powered analysis of your career in 3 minutes. Product Managers, Developers, Designers, and Writers.",
    url: "https://learnagenticpatterns.com/assessment",
    siteName: "Learn Agentic Patterns",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Will AI Replace Me? — Free Assessment",
    description:
      "Find out your AI-proof score. Free assessment for PMs, Developers, Designers, and Writers.",
  },
};

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <FAQPageJsonLd
        faqs={[
          {
            question: "Will AI replace product managers?",
            answer:
              "AI is already automating large chunks of PM work — first-draft PRDs, competitive research, data pulls, status updates, and metric summaries. But the core of product management — understanding user needs through empathy, making strategic trade-off decisions, aligning stakeholders, and defining what to build and why — requires human judgment AI can't replicate. The PMs most at risk are 'ticket factory' PMs who translate stakeholder requests into specs. The PMs who thrive understand how AI products work architecturally (agentic patterns like orchestration, routing, guardrails) and can spec, evaluate, and prioritize AI features. Take the free assessment at learnagenticpatterns.com/assessment to find your AI-proof score.",
          },
          {
            question: "Will AI replace software engineers?",
            answer:
              "No — but it will change what software engineers do. Senior developers who understand distributed systems, design patterns, and production software already have 80% of the foundation for agentic AI. The 21 agentic design patterns (Prompt Chaining, Reflection, Multi-Agent, etc.) map directly to classical SWE concepts like Pipe & Filter, TDD, and Microservices. Engineers who learn these patterns transition from building traditional systems to architecting intelligent autonomous systems. Take the free assessment at learnagenticpatterns.com/assessment to find out your AI-readiness score.",
          },
          {
            question: "Will AI replace designers?",
            answer:
              "AI is replacing design execution — generating layouts, images, and variations — but it cannot replace design thinking. Designers who survive are those who think in systems (not screens), base decisions on user research (not aesthetics alone), and can sell their decisions to stakeholders with data. AI becomes a power tool for exploration, not a replacement for strategic design. The designers most at risk are those whose work is primarily visual execution without strategic depth.",
          },
          {
            question: "Will AI replace writers?",
            answer:
              "AI is replacing commodity writing — blog posts researched from existing sources, template-based copy, generic content. Writers who survive are those with a distinctive voice, deep domain expertise, original sourcing (interviews, investigations), and the ability to tie content to business outcomes. The shift is from 'content writer' to 'content strategist' — someone who creates original value AI cannot replicate.",
          },
          {
            question: "How do I know if AI will take my job?",
            answer:
              "Take the free 'Will AI Replace Me?' assessment at learnagenticpatterns.com/assessment. It asks targeted questions about your skills, work style, and AI exposure, then uses AI to generate a personalized report with your AI-proof score, your strengths, your vulnerabilities, a 30-day action plan, and a ready-to-use elevator pitch. Available for Product Managers, Developers, Designers, and Writers.",
          },
          {
            question: "What skills are AI-proof in 2026?",
            answer:
              "Across all professions, the AI-proof skills are: (1) Strategic thinking — defining problems, not just solving given ones, (2) Human connection — interviews, relationships, empathy, stakeholder management, (3) Systems thinking — building frameworks that scale, not one-off outputs, (4) Domain expertise — deep knowledge AI can't synthesize from surface-level data, (5) AI tool proficiency — using AI as a power tool rather than competing with it or ignoring it.",
          },
        ]}
      />
      {children}
    </>
  );
}
