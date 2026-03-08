"use client";

import { motion } from "framer-motion";
import { ArrowRight, Gamepad2 } from "lucide-react";
import Link from "next/link";

const stagger = {
  container: { transition: { staggerChildren: 0.15 } },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  },
};

export default function LandingHero() {
  return (
    <section className="pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            variants={stagger.item}
            className="inline-block font-mono text-xs text-primary border border-primary/30 rounded-full px-3 py-1 mb-6"
          >
            Based on Antonio Gull&iacute;&apos;s 21 Agentic Design Patterns
          </motion.span>

          <motion.h1
            variants={stagger.item}
            className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6"
          >
            Don&apos;t fear AI agents.{" "}
            <span className="text-gradient">Build them.</span>
          </motion.h1>

          <motion.p
            variants={stagger.item}
            className="text-text-secondary text-lg md:text-xl leading-relaxed mb-4 max-w-2xl mx-auto"
          >
            Open source and LeetCode-like for AI agents.
          </motion.p>

          <motion.p
            variants={stagger.item}
            className="text-text-secondary/80 text-base leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            Free curriculum. Two tracks. Interactive games.
            <br className="hidden sm:block" />
            Pick the one that matches how you work.
          </motion.p>

          <motion.div
            variants={stagger.item}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              Start Free
              <ArrowRight size={18} />
            </Link>
            <a
              href="https://practice.learnagenticpatterns.com"
              className="inline-flex items-center justify-center gap-2 border border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all"
            >
              <Gamepad2 size={18} />
              Practice
            </a>
            <Link
              href="#tracks"
              className="inline-flex items-center justify-center gap-2 border border-border hover:border-primary/50 text-text-secondary hover:text-primary font-sans font-medium text-base px-8 py-3.5 rounded-md transition-all"
            >
              See what&apos;s inside
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
