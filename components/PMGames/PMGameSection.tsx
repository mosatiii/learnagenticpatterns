"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Ship, Wallet } from "lucide-react";
import ShipOrSkip from "./ShipOrSkip";
import BudgetBuilder from "./BudgetBuilder";

const TABS = [
  { id: "ship-or-skip", label: "Ship or Skip", icon: Ship, color: "accent" },
  { id: "budget-builder", label: "Budget Builder", icon: Wallet, color: "success" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function PMGameSection() {
  const [activeTab, setActiveTab] = useState<TabId>("ship-or-skip");

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-2 mb-6">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative inline-flex items-center gap-2 font-mono text-sm px-5 py-2.5 rounded-md transition-all border ${
                isActive
                  ? tab.color === "accent"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-success bg-success/10 text-success"
                  : "border-border text-text-secondary hover:text-text-primary hover:border-primary/30"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="pm-game-tab"
                  className={`absolute inset-0 rounded-md border ${
                    tab.color === "accent" ? "border-accent/30" : "border-success/30"
                  }`}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Game description */}
      <div className="mb-6">
        {activeTab === "ship-or-skip" ? (
          <p className="text-text-secondary text-sm leading-relaxed">
            You&apos;re shown a real product scenario with three agentic AI approaches.
            Pick the best one. You&apos;ll be scored on decision accuracy across 5 rounds.
          </p>
        ) : (
          <p className="text-text-secondary text-sm leading-relaxed">
            Given a user story and a monthly budget, allocate model tiers across system
            components to maximize quality while staying within budget. 3 scenarios of increasing complexity.
          </p>
        )}
      </div>

      {/* Active game */}
      {activeTab === "ship-or-skip" ? <ShipOrSkip /> : <BudgetBuilder />}
    </div>
  );
}
