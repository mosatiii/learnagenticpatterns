"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import PostHogProvider, { PostHogIdentify } from "@/components/PostHogProvider";
import { type ReactNode } from "react";

const TOTAL_PATTERNS = 21;

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <PostHogProvider>
      <AuthProvider totalPatterns={TOTAL_PATTERNS}>
        <PostHogIdentify />
        {children}
      </AuthProvider>
    </PostHogProvider>
  );
}
