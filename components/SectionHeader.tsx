"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  decorator?: string;
  centered?: boolean;
}

export default function SectionHeader({
  title,
  subtitle,
  decorator = ">",
  centered = true,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${centered ? "text-center" : ""}`}
    >
      <span className="font-mono text-primary text-sm tracking-wider mb-3 block cursor-default select-none">
        {decorator} {decorator === ">" ? "_" : ""}
      </span>
      <h2 className="font-mono text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary leading-tight mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-text-secondary text-lg max-w-3xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="circuit-line mt-6 max-w-xs mx-auto" />
    </motion.div>
  );
}
