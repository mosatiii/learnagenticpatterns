"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

interface StreakData {
  current: number;
  longest: number;
  lastActivityDay: string | null;
  activeToday: boolean;
}

export default function StreakWidget() {
  const [data, setData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/streak/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j?.success) {
          setData({
            current: j.current,
            longest: j.longest,
            lastActivityDay: j.lastActivityDay,
            activeToday: j.activeToday,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="h-24 bg-border/30 rounded-xl animate-pulse" />;
  }

  const current = data?.current ?? 0;
  const longest = data?.longest ?? 0;
  const atRisk = current > 0 && data?.activeToday === false;

  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
            current > 0
              ? "bg-orange-500/15 border border-orange-500/40 text-orange-400"
              : "bg-border/40 border border-border text-text-secondary"
          }`}
        >
          <Flame size={28} />
        </div>
        <div className="flex-1">
          <p className="text-3xl font-bold text-text-primary leading-none">
            {current}
            <span className="text-base font-mono text-text-secondary ml-2">
              day{current === 1 ? "" : "s"}
            </span>
          </p>
          <p className="text-xs font-mono text-text-secondary mt-1">
            {current === 0
              ? "Start a streak today"
              : atRisk
                ? "Practice today to keep it alive"
                : `Longest: ${longest} day${longest === 1 ? "" : "s"}`}
          </p>
        </div>
      </div>
    </div>
  );
}
