"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BudgetBuilder from "@/components/PMGames/BudgetBuilder";

export default function BudgetBuilderPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/practice/pm"
        className="inline-flex items-center gap-1.5 text-text-secondary hover:text-accent font-mono text-xs mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to PM Labs
      </Link>
      <BudgetBuilder />
    </div>
  );
}
