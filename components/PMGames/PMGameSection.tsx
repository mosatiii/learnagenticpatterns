"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Ship, Wallet, Users } from "lucide-react";
import ShipOrSkip from "./ShipOrSkip";
import BudgetBuilder from "./BudgetBuilder";
import StakeholderSimulator from "./StakeholderSimulator";

const TABS = [
  { id: "ship-or-skip", label: "Ship or Skip", icon: Ship, color: "accent" },
  { id: "budget-builder", label: "Budget Builder", icon: Wallet, color: "success" },
  { id: "stakeholder-sim", label: "Stakeholder Sim", icon: Users, color: "primary" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const TAB_COLOR_CLASSES: Record<string, { active: string; indicator: string }> = {
  accent: { active: "border-accent bg-accent/10 text-accent", indicator: "border-accent/30" },
  success: { active: "border-success bg-success/10 text-success", indicator: "border-success/30" },
  primary: { active: "border-primary bg-primary/10 text-primary", indicator: "border-primary/30" },
};

export default function PMGameSection() {
  const [activeTab, setActiveTab] = useState<TabId>("ship-or-skip");

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const colors = TAB_COLOR_CLASSES[tab.color];
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative inline-flex items-center gap-2 font-mono text-sm px-5 py-2.5 rounded-md transition-all border ${
                isActive
                  ? colors.active
                  : "border-border text-text-secondary hover:text-text-primary hover:border-primary/30"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="pm-game-tab"
                  className={`absolute inset-0 rounded-md border ${colors.indicator}`}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Game description */}
      <div className="mb-6">
        {activeTab === "ship-or-skip" && (
          <p className="text-text-secondary text-sm leading-relaxed">
            You&apos;re shown a real product scenario with three agentic AI approaches.
            Pick the best one. You&apos;ll be scored on decision accuracy across 8 rounds.
          </p>
        )}
        {activeTab === "budget-builder" && (
          <p className="text-text-secondary text-sm leading-relaxed">
            Given a user story and a monthly budget, allocate model tiers across system
            components to maximize quality while staying within budget. 5 scenarios of increasing complexity.
          </p>
        )}
        {activeTab === "stakeholder-sim" && (
          <p className="text-text-secondary text-sm leading-relaxed">
            You&apos;re a PM at a company building AI features. Each round, 3 stakeholders
            pitch competing approaches. Pick the best path — scored on business impact, technical feasibility, and strategic thinking.
          </p>
        )}
      </div>

      {/* Active game */}
      {activeTab === "ship-or-skip" && <ShipOrSkip />}
      {activeTab === "budget-builder" && <BudgetBuilder />}
      {activeTab === "stakeholder-sim" && <StakeholderSimulator />}
    </div>
  );
}
