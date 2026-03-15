"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
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
          <motion.div variants={stagger.item} className="mb-6">
            <a
              href="https://www.amazon.ca/Agentic-Design-Patterns-Hands-Intelligent/dp/3032014018"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-xs text-primary border border-primary/30 rounded-full px-3 py-1 hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer"
            >
              Based on Antonio Gull&iacute;&apos;s 21 Agentic Design Patterns ↗
            </a>
          </motion.div>

          <motion.h1
            variants={stagger.item}
            className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6"
          >
            Practice agentic AI patterns.{" "}
            <span className="text-gradient">Like LeetCode, but for AI agents.</span>
          </motion.h1>

          <motion.p
            variants={stagger.item}
            className="text-text-secondary text-lg md:text-xl leading-relaxed mb-4 max-w-2xl mx-auto"
          >
            Free interactive games, two learning tracks, and a 3-minute AI career assessment.
          </motion.p>

          <motion.p
            variants={stagger.item}
            className="text-text-secondary/80 text-base leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            No sign-up required to start. Find out if AI will replace you.
          </motion.p>

          <motion.div
            variants={stagger.item}
            className="flex flex-col items-center gap-4"
          >
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white font-sans font-semibold text-lg px-10 py-4 rounded-md transition-all hover:shadow-lg hover:shadow-accent/20 animate-pulse-subtle"
            >
              <Sparkles size={20} />
              Will AI Replace Me? — Free Assessment
            </Link>
            <span className="text-text-secondary/50 font-mono text-xs">
              No sign-up required · 3 minutes · Personalized action plan
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
