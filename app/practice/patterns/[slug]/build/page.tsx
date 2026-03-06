"use client";

import { useParams } from "next/navigation";
import AgentBuilder from "@/components/AgentBuilder/AgentBuilder";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPatternBySlug } from "@/data/patterns";
import { hasGameConfig } from "@/data/games";

export default function BuildLabPage() {
  const params = useParams();
  const slug = params.slug as string;
  const pattern = getPatternBySlug(slug);
  const gameAvailable = hasGameConfig(slug);

  if (!pattern || !gameAvailable) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-text-secondary font-mono">Challenge not found.</p>
        <Link href="/practice/patterns" className="text-primary font-mono text-sm mt-4 inline-block hover:underline">
          Back to Patterns
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        href={`/practice/patterns/${slug}`}
        className="inline-flex items-center gap-1.5 text-text-secondary hover:text-accent font-mono text-xs mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to {pattern.name}
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-mono text-[10px] uppercase tracking-wider border border-green-500/20">
            Apprentice
          </span>
          <span className="px-2 py-0.5 rounded-full bg-surface text-text-secondary font-mono text-[10px] uppercase tracking-wider border border-border">
            Build Lab
          </span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary">{pattern.name}</h1>
        <p className="text-text-secondary text-sm mt-1">
          Drag and drop agent blocks to build the correct architecture for this pattern.
        </p>
      </div>

      <AgentBuilder patternSlug={slug} />
    </div>
  );
}
