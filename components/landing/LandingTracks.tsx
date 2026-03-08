"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Code2,
  Puzzle,
  Gamepad2,
  BarChart3,
  Briefcase,
  Crosshair,
} from "lucide-react";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";

export default function LandingTracks() {
  return (
    <section id="tracks" className="py-20 bg-surface/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Two Tracks. Pick Yours." decorator="⟨⟩" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {/* Developer Track */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-surface border border-primary/30 rounded-xl p-8 hover:border-primary/50 transition-all flex flex-col"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Code2 size={20} className="text-primary" />
              </div>
              <h3 className="font-mono text-lg text-text-primary font-bold">
                For Developers
              </h3>
            </div>

            <p className="text-text-primary font-medium mb-1">We teach you:</p>
            <p className="text-text-secondary text-sm leading-relaxed mb-5">
              The 21 agentic design patterns — mapped to SWE concepts you
              already know. Code examples, architecture breakdowns, production
              notes.
            </p>

            <div className="space-y-2.5 mb-6 flex-1">
              {[
                {
                  icon: <BookOpen size={14} />,
                  text: "21 patterns with Python pseudocode",
                },
                {
                  icon: <Puzzle size={14} />,
                  text: "SWE mapping for every pattern",
                },
                {
                  icon: <Gamepad2 size={14} />,
                  text: "Drag-and-drop Agent Builder game",
                },
                {
                  icon: <BarChart3 size={14} />,
                  text: "Leaderboard & progress tracking",
                },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2.5 text-text-secondary text-sm"
                >
                  <span className="text-primary flex-shrink-0">
                    {item.icon}
                  </span>
                  {item.text}
                </div>
              ))}
            </div>

            <Link
              href="#curriculum"
              className="inline-flex items-center gap-2 text-primary font-mono text-sm hover:underline"
            >
              Preview patterns →
            </Link>
          </motion.div>

          {/* PM Track */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-surface border border-accent/30 rounded-xl p-8 hover:border-accent/50 transition-all flex flex-col"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Briefcase size={20} className="text-accent" />
              </div>
              <h3 className="font-mono text-lg text-text-primary font-bold">
                For Product Managers
              </h3>
            </div>

            <p className="text-text-primary font-medium mb-1">We give you:</p>
            <p className="text-text-secondary text-sm leading-relaxed mb-5">
              Decision frameworks for agentic AI — zero code. The tradeoffs,
              questions, and vocabulary you need to lead AI product decisions.
            </p>

            <div className="space-y-2.5 mb-6 flex-1">
              {[
                {
                  icon: <BookOpen size={14} />,
                  text: "11 modules — no code required",
                },
                {
                  icon: <Crosshair size={14} />,
                  text: "Tradeoff frameworks (cost / quality / latency)",
                },
                {
                  icon: <Gamepad2 size={14} />,
                  text: "Ship or Skip scenario game",
                },
                {
                  icon: <Gamepad2 size={14} />,
                  text: "Budget Builder & Stakeholder Sim",
                },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2.5 text-text-secondary text-sm"
                >
                  <span className="text-accent flex-shrink-0">
                    {item.icon}
                  </span>
                  {item.text}
                </div>
              ))}
            </div>

            <Link
              href="/signup"
              className="inline-flex items-center gap-2 text-accent font-mono text-sm hover:underline"
            >
              Sign up to unlock →
            </Link>
          </motion.div>
        </div>

        {/* Quick stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
          {[
            { value: "21", label: "Developer Patterns" },
            { value: "11", label: "PM Modules" },
            { value: "4", label: "Interactive Games" },
            { value: "Free", label: "No Credit Card" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-code-bg border border-border rounded-lg py-3 px-4 text-center"
            >
              <span className="font-mono text-xl text-primary font-bold">
                {stat.value}
              </span>
              <span className="block text-text-secondary text-[11px] font-mono mt-0.5">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
