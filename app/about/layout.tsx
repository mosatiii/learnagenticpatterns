import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Mousa Al-Jawaheri | Learn Agentic Patterns",
  description:
    "Meet Mousa Al-Jawaheri, the creator of Learn Agentic Patterns. A Technical Product Leader with an MBET from the University of Waterloo, specializing in Agentic AI Design Patterns and multi-agent orchestration.",
  alternates: {
    canonical: "https://learnagenticpatterns.com/about",
  },
  openGraph: {
    title: "About Mousa Al-Jawaheri | Learn Agentic Patterns",
    description:
      "The story behind a free curriculum that maps 21 Agentic AI Design Patterns to Software Engineering concepts. Built by Mousa Al-Jawaheri, inspired by Antonio Gullí's research.",
    url: "https://learnagenticpatterns.com/about",
    siteName: "Learn Agentic Patterns",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Mousa Al-Jawaheri | Learn Agentic Patterns",
    description:
      "The story behind a free curriculum that maps 21 Agentic AI Design Patterns to Software Engineering concepts.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
