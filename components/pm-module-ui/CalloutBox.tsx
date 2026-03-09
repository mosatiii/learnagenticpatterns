"use client";

import { ReactNode } from "react";

type Variant = "blue" | "orange" | "green";

const variantStyles: Record<Variant, string> = {
  blue: "bg-primary/5 border-primary/30 border-l-4 border-l-primary",
  orange: "bg-amber-500/5 border-amber-500/30 border-l-4 border-l-amber-500",
  green: "bg-success/5 border-success/30 border-l-4 border-l-success",
};

interface CalloutBoxProps {
  variant?: Variant;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function CalloutBox({
  variant = "blue",
  title,
  children,
  className = "",
}: CalloutBoxProps) {
  return (
    <div
      className={`rounded-lg p-6 ${variantStyles[variant]} ${className}`}
      role="note"
    >
      {title && (
        <h4 className="font-mono text-sm font-bold text-text-primary mb-2">
          {title}
        </h4>
      )}
      <div className="text-text-secondary text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}
