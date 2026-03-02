import type { Metadata } from "next";
import { FAQPageJsonLd } from "@/components/JsonLd";

function PracticeJsonLd() {
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Practice Agentic Design Patterns — AI Agent Builder",
    url: "https://practice.learnagenticpatterns.com",
    description:
      "21 interactive drag-and-drop exercises that teach agentic AI design patterns by having you build real agent architectures and run simulations.",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Mousa Al-Jawaheri",
      url: "https://www.linkedin.com/in/mosatiii/",
    },
    isAccessibleForFree: true,
    educationalLevel: "Advanced",
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "Professional",
      audienceType: "Senior Software Engineers",
    },
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Practice Building AI Agents with Interactive Exercises",
    description:
      "Learn agentic design patterns by building agent architectures in a drag-and-drop builder. Three steps: sign up, choose a pattern, then build and simulate.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Sign Up Free",
        text: "Create a free account in 30 seconds. No credit card required. Unlock all 21 exercises instantly.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose an Agentic Design Pattern",
        text: "Each exercise targets one agentic design pattern — from Prompt Chaining to Multi-Agent Collaboration. Pick the pattern you want to practice.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Build and Simulate",
        text: "Drag agent blocks onto the canvas, arrange them into the correct architecture, and hit Run. Watch your agent pipeline succeed or fail in real-time and get scored on correctness, resilience, and efficiency.",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
    </>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL("https://practice.learnagenticpatterns.com"),
  title:
    "Practice Building AI Agents | Hands-On Agentic Design Pattern Exercises",
  description:
    "Practice building AI agents with interactive drag-and-drop exercises. 21 hands-on challenges that teach you agentic design patterns by building real agent architectures — prompt chaining, routing, parallelization, reflection, tool use, planning, and multi-agent collaboration.",
  keywords: [
    "practice agentic design patterns",
    "build AI agents interactive",
    "agentic AI hands-on exercises",
    "AI agent builder simulator",
    "learn agentic patterns by building",
    "interactive AI architecture practice",
    "agentic design patterns exercises",
    "AI agent architecture practice",
    "hands-on AI agent building",
    "drag and drop AI agent builder",
    "agentic AI learning platform",
    "prompt chaining practice",
    "multi-agent system exercises",
    "RAG architecture practice",
    "tool use pattern exercises",
    "reflection pattern practice",
    "AI design patterns for developers",
    "agentic workflow builder",
    "build autonomous AI agents",
    "AI agent simulation",
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
    canonical: "https://practice.learnagenticpatterns.com",
  },
  openGraph: {
    title:
      "Practice Building AI Agents | Interactive Agentic Design Pattern Exercises",
    description:
      "21 hands-on challenges. Drag, drop, and simulate real agent architectures. Learn prompt chaining, routing, parallelization, and 18 more patterns by building them.",
    url: "https://practice.learnagenticpatterns.com",
    siteName: "Practice Agentic Patterns",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://learnagenticpatterns.com/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Practice Building AI Agents: 21 Interactive Design Pattern Exercises",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Practice Building AI Agents | 21 Hands-On Agentic Pattern Exercises",
    description:
      "Stop reading about AI agents. Start building them. 21 interactive exercises that teach agentic design patterns through drag-and-drop architecture building.",
    images: ["https://learnagenticpatterns.com/opengraph-image"],
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

const practiceFaqs = [
  {
    question: "How can I practice building AI agents?",
    answer:
      "Practice Agentic Patterns provides 21 interactive drag-and-drop exercises where you build real AI agent architectures. Each exercise teaches a specific agentic design pattern — like prompt chaining, routing, parallelization, or multi-agent collaboration — by having you assemble agent blocks, connect them, and run a simulation to see how your architecture performs.",
  },
  {
    question:
      "What are the best hands-on exercises for learning agentic design patterns?",
    answer:
      "The best exercises combine architecture building with instant feedback. Practice Agentic Patterns lets you drag agent blocks (like Extraction Agent, Validation Gate, Classifier) onto a canvas, arrange them in the correct topology, and simulate the data flow. You get scored on architecture correctness, resilience, and efficiency — teaching you not just what patterns exist, but why each component matters.",
  },
  {
    question: "Do I need to know how to code to practice building AI agents?",
    answer:
      "No coding is required. The exercises use a visual drag-and-drop interface where you focus on architecture decisions — which blocks to include, what order to place them in, and how they connect. This teaches the design thinking behind agentic systems, which you can then apply in any framework (LangChain, CrewAI, AutoGen, etc.).",
  },
  {
    question: "Is this free? Do I need a credit card?",
    answer:
      "Sign up is completely free with no credit card required. 7 exercises are available immediately, with all 21 unlocked after creating a free account.",
  },
  {
    question:
      "What agentic design patterns can I practice?",
    answer:
      "All 21 patterns from Antonio Gullí's framework: Prompt Chaining, Routing, Parallelization, Reflection, Tool Use, Planning, Multi-Agent Collaboration, Memory Management, Learning & Adaptation, State Management (MCP), Goal Monitoring, Exception Handling, Human-in-the-Loop, Knowledge Retrieval (RAG), Inter-Agent Communication, Resource Optimization, Reasoning Techniques, Guardrails & Safety, Evaluation & Monitoring, Prioritization, and Exploration & Discovery.",
  },
  {
    question:
      "How is this different from reading about agentic patterns?",
    answer:
      "Reading teaches you what patterns exist. Building teaches you why each component matters. When you skip the Validation Gate in a Prompt Chain exercise and watch the simulation fail with 'Hallucinated entities propagated,' you understand the pattern at a visceral level that no article can provide.",
  },
];

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PracticeJsonLd />
      <FAQPageJsonLd faqs={practiceFaqs} />
      {children}
    </>
  );
}
