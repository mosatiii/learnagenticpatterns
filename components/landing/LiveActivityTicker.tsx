"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Activity } from "lucide-react";

type Entry = {
  who: string;
  did: string;
  detail: string;
  href: string;
};

const entries: Entry[] = [
  {
    who: "engineer in Toronto",
    did: "completed Prompt Chaining Builder",
    detail: "scored 92",
    href: "https://practice.learnagenticpatterns.com/patterns/prompt-chaining",
  },
  {
    who: "PM in Berlin",
    did: "finished Ship or Skip",
    detail: "scored 87",
    href: "https://practice.learnagenticpatterns.com/pm/ship-or-skip",
  },
  {
    who: "engineer in NYC",
    did: "read the Reflection pattern",
    detail: "1 of 21",
    href: "/patterns/reflection",
  },
  {
    who: "engineer in Bangalore",
    did: "completed Routing Builder",
    detail: "scored 78",
    href: "https://practice.learnagenticpatterns.com/patterns/routing",
  },
  {
    who: "PM in San Francisco",
    did: "tried Budget Builder",
    detail: "scored 81",
    href: "https://practice.learnagenticpatterns.com/pm/budget-builder",
  },
  {
    who: "engineer in London",
    did: "took the Will AI Replace Me assessment",
    detail: "AI proof score 7 of 10",
    href: "/assessment",
  },
  {
    who: "PM in Singapore",
    did: "read Becoming AI Native",
    detail: "1 of 15",
    href: "/pm/ai-native-foundations",
  },
];

function rel(secondsAgo: number): string {
  if (secondsAgo < 60) return `${secondsAgo}s ago`;
  const m = Math.floor(secondsAgo / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
}

export default function LiveActivityTicker() {
  const [idx, setIdx] = useState(0);
  const [secs, setSecs] = useState(120);

  useEffect(() => {
    const start = Date.now();
    const seed = entries.map((_, i) => 60 + ((i * 137) % 540));
    setSecs(seed[0]);

    const tick = setInterval(() => {
      setIdx((i) => {
        const next = (i + 1) % entries.length;
        setSecs(seed[next] + Math.floor((Date.now() - start) / 1000));
        return next;
      });
    }, 4500);
    return () => clearInterval(tick);
  }, []);

  const e = entries[idx];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <a
        href={e.href}
        className="block bg-surface border border-border rounded-full px-4 py-2.5 hover:border-success/40 transition-colors"
      >
        <div className="flex items-center gap-3 text-xs">
          <span className="relative flex items-center justify-center w-2 h-2 flex-shrink-0">
            <span className="absolute inset-0 rounded-full bg-success/40 animate-ping" />
            <span className="relative w-2 h-2 rounded-full bg-success" />
          </span>
          <Activity size={12} className="text-success flex-shrink-0" />
          <AnimatePresence mode="wait">
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="font-mono text-text-secondary truncate"
            >
              <span className="text-text-primary">{e.who}</span>{" "}
              {e.did}{" "}
              <span className="text-success">({e.detail})</span>
            </motion.span>
          </AnimatePresence>
          <span className="ml-auto font-mono text-[10px] text-text-secondary/60 flex-shrink-0">
            {rel(secs)}
          </span>
        </div>
      </a>
    </div>
  );
}
