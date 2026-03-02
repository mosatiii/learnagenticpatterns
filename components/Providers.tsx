"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { type ReactNode } from "react";

const TOTAL_PATTERNS = 21;

export default function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider totalPatterns={TOTAL_PATTERNS}>{children}</AuthProvider>;
}
