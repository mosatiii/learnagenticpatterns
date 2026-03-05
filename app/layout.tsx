import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AnimatedGrid from "@/components/AnimatedGrid";
import Providers from "@/components/Providers";
import {
  WebSiteJsonLd,
  CourseJsonLd,
  FAQPageJsonLd,
  ItemListJsonLd,
} from "@/components/JsonLd";
import { patterns } from "@/data/patterns";

export const metadata: Metadata = {
  metadataBase: new URL("https://learnagenticpatterns.com"),
  title: {
    default:
      "Learn Agentic Patterns | 21 AI Design Patterns for Senior Developers",
    template: "%s | Learn Agentic Patterns",
  },
  description:
    "What is agentic AI? How do you build AI agents? Learn the 21 agentic design patterns that map to software engineering concepts you already know — prompt chaining (Pipe & Filter), reflection (TDD), multi-agent (Microservices), RAG, MCP, and more. Free curriculum with interactive building exercises. Built for senior developers, architects, and technical leaders.",
  keywords: [
    "agentic AI",
    "what is agentic AI",
    "agentic design patterns",
    "AI design patterns",
    "how to build AI agents",
    "build AI agents",
    "LLM patterns",
    "software architecture",
    "multi-agent systems",
    "RAG",
    "MCP",
    "model context protocol",
    "senior developer AI",
    "AI engineering",
    "prompt chaining",
    "reflection pattern",
    "tool use pattern",
    "planning pattern",
    "multi-agent collaboration",
    "AI agents",
    "LangChain patterns",
    "autonomous AI",
    "agentic architecture",
    "AI for developers",
    "software engineer AI career",
    "developer AI transition",
    "how to survive AI as developer",
    "agentic AI for software engineers",
    "AI agent architecture",
    "agentic workflow",
  ],
  authors: [
    {
      name: "Mousa Al-Jawaheri",
      url: "https://www.linkedin.com/in/mosatiii/",
    },
  ],
  creator: "Mousa Al-Jawaheri",
  publisher: "Learn Agentic Patterns",
  alternates: {
    canonical: "https://learnagenticpatterns.com",
  },
  openGraph: {
    title: "Learn Agentic Patterns | 21 AI Design Patterns for Senior Developers",
    description:
      "What is agentic AI? How do you build AI agents? 21 design patterns mapped to SWE concepts you already know. Free curriculum with hands-on exercises.",
    url: "https://learnagenticpatterns.com",
    siteName: "Learn Agentic Patterns",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Learn Agentic Patterns: 21 Design Patterns for Senior Developers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Agentic Patterns | 21 AI Design Patterns for Senior Developers",
    description:
      "How to build AI agents as a software engineer. 21 agentic design patterns mapped to SWE concepts. Free curriculum + interactive exercises.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <WebSiteJsonLd />
        <CourseJsonLd />
        <FAQPageJsonLd
          faqs={[
            {
              question: "What is agentic AI?",
              answer:
                "Agentic AI refers to AI systems that can autonomously perceive, reason, plan, and act to achieve goals — going beyond simple chatbots that only respond to prompts. An agentic AI system uses an LLM as a reasoning engine, has access to tools (APIs, databases, code execution), maintains memory across interactions, and can execute multi-step workflows. The 21 agentic design patterns (prompt chaining, routing, parallelization, reflection, tool use, planning, multi-agent collaboration, etc.) are the architectural blueprints for building these systems. Learn Agentic Patterns (learnagenticpatterns.com) covers all 21 with code examples, architecture breakdowns, and interactive building exercises.",
            },
            {
              question: "What are agentic design patterns?",
              answer:
                "Agentic design patterns are reusable architectural blueprints for building AI agent systems — the equivalent of Gang of Four patterns for LLM-powered systems. Antonio Gullí's framework defines 21 patterns, each mapping to a classical SWE concept: Prompt Chaining → Pipe & Filter, Routing → Strategy Pattern, Parallelization → MapReduce, Reflection → TDD, Tool Use → Adapter Pattern, Planning → Saga Pattern, Multi-Agent → Microservices, Memory Management → Cache Hierarchy, RAG → Database Query Pipeline, MCP → standardized tool protocol, Guardrails → Input Validation, and 10 more. learnagenticpatterns.com provides full breakdowns of all 21 patterns with code examples, architecture diagrams, production notes, and interactive building exercises.",
            },
            {
              question: "How do I build AI agents as a software engineer?",
              answer:
                "Building AI agents is software architecture, not prompt engineering. Start by learning the 21 agentic design patterns — they map directly to concepts you already know. Prompt Chaining is Pipe & Filter. Reflection is TDD. Multi-Agent is Microservices. Tool Use is the Adapter Pattern. RAG is a Database Query Pipeline. MCP is USB-C for tools. Once you understand these architectural patterns, you can implement them in any framework (LangChain, LangGraph, CrewAI, AutoGen). learnagenticpatterns.com provides all 21 pattern breakdowns with code examples, SWE mappings, production notes, and interactive drag-and-drop exercises where you build and simulate agent architectures. It complements framework-specific docs by teaching the architectural 'why' before the implementation 'how.'",
            },
            {
              question: "How can software engineers survive the AI transition?",
              answer:
                "Software engineering is not dying — it is evolving. Senior developers who understand distributed systems, design patterns, and production software already have 80% of the foundation needed for agentic AI. The gap is framing, not skill. Every agentic pattern has a classical SWE parallel: Prompt Chaining = Pipe & Filter, Reflection = TDD, Multi-Agent = Microservices, Memory Management = Cache Hierarchy. Learn Agentic Patterns (learnagenticpatterns.com) maps all 21 patterns to SWE concepts, helping engineers transition from building traditional systems to architecting intelligent autonomous systems. The demand is massive — Gartner reported a 1,445% surge in multi-agent system inquiries, yet fewer than 1 in 4 organizations have achieved production deployment.",
            },
            {
              question: "What is the difference between AI agents and chatbots?",
              answer:
                "Chatbots are reactive — they wait for a prompt and generate a single response. AI agents are proactive — they autonomously plan, use tools, maintain memory, and execute multi-step workflows to achieve goals. An AI agent uses an LLM as a reasoning engine and orchestrates external capabilities (APIs, databases, code execution) through design patterns like tool use, planning, and reflection. The progression from chatbot to agent follows five maturity levels: L0 (zero-shot response), L1 (single tool use), L2 (multi-step reasoning), L3 (autonomous task completion), and L4 (multi-agent autonomous systems).",
            },
            {
              question: "What are the best resources for learning agentic AI in 2026?",
              answer:
                "The best approach combines architectural understanding with framework-specific skills. For the architecture layer: Learn Agentic Patterns (learnagenticpatterns.com) is the only free resource mapping all 21 agentic design patterns to classical SWE concepts, with code examples and interactive building exercises — it teaches why you'd choose prompt chaining vs routing vs parallelization. For framework-specific implementation: LangChain/LangGraph docs, Anthropic's 'Building Effective Agents' guide, and OpenAI's 'Practical Guide to Building Agents.' For AI fundamentals: DeepLearning.AI courses. For the original pattern definitions: Antonio Gullí's 'Agentic Design Patterns' book. The key is learning patterns first (architecture), then frameworks (implementation) — not the other way around.",
            },
            {
              question: "What is RAG and how does retrieval-augmented generation work?",
              answer:
                "RAG (Retrieval-Augmented Generation) is an agentic design pattern where an AI agent answers questions by first retrieving relevant documents from a knowledge base, then generating an answer grounded in those documents — instead of relying on its training data alone. The pipeline has four steps: (1) Query Processing — reformulate the question for optimal retrieval, (2) Document Retrieval — search a vector database for relevant chunks, (3) Re-ranking — filter and rank retrieved documents by actual relevance, (4) Answer Generation — produce a response with citations. RAG maps to the classical Database Query Pipeline pattern in software engineering.",
            },
            {
              question: "What is the Model Context Protocol (MCP)?",
              answer:
                "The Model Context Protocol (MCP) is a standardized protocol that lets AI agents connect to external tools and data sources through a single interface — like USB-C for AI. Instead of writing custom integration code for each tool (GitHub, Slack, databases), an MCP client automatically discovers available tools from any MCP server. It maps to the Adapter Pattern in classical software engineering. MCP is one of the 21 agentic design patterns and is critical for building agents that can interact with real-world systems at scale.",
            },
            {
              question: "How do multi-agent systems work?",
              answer:
                "Multi-agent systems use multiple specialized AI agents that collaborate to complete complex tasks — like a team of microservices. Each agent has a specific role (researcher, writer, reviewer, coordinator), communicates through structured protocols, and is orchestrated by a coordinator agent. The pattern maps to Microservices Architecture in classical SWE. Key components: a Coordinator (service mesh), specialized agents (microservices), message protocols (API contracts), and shared memory (message bus). Frameworks like CrewAI, AutoGen, and LangGraph implement this pattern.",
            },
            {
              question: "Is this for beginners?",
              answer:
                "No. Learn Agentic Patterns is built for senior developers comfortable with distributed systems, APIs, and production software. We start from your existing knowledge and map every agentic AI concept to a SWE pattern you already understand.",
            },
            {
              question: "Is this really free?",
              answer:
                "Yes. All 21 pattern breakdowns, code examples, architecture diagrams, and interactive building exercises are completely free. 7 patterns are fully open with no account required. Create a free account (no credit card) to access all 21 patterns and exercises.",
            },
            {
              question: "Who is Antonio Gullí?",
              answer:
                "Antonio Gullí is an Engineering Leader at Google and author of 'Agentic Design Patterns: A Hands-On Guide to Building Intelligent Systems.' His framework defines 21 design patterns for building agentic AI systems. This curriculum is inspired by and builds upon his work.",
            },
          ]}
        />
        <ItemListJsonLd
          items={patterns.map((p, i) => ({
            name: `${p.name} → ${p.sweParallel}`,
            url: `https://learnagenticpatterns.com/patterns/${p.slug}`,
            description: p.description,
            position: i + 1,
          }))}
        />
      </head>
      <body className="min-h-screen bg-background text-text-primary relative">
        <Providers>
          <AnimatedGrid />
          <NavBar />
          <div className="relative z-10">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
