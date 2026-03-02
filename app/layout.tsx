import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AnimatedGrid from "@/components/AnimatedGrid";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Learn Agentic Patterns | For Senior Developers",
  description:
    "A free curriculum mapping 21 Agentic AI Design Patterns to Software Engineering concepts you already know. Built for Senior Developers, Architects, and Technical Leaders.",
  keywords:
    "agentic AI, design patterns, LLM, software architecture, multi-agent systems, RAG, MCP, senior developer, AI engineering",
  openGraph: {
    title: "Learn Agentic Patterns",
    description: "Stop fearing Agentic AI. Start building it.",
    url: "https://learnagenticpatterns.com",
    siteName: "Learn Agentic Patterns",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Agentic Patterns",
    description:
      "21 Agentic Design Patterns mapped to SWE concepts you already know.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
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
