import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pattern Detail | Learn Agentic Patterns",
  description:
    "Explore agentic design patterns mapped to Software Engineering concepts you already know. Each pattern includes code examples, SWE mappings, and production notes.",
};

export default function PatternLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
