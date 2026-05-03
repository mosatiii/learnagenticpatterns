"use client";

import { useEffect, useState } from "react";

interface DayCount {
  day: string;
  count: number;
}

interface HeatmapData {
  days: DayCount[];
  window: number;
}

const WEEKS = 26;

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isoDay(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function intensityClass(count: number): string {
  if (count === 0) return "bg-border/40";
  if (count === 1) return "bg-accent/30";
  if (count <= 3) return "bg-accent/55";
  if (count <= 6) return "bg-accent/80";
  return "bg-accent";
}

export default function ActivityHeatmap() {
  const [data, setData] = useState<HeatmapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/activity?days=${WEEKS * 7}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j?.success) setData({ days: j.days, window: j.window });
      })
      .finally(() => setLoading(false));
  }, []);

  const today = startOfDay(new Date());
  const counts = new Map<string, number>();
  (data?.days ?? []).forEach((d) => counts.set(d.day, d.count));

  const cells: { date: Date; count: number }[] = [];
  const totalDays = WEEKS * 7;
  const dayOfWeekToday = today.getDay();
  const start = new Date(today);
  start.setDate(today.getDate() - (totalDays - 1) - dayOfWeekToday);
  for (let i = 0; i < totalDays + dayOfWeekToday + 1; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    if (d > today) break;
    cells.push({ date: d, count: counts.get(isoDay(d)) ?? 0 });
  }

  const weeks: { date: Date; count: number }[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const totalActivity = (data?.days ?? []).reduce((sum, d) => sum + d.count, 0);
  const activeDays = (data?.days ?? []).filter((d) => d.count > 0).length;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <p className="text-xs font-mono text-text-secondary">Last {WEEKS} weeks</p>
          <p className="text-sm text-text-primary mt-0.5">
            <span className="font-mono font-semibold">{activeDays}</span>
            <span className="text-text-secondary"> active days, </span>
            <span className="font-mono font-semibold">{totalActivity}</span>
            <span className="text-text-secondary"> events</span>
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-24 bg-border/30 rounded animate-pulse" />
      ) : (
        <div className="overflow-x-auto pb-1">
          <div className="inline-flex gap-1">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, di) => {
                  const cell = week[di];
                  if (!cell) {
                    return <div key={di} className="w-3 h-3" />;
                  }
                  return (
                    <div
                      key={di}
                      title={`${isoDay(cell.date)}: ${cell.count} ${cell.count === 1 ? "event" : "events"}`}
                      className={`w-3 h-3 rounded-sm ${intensityClass(cell.count)}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-3 text-[10px] font-mono text-text-secondary">
            <span>less</span>
            <div className="w-3 h-3 rounded-sm bg-border/40" />
            <div className="w-3 h-3 rounded-sm bg-accent/30" />
            <div className="w-3 h-3 rounded-sm bg-accent/55" />
            <div className="w-3 h-3 rounded-sm bg-accent/80" />
            <div className="w-3 h-3 rounded-sm bg-accent" />
            <span>more</span>
          </div>
        </div>
      )}
    </div>
  );
}
