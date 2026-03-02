"use client";

import { motion } from "framer-motion";
import { Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatPatternNumber } from "@/lib/utils";
import type { Pattern } from "@/data/patterns";

interface PatternCardProps {
  pattern: Pattern;
  index: number;
}

export default function PatternCard({ pattern, index }: PatternCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`
        relative group bg-surface border border-border rounded-lg p-6
        transition-all duration-300
        ${
          pattern.isUnlocked
            ? "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer"
            : "hover:border-accent/30 cursor-pointer"
        }
      `}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      {/* Pattern number */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-primary text-sm font-bold">
          {formatPatternNumber(pattern.number)}
        </span>
        {pattern.isUnlocked ? (
          <ArrowRight
            size={14}
            className="text-text-secondary group-hover:text-primary transition-colors"
          />
        ) : (
          <div className="flex items-center gap-1.5 text-accent">
            <Lock size={12} />
            <span className="text-xs font-mono">Free · Sign Up</span>
          </div>
        )}
      </div>

      {/* Pattern name */}
      <h3 className="font-mono text-text-primary font-bold text-lg mb-2 group-hover:text-primary transition-colors">
        {pattern.name}
      </h3>

      {/* SWE parallel */}
      <p className="text-text-secondary text-sm mb-3 font-mono">
        ≈ {pattern.sweParallel}
      </p>

      {/* Description for unlocked, teaser for locked */}
      {pattern.isUnlocked ? (
        <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
          {pattern.description}
        </p>
      ) : (
        <p className="text-text-secondary/60 text-sm leading-relaxed italic">
          Sign up free to access this pattern — no credit card required.
        </p>
      )}

      {/* Glow effect on hover */}
      <div
        className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border ${
          pattern.isUnlocked ? "border-primary/30" : "border-accent/20"
        }`}
      />
    </motion.div>
  );

  if (pattern.isUnlocked) {
    return (
      <Link href={`/patterns/${pattern.slug}`} className="block">
        {content}
      </Link>
    );
  }

  return (
    <Link href="/#signup" className="block">
      {content}
    </Link>
  );
}
