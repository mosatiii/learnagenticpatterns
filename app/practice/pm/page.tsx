"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Briefcase, Target, DollarSign, Users, ArrowRight, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const PM_GAMES = [
  {
    slug: "ship-or-skip",
    name: "Ship or Skip",
    description: "Make architecture decisions under pressure. Evaluate proposals and decide: ship it, skip it, or scope it down.",
    icon: Target,
    color: "accent",
    rounds: 8,
    isAvailable: true,
  },
  {
    slug: "budget-builder",
    name: "Budget Builder",
    description: "Allocate token budgets across pipeline components. Balance cost, quality, and latency constraints.",
    icon: DollarSign,
    color: "primary",
    rounds: 5,
    isAvailable: true,
  },
  {
    slug: "stakeholder-sim",
    name: "Stakeholder Simulator",
    description: "Navigate competing stakeholder priorities. Choose whose argument to back when engineering, product, and leadership disagree.",
    icon: Users,
    color: "success",
    rounds: 5,
    isAvailable: true,
  },
];

const stagger = {
  container: { transition: { staggerChildren: 0.1 } },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  },
};

export default function PMLabsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Briefcase size={20} className="text-accent" />
          <span className="font-mono text-xs text-accent uppercase tracking-wider">Product Manager Track</span>
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">PM Decision Labs</h1>
        <p className="text-text-secondary max-w-2xl">
          Practice the decision-making skills that separate good AI PMs from great ones.
          Ship-or-skip calls, budget allocation, stakeholder alignment.
        </p>
      </div>

      <motion.div
        variants={stagger.container}
        initial="hidden"
        animate="visible"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {PM_GAMES.map((game) => {
          const Icon = game.icon;
          return (
            <motion.div key={game.slug} variants={stagger.item}>
              <Link
                href={user ? `/practice/pm/${game.slug}` : "https://learnagenticpatterns.com/signup"}
                className="group block h-full"
              >
                <div className="relative h-full bg-surface border border-border rounded-xl p-6 hover:border-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
                  <div className={`w-10 h-10 rounded-lg bg-${game.color}/10 border border-${game.color}/20 flex items-center justify-center mb-4`}>
                    <Icon size={20} className={`text-${game.color}`} />
                  </div>

                  <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4 leading-relaxed">{game.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-text-secondary">
                      {game.rounds} rounds
                    </span>
                    <ArrowRight size={16} className="text-text-secondary group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>

                  {!user && (
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <div className="flex items-center gap-2 text-text-secondary font-mono text-sm">
                        <Lock size={14} />
                        Sign up to play
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
