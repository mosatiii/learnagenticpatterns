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
    "A free curriculum mapping 21 Agentic AI Design Patterns to Software Engineering concepts you already know. Master prompt chaining, reflection, tool use, multi-agent systems, RAG, and MCP. Built for Senior Developers, Architects, and Technical Leaders.",
  keywords: [
    "agentic AI",
    "agentic design patterns",
    "AI design patterns",
    "LLM patterns",
    "software architecture",
    "multi-agent systems",
    "RAG",
    "MCP",
    "model context protocol",
    "senior developer",
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
      "Stop fearing Agentic AI. Start building it. A free curriculum mapping 21 Agentic Design Patterns to SWE concepts you already know.",
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
      "21 Agentic Design Patterns mapped to SWE concepts you already know. Free curriculum for senior developers.",
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
              question: "Is this for beginners?",
              answer:
                "No. This curriculum assumes you are a senior developer comfortable with distributed systems, APIs, and production software. We start from your existing knowledge.",
            },
            {
              question: "Is this about a specific framework?",
              answer:
                "No. Patterns are framework-agnostic. We use pseudocode and real examples from LangChain, LangGraph, CrewAI, and AutoGen to illustrate, but the concepts apply universally.",
            },
            {
              question: "Is this free?",
              answer:
                "The core curriculum is free. Advanced modules, code repos, and workshop access may have premium tiers in the future.",
            },
            {
              question: "How is this different from other AI courses?",
              answer:
                "Most courses teach you to use AI tools. This curriculum teaches you to architect AI systems, treating agents as engineering constructs with well-defined design patterns.",
            },
            {
              question: "Is this really free?",
              answer:
                "Yes! 7 patterns are open right now with no sign-up. Sign up for free (no credit card) to unlock all 21 patterns, code examples, and architecture diagrams.",
            },
            {
              question: "Who is Antonio Gullí?",
              answer:
                "Antonio Gullí is an Engineering Leader at Google and author of 'Agentic Design Patterns: A Hands-On Guide to Building Intelligent Systems.' This curriculum is inspired by and builds upon his framework.",
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
