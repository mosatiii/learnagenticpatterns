"use client";

import { useParams } from "next/navigation";
import PromptLab from "@/components/Labs/PromptLab";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPatternBySlug } from "@/data/patterns";
import { getPromptLabConfig } from "@/data/prompt-labs";

export default function PromptLabPage() {
  const params = useParams();
  const slug = params.slug as string;
  const pattern = getPatternBySlug(slug);
  const labConfig = getPromptLabConfig(slug);

  if (!pattern || !labConfig) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-text-secondary font-mono">No prompt lab available for this pattern yet.</p>
        <Link href={`/practice/patterns/${slug}`} className="text-primary font-mono text-sm mt-4 inline-block hover:underline">
          Back to {pattern?.name ?? "Pattern"}
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

      <PromptLab config={labConfig} patternSlug={slug} patternName={pattern.name} />
    </div>
  );
}
