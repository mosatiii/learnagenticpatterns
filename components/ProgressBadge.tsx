"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function ProgressBadge() {
  const { user, progressPercent, readSlugs } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-2 font-mono text-xs text-text-secondary">
      {/* Mini circular indicator */}
      <svg width={24} height={24} className="-rotate-90">
        <circle cx={12} cy={12} r={9} fill="none" stroke="currentColor" className="text-border" strokeWidth={2.5} />
        <circle
          cx={12}
          cy={12}
          r={9}
          fill="none"
          stroke="currentColor"
          className="text-primary"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 9}
          strokeDashoffset={2 * Math.PI * 9 * (1 - progressPercent / 100)}
        />
      </svg>
      <span>
        {readSlugs.length}<span className="text-text-secondary/50">/21</span>
      </span>
    </div>
  );
}
