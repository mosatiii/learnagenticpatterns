"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function ProgressBadge() {
  const { user, isProductManager, progressPercent, readSlugs, pmReadSlugs, pmProgressPercent } = useAuth();

  if (!user) return null;

  const count = isProductManager ? pmReadSlugs.length : readSlugs.length;
  const total = isProductManager ? 11 : 21;
  const percent = isProductManager ? pmProgressPercent : progressPercent;

  return (
    <div className="flex items-center gap-2 font-mono text-xs text-text-secondary">
      <svg width={24} height={24} className="-rotate-90">
        <circle cx={12} cy={12} r={9} fill="none" stroke="currentColor" className="text-border" strokeWidth={2.5} />
        <circle
          cx={12}
          cy={12}
          r={9}
          fill="none"
          stroke="currentColor"
          className={isProductManager ? "text-accent" : "text-primary"}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 9}
          strokeDashoffset={2 * Math.PI * 9 * (1 - percent / 100)}
        />
      </svg>
      <span>
        {count}<span className="text-text-secondary/50">/{total}</span>
      </span>
    </div>
  );
}
