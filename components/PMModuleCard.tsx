"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Layers, Compass, Zap, ShieldCheck, Plug, Users, Brain, BarChart3, GitBranch, Search, Terminal } from "lucide-react";
import Link from "next/link";
import type { PMModule } from "@/data/pm-curriculum";
import { useAuth } from "@/contexts/AuthContext";

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
  terminal: Terminal,
} as const;

interface PMModuleCardProps {
  module: PMModule;
  index: number;
}

export default function PMModuleCard({ module, index }: PMModuleCardProps) {
  const Icon = iconMap[module.icon] || Layers;
  const { readSlugs } = useAuth();
  const isRead = readSlugs.includes(module.slug);

  return (
    <Link href={`/pm/${module.slug}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="relative group bg-surface border border-border rounded-lg p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-primary text-sm font-bold">
              {String(module.number).padStart(2, "0")}
            </span>
            <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
              <Icon size={14} className="text-primary" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isRead && (
              <span className="w-5 h-5 rounded-full bg-success/10 border border-success/30 flex items-center justify-center">
                <Check size={10} className="text-success" />
              </span>
            )}
            {module.isFree && !module.hideFreeBadge && (
              <span className="font-mono text-[10px] text-accent border border-accent/30 bg-accent/5 rounded-full px-2 py-0.5 uppercase tracking-wider">
                Free
              </span>
            )}
            <ArrowRight
              size={14}
              className="text-text-secondary group-hover:text-primary transition-colors"
            />
          </div>
        </div>

        <h3 className="font-mono text-text-primary font-bold text-lg mb-2 group-hover:text-primary transition-colors">
          {module.title}
        </h3>

        <p className="text-text-secondary text-sm mb-3 font-mono">
          {module.subtitle}
        </p>

        <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
          {module.description}
        </p>

        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-primary/30" />
      </motion.div>
    </Link>
  );
}
