"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface CollapsibleTextProps {
  children: React.ReactNode;
  maxHeight?: number;
}

export default function CollapsibleText({ children, maxHeight = 120 }: CollapsibleTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setNeedsCollapse(contentRef.current.scrollHeight > maxHeight + 40);
    }
  }, [children, maxHeight]);

  if (!needsCollapse) {
    return <div>{children}</div>;
  }

  return (
    <div className="relative">
      <motion.div
        animate={{ maxHeight: isExpanded ? 2000 : maxHeight }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div ref={contentRef}>{children}</div>
      </motion.div>

      {!isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
      )}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mt-2 inline-flex items-center gap-1.5 text-primary font-mono text-xs hover:underline transition-colors"
      >
        <ChevronDown
          size={12}
          className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
        {isExpanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
