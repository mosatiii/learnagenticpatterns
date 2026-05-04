"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ShipOrSkip from "@/components/PMGames/ShipOrSkip";
import { shipOrSkipRounds } from "@/data/pm-games";

// Standalone "free play" URL — keeps direct links working with the legacy
// generic content. The per-module versions live on each PM module's Play tab.
export default function ShipOrSkipPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/practice/pm"
        className="inline-flex items-center gap-1.5 text-text-secondary hover:text-accent font-mono text-xs mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to PM Labs
      </Link>
      <ShipOrSkip rounds={shipOrSkipRounds} slug="pm-ship-or-skip" title="Ship or Skip" />
    </div>
  );
}
