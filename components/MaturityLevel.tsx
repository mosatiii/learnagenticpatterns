"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Terminal, Wrench, Brain, Database, Network } from "lucide-react";
import { MATURITY_LEVELS } from "@/data/patterns";

const iconMap: Record<string, React.ReactNode> = {
  terminal: <Terminal size={24} />,
  wrench: <Wrench size={24} />,
  brain: <Brain size={24} />,
  database: <Database size={24} />,
  network: <Network size={24} />,
};

export default function MaturityLevel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const progressWidth = useTransform(scrollYProgress, [0.2, 0.8], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative">
      {/* Desktop: Horizontal progress bar */}
      <div className="hidden md:block mb-8">
        <div className="relative h-2 bg-border rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-success rounded-full"
            style={{ width: progressWidth }}
          />
        </div>
      </div>

      {/* Levels */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
        {MATURITY_LEVELS.map((level, i) => (
          <motion.div
            key={level.level}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-surface border border-border rounded-lg p-5 hover:border-primary/30 transition-all group"
          >
            {/* Level indicator */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                {iconMap[level.icon]}
              </div>
              <span className="font-mono text-xs text-text-secondary">
                L{level.level}
              </span>
            </div>

            {/* Title */}
            <h4 className="font-mono text-text-primary font-bold text-sm mb-1">
              {level.title}
            </h4>
            <p className="font-mono text-primary text-xs mb-3">
              {level.subtitle}
            </p>

            {/* Description */}
            <p className="text-text-secondary text-xs leading-relaxed mb-3">
              {level.description}
            </p>

            {/* Example */}
            <div className="pt-3 border-t border-border/50">
              <p className="text-text-secondary/70 text-xs italic">
                {level.example}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
