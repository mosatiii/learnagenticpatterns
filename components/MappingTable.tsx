"use client";

import { motion } from "framer-motion";
import { ArrowLeftRight } from "lucide-react";
import { MAPPING_TABLE_DATA } from "@/data/patterns";

export default function MappingTable() {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        {/* Header */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center mb-4 px-4">
          <span className="font-mono text-sm text-primary font-bold">
            Agentic Pattern
          </span>
          <span className="text-text-secondary">
            <ArrowLeftRight size={16} />
          </span>
          <span className="font-mono text-sm text-primary font-bold text-right">
            SWE Concept You Know
          </span>
        </div>

        <div className="circuit-line mb-4" />

        {/* Rows */}
        {MAPPING_TABLE_DATA.map((row, i) => (
          <motion.div
            key={row.agentic}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center py-4 px-4 border-b border-border/50 hover:bg-surface/50 transition-colors group"
          >
            <span className="font-mono text-text-primary text-sm">
              {row.agentic}
            </span>
            <span className="text-primary group-hover:animate-pulse">
              <ArrowLeftRight size={18} />
            </span>
            <span className="font-sans text-text-secondary text-sm text-right">
              {row.swe}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
