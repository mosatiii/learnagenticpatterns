"use client";

import { motion } from "framer-motion";
import { Gamepad2 } from "lucide-react";
import Link from "next/link";
import LiveActivityTicker from "./LiveActivityTicker";

const stagger = {
  container: { transition: { staggerChildren: 0.12 } },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  },
};

export default function LandingHero() {
  return (
    <section className="pt-28 pb-12">
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
              Based on Antonio Gull&iacute;&apos;s 21 Agentic Design Patterns &rarr;
            </a>
          </motion.div>

          <motion.h1
            variants={stagger.item}
            className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6"
          >
            Practice agentic AI patterns.{" "}
            <span className="text-gradient">
              Like LeetCode, but for AI agents.
            </span>
          </motion.h1>

          <motion.p
            variants={stagger.item}
            className="text-text-secondary text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            Free interactive games and two learning tracks. One for developers, one for product managers. No sign up to start.
          </motion.p>

          <motion.div
            variants={stagger.item}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <a
              href="https://practice.learnagenticpatterns.com/patterns/prompt-chaining"
              className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all hover:shadow-lg hover:shadow-primary/20"
            >
              <Gamepad2 size={18} />
              Play the most popular game
            </a>
            <Link
              href="#tracks"
              className="inline-flex items-center justify-center gap-2 border border-border hover:border-primary/40 text-text-primary font-sans font-semibold text-base px-8 py-3.5 rounded-md transition-all"
            >
              Pick your track
            </Link>
          </motion.div>

          <motion.div variants={stagger.item} className="mt-10">
            <LiveActivityTicker />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
