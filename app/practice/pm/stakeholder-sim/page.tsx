"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StakeholderSimulator from "@/components/PMGames/StakeholderSimulator";
import { stakeholderRounds } from "@/data/pm-games";

// Standalone "free play" URL — keeps direct links working with the legacy
// generic content. The per-module versions live on each PM module's Play tab.
export default function StakeholderSimPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/practice/pm"
        className="inline-flex items-center gap-1.5 text-text-secondary hover:text-accent font-mono text-xs mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to PM Labs
      </Link>
      <StakeholderSimulator rounds={stakeholderRounds} slug="pm-stakeholder-sim" title="Stakeholder Simulator" />
    </div>
  );
}
