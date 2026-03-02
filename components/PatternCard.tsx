"use client";

import { motion } from "framer-motion";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { formatPatternNumber } from "@/lib/utils";
import type { Pattern } from "@/data/patterns";
import { useAuth } from "@/contexts/AuthContext";

interface PatternCardProps {
  pattern: Pattern;
  index: number;
}

export default function PatternCard({ pattern, index }: PatternCardProps) {
  const { user, readSlugs } = useAuth();

  // Unlocked if: pattern is open by default, OR user is signed in
  const canAccess = pattern.isUnlocked || !!user;
  const isRead = readSlugs.includes(pattern.slug);

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
          canAccess
            ? "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer"
            : "hover:border-accent/30 cursor-pointer"
        }
        ${isRead ? "border-l-2 border-l-success" : ""}
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-primary text-sm font-bold">
          {formatPatternNumber(pattern.number)}
        </span>
        {canAccess ? (
          isRead ? (
            <CheckCircle2 size={14} className="text-success" />
          ) : (
            <ArrowRight
              size={14}
              className="text-text-secondary group-hover:text-primary transition-colors"
            />
          )
        ) : (
          <div className="flex items-center gap-1.5 text-accent">
            <Lock size={12} />
            <span className="text-xs font-mono">Free · Sign Up</span>
          </div>
        )}
      </div>

      <h3 className="font-mono text-text-primary font-bold text-lg mb-2 group-hover:text-primary transition-colors">
        {pattern.name}
      </h3>

      <p className="text-text-secondary text-sm mb-3 font-mono">
        ≈ {pattern.sweParallel}
      </p>

      {canAccess ? (
        <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
          {pattern.description}
        </p>
      ) : (
        <p className="text-text-secondary/60 text-sm leading-relaxed italic">
          Sign up free to access this pattern. No credit card required.
        </p>
      )}

      <div
        className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border ${
          canAccess ? "border-primary/30" : "border-accent/20"
        }`}
      />
    </motion.div>
  );

  if (canAccess) {
    return (
      <Link href={`/patterns/${pattern.slug}`} className="block">
        {content}
      </Link>
    );
  }

  return (
    <Link href="/signup" className="block">
      {content}
    </Link>
  );
}
