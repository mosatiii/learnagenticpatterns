import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AnimatedGrid from "@/components/AnimatedGrid";
import Providers from "@/components/Providers";
import { WebSiteJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://learnagenticpatterns.com"),
  title: {
    default: "Learn Agentic Patterns | For Senior Developers",
    template: "%s | Learn Agentic Patterns",
  },
  description:
    "A free curriculum mapping 21 Agentic AI Design Patterns to Software Engineering concepts you already know. Built for Senior Developers, Architects, and Technical Leaders.",
  keywords:
    "agentic AI, design patterns, LLM, software architecture, multi-agent systems, RAG, MCP, senior developer, AI engineering, prompt chaining, reflection pattern, tool use, planning, multi-agent collaboration",
  alternates: {
    canonical: "https://learnagenticpatterns.com",
  },
  openGraph: {
    title: "Learn Agentic Patterns",
    description: "Stop fearing Agentic AI. Start building it.",
    url: "https://learnagenticpatterns.com",
    siteName: "Learn Agentic Patterns",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Agentic Patterns",
    description:
      "21 Agentic Design Patterns mapped to SWE concepts you already know.",
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
