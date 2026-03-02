import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Learn Agentic Patterns",
  description:
    "The story behind Learn Agentic Patterns, a free curriculum by Mousa, built on Antonio Gullí's research, helping senior developers architect Agentic AI systems.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
