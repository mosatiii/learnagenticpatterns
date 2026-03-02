import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up Free",
  description:
    "Create a free account to unlock all 21 Agentic AI Design Patterns. No credit card required. Instant access to the full curriculum.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://learnagenticpatterns.com/signup",
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
