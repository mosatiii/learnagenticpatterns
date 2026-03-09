"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function ProgressiveResultsDemo() {
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(0);

  const runDemo = () => {
    setStarted(true);
    setVisible(0);
    const t = setInterval(() => {
      setVisible((v) => {
        if (v >= 4) {
          clearInterval(t);
          return 5;
        }
        return v + 1;
      });
    }, 800);
    return () => clearInterval(t);
  };

  const cards = [
    "Option A analysis",
    "Option B analysis",
    "Option C analysis",
    "Option D analysis",
    "Option E analysis",
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h4 className="font-mono text-primary text-sm font-bold mb-4">
        Progressive results: cards appear as each step completes
      </h4>
      <button
        type="button"
        onClick={runDemo}
        className="mb-4 px-4 py-2 rounded bg-primary/10 border border-primary/30 text-primary font-mono text-sm hover:bg-primary/15"
      >
        {started ? "Replay" : "Start demo"}
      </button>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 min-h-[120px]">
        {cards.map((label, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{
              opacity: visible > i ? 1 : 0.2,
              scale: visible > i ? 1 : 0.95,
            }}
            transition={{ duration: 0.3 }}
            className="p-4 rounded-lg border border-border bg-surface/80 font-mono text-sm text-text-secondary"
          >
            {visible > i ? label : "…"}
          </motion.div>
        ))}
      </div>
      <p className="text-text-secondary text-xs mt-3">
        Compare: all 5 at once after 10s vs. one every ~2s. The second feels
        faster.
      </p>
    </div>
  );
}
