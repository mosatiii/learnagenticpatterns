"use client";

import { Lock } from "lucide-react";

type Tier = "apprentice" | "practitioner" | "architect";

const TIER_STYLES: Record<Tier, { bg: string; text: string; border: string; label: string }> = {
  apprentice: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20", label: "Apprentice" },
  practitioner: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", label: "Practitioner" },
  architect: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", label: "Architect" },
};

interface TierBadgeProps {
  tier: Tier;
  locked?: boolean;
  size?: "sm" | "md";
}

export default function TierBadge({ tier, locked = false, size = "sm" }: TierBadgeProps) {
  const style = TIER_STYLES[tier];
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono ${textSize} uppercase tracking-wider border ${
        locked ? "bg-surface/50 text-text-secondary/40 border-border" : `${style.bg} ${style.text} ${style.border}`
      }`}
    >
      {locked && <Lock size={size === "sm" ? 8 : 10} />}
      {style.label}
    </span>
  );
}

export { TIER_STYLES };
export type { Tier };
