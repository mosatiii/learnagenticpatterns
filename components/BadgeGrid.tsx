"use client";

import { useEffect, useState } from "react";
import {
  BookOpen, Compass, Layers, Award, Play, CheckCircle2, Briefcase,
  MessageCircle, CalendarCheck, Flame, Trophy, Lock,
  type LucideIcon,
} from "lucide-react";

interface Badge {
  slug: string;
  name: string;
  description: string;
  icon: string;
  tier: "bronze" | "silver" | "gold";
  earned: boolean;
  earnedAt: string | null;
}

const ICONS: Record<string, LucideIcon> = {
  BookOpen, Compass, Layers, Award, Play, CheckCircle2, Briefcase,
  MessageCircle, CalendarCheck, Flame, Trophy,
};

const TIER_RING: Record<Badge["tier"], string> = {
  bronze: "border-amber-700/50 bg-amber-700/10 text-amber-500",
  silver: "border-slate-400/50 bg-slate-400/10 text-slate-300",
  gold:   "border-yellow-400/60 bg-yellow-400/10 text-yellow-400",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function BadgeGrid() {
  const [badges, setBadges] = useState<Badge[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<{ earned: number; total: number }>({ earned: 0, total: 0 });

  useEffect(() => {
    fetch("/api/badges/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j?.success) {
          setBadges(j.badges);
          setCounts({ earned: j.earnedCount, total: j.totalCount });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="h-32 bg-border/30 rounded animate-pulse" />;
  }

  if (!badges) {
    return <p className="text-sm text-text-secondary">Couldn’t load badges.</p>;
  }

  const sorted = [...badges].sort((a, b) => {
    if (a.earned !== b.earned) return a.earned ? -1 : 1;
    return 0;
  });

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <p className="text-sm text-text-primary">
          <span className="font-mono font-semibold">{counts.earned}</span>
          <span className="text-text-secondary"> of </span>
          <span className="font-mono font-semibold">{counts.total}</span>
          <span className="text-text-secondary"> earned</span>
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {sorted.map((b) => {
          const Icon = ICONS[b.icon] ?? Award;
          if (b.earned) {
            return (
              <div
                key={b.slug}
                className={`rounded-xl border p-3 ${TIER_RING[b.tier]}`}
                title={`${b.description}${b.earnedAt ? ` · Earned ${formatDate(b.earnedAt)}` : ""}`}
              >
                <Icon size={20} className="mb-2" />
                <p className="text-sm font-semibold text-text-primary leading-tight">{b.name}</p>
                {b.earnedAt && (
                  <p className="text-[10px] font-mono text-text-secondary mt-1">
                    {formatDate(b.earnedAt)}
                  </p>
                )}
              </div>
            );
          }
          return (
            <div
              key={b.slug}
              className="rounded-xl border border-border/50 bg-border/10 p-3 opacity-60"
              title={b.description}
            >
              <Lock size={20} className="mb-2 text-text-secondary" />
              <p className="text-sm font-semibold text-text-secondary leading-tight">{b.name}</p>
              <p className="text-[10px] font-mono text-text-secondary/70 mt-1 line-clamp-2">
                {b.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
