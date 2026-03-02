"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

interface ProgressCircleProps {
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export default function ProgressCircle({
  size = 120,
  strokeWidth = 8,
  showLabel = true,
}: ProgressCircleProps) {
  const { user, readSlugs, progressPercent } = useAuth();

  if (!user) return null;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (progressPercent / 100) * circumference;
  const gap = circumference - filled;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-border"
            strokeWidth={strokeWidth}
          />
          {/* Filled arc */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-primary"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: gap }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-bold text-primary">
            {progressPercent}%
          </span>
          <span className="text-text-secondary text-[10px] font-mono">
            {readSlugs.length}/21
          </span>
        </div>
      </div>

      {showLabel && (
        <span className="text-text-secondary text-xs font-mono text-center">
          Patterns Read
        </span>
      )}
    </div>
  );
}
