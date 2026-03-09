"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export interface ComparisonCardItem {
  title: string;
  icon?: LucideIcon;
  bullets: string[];
  bestFor?: string;
}

interface ComparisonCardsProps {
  items: ComparisonCardItem[];
  columns?: 2 | 3;
  className?: string;
}

export default function ComparisonCards({
  items,
  columns = 2,
  className = "",
}: ComparisonCardsProps) {
  return (
    <div
      className={`grid gap-4 ${
        columns === 3
          ? "grid-cols-1 md:grid-cols-3"
          : "grid-cols-1 md:grid-cols-2"
      } ${className}`}
    >
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            className="bg-surface border border-border rounded-lg p-5 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-3">
              {Icon && (
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                  <Icon size={16} className="text-primary" />
                </div>
              )}
              <h4 className="font-mono font-bold text-text-primary text-sm">
                {item.title}
              </h4>
            </div>
            <ul className="space-y-2 flex-1">
              {item.bullets.map((b, j) => (
                <li
                  key={j}
                  className="text-text-secondary text-sm leading-relaxed flex items-start gap-2"
                >
                  <span className="text-primary/60 mt-0.5">•</span>
                  {b}
                </li>
              ))}
            </ul>
            {item.bestFor && (
              <p className="mt-3 pt-3 border-t border-border font-mono text-xs text-primary">
                Best for: {item.bestFor}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
