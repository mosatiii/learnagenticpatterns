import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AnimatedGrid from "@/components/AnimatedGrid";
import Providers from "@/components/Providers";
import {
  WebSiteJsonLd,
  CourseJsonLd,
  ItemListJsonLd,
} from "@/components/JsonLd";
import { patterns } from "@/data/patterns";

export const metadata: Metadata = {
  metadataBase: new URL("https://learnagenticpatterns.com"),
  title: {
    default:
      "Learn Agentic Patterns — AI Design Patterns for Developers & Product Managers (Free)",
    template: "%s | Learn Agentic Patterns",
  },
  description:
    "Free curriculum: 21 agentic AI design patterns for developers (code + architecture) and 11 product modules for PMs (decisions + tradeoffs + AI tools landscape). Two tracks, interactive games, zero hype.",
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
    "AI for product managers",
    "agentic AI for PMs",
    "product manager AI decisions",
    "AI product strategy",
    "AI product management",
    "agentic AI tradeoffs",
    "AI cost vs quality tradeoff",
    "how to evaluate AI architecture",
    "product manager AI literacy",
    "non-technical AI curriculum",
    "Claude Code",
    "OpenAI Codex",
    "Cursor AI",
    "GitHub Copilot agent",
    "Gemini Code Assist",
    "Windsurf Cascade",
    "Amazon Q Developer",
    "AI coding tools comparison 2026",
    "agentic coding tools",
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
    title: "Learn Agentic Patterns — AI Design Patterns for Developers & Product Managers (Free)",
    description:
      "Free curriculum: 21 patterns for developers (code + architecture) and 11 modules for product managers (decisions + tradeoffs + AI tools deep-dive). Two tracks, interactive games, zero hype.",
    url: "https://learnagenticpatterns.com",
    siteName: "Learn Agentic Patterns",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Learn Agentic Patterns: AI Design Patterns for Developers & Product Managers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Agentic Patterns — AI Design Patterns for Developers & Product Managers (Free)",
    description:
      "Free curriculum: 21 patterns for developers (code + architecture) and 11 modules for product managers (decisions + tradeoffs + AI tools deep-dive). Two tracks, interactive games, zero hype.",
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
