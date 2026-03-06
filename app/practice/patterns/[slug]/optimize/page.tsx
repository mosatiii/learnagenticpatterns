"use client";

import { useParams } from "next/navigation";
import OptimizeLab from "@/components/Labs/OptimizeLab";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPatternBySlug } from "@/data/patterns";
import { getOptimizeLabConfig } from "@/data/optimize-labs";

export default function OptimizeLabPage() {
  const params = useParams();
  const slug = params.slug as string;
  const pattern = getPatternBySlug(slug);
  const labConfig = getOptimizeLabConfig(slug);

  if (!pattern || !labConfig) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-text-secondary font-mono">No optimize lab available for this pattern yet.</p>
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

      <OptimizeLab config={labConfig} patternSlug={slug} patternName={pattern.name} />
    </div>
  );
}
