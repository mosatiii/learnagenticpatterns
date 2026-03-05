"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers, Compass, Zap, ShieldCheck, Plug, Users,
  Brain, BarChart3, GitBranch, Search,
  ChevronDown, MessageCircleQuestion, ListChecks,
} from "lucide-react";
import type { PMModule } from "@/data/pm-curriculum";

const iconMap = {
  layers: Layers,
  compass: Compass,
  zap: Zap,
  "shield-check": ShieldCheck,
  plug: Plug,
  users: Users,
  brain: Brain,
  "bar-chart": BarChart3,
  "git-branch": GitBranch,
  search: Search,
} as const;

interface PMModuleCardProps {
  module: PMModule;
  index: number;
}

export default function PMModuleCard({ module, index }: PMModuleCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = iconMap[module.icon] || Layers;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="bg-surface border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-300"
    >
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-6 flex items-start gap-4 group"
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Icon size={20} className="text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-primary font-bold">
              Module {String(module.number).padStart(2, "0")}
            </span>
            <span className="text-text-secondary/40 font-mono text-xs">·</span>
            <span className="text-text-secondary/60 font-mono text-xs truncate">
              {module.subtitle}
            </span>
          </div>

          <h3 className="font-mono text-text-primary font-bold text-lg group-hover:text-primary transition-colors">
            {module.title}
          </h3>

          <p className="text-text-secondary text-sm leading-relaxed mt-2 line-clamp-2">
            {module.description}
          </p>
        </div>

        <ChevronDown
          size={18}
          className={`flex-shrink-0 mt-1 text-text-secondary transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-5 border-t border-border/50 pt-5">
              {/* Why it matters */}
              <div>
                <h4 className="font-mono text-sm text-primary font-bold mb-2">
                  Why This Matters for Your Product
                </h4>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {module.whyItMatters}
                </p>
              </div>

              {/* Key decisions */}
              <div>
                <h4 className="font-mono text-sm text-accent font-bold mb-2 flex items-center gap-2">
                  <ListChecks size={14} />
                  Key Product Decisions
                </h4>
                <ul className="space-y-2">
                  {module.keyDecisions.map((decision, i) => (
                    <li key={i} className="flex items-start gap-2 text-text-secondary text-sm">
                      <span className="text-accent font-mono text-xs mt-0.5 flex-shrink-0">
                        {i + 1}.
                      </span>
                      {decision}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Questions for engineering */}
              <div>
                <h4 className="font-mono text-sm text-success font-bold mb-2 flex items-center gap-2">
                  <MessageCircleQuestion size={14} />
                  Ask Your Engineering Team
                </h4>
                <ul className="space-y-2">
                  {module.questionsForEngineering.map((q, i) => (
                    <li key={i} className="flex items-start gap-2 text-text-secondary text-sm">
                      <span className="text-success font-mono text-xs mt-0.5 flex-shrink-0">→</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related developer patterns */}
              <div className="pt-2 border-t border-border/30">
                <p className="font-mono text-xs text-text-secondary/60 mb-2">
                  Related engineering patterns:
                </p>
                <div className="flex flex-wrap gap-2">
                  {module.relatedPatterns.map((name) => (
                    <span
                      key={name}
                      className="inline-block font-mono text-xs text-primary/80 bg-primary/5 border border-primary/15 rounded-full px-3 py-1"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
