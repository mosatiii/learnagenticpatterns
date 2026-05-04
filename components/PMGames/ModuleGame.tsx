"use client";

import { Sparkles } from "lucide-react";
import { getPMModuleBySlug, gameSlugForModule, type PMGameType } from "@/data/pm-curriculum";
import {
  getShipGameFor, getBudgetGameFor, getStakeholderGameFor,
} from "@/data/pm-module-games";
import { getEvalDesignerGameFor } from "@/data/pm-eval-designer";
import { getIncidentTriageGameFor } from "@/data/pm-incident-triage";
import { getPromptSurgeonGameFor } from "@/data/pm-prompt-surgeon";
import { getArchSketcherGameFor } from "@/data/pm-architecture-sketcher";
import ShipOrSkip from "./ShipOrSkip";
import BudgetBuilder from "./BudgetBuilder";
import StakeholderSimulator from "./StakeholderSimulator";
import EvalDesigner from "./EvalDesigner";
import IncidentTriage from "./IncidentTriage";
import PromptSurgeon from "./PromptSurgeon";
import ArchitectureSketcher from "./ArchitectureSketcher";

interface Props {
  /** PM module slug, e.g. "intelligent-routing". */
  moduleSlug: string;
}

export default function ModuleGame({ moduleSlug }: Props) {
  const mod = getPMModuleBySlug(moduleSlug);
  if (!mod) return null;

  const gameType: PMGameType = mod.gameType ?? "ship-or-skip";
  const slug = gameSlugForModule(moduleSlug);
  const title = mod.title;

  if (gameType === "ship-or-skip") {
    const rounds = getShipGameFor(moduleSlug);
    if (!rounds) return <ComingSoon moduleTitle={mod.title} format="Ship or Skip" />;
    return <ShipOrSkip rounds={rounds} slug={slug} title={title} />;
  }

  if (gameType === "budget-builder") {
    const scenarios = getBudgetGameFor(moduleSlug);
    if (!scenarios) return <ComingSoon moduleTitle={mod.title} format="Budget Builder" />;
    return <BudgetBuilder scenarios={scenarios} slug={slug} title={title} />;
  }

  if (gameType === "stakeholder-sim") {
    const rounds = getStakeholderGameFor(moduleSlug);
    if (!rounds) return <ComingSoon moduleTitle={mod.title} format="Stakeholder Sim" />;
    return <StakeholderSimulator rounds={rounds} slug={slug} title={title} />;
  }

  if (gameType === "eval-designer") {
    const scenarios = getEvalDesignerGameFor(moduleSlug);
    if (!scenarios) return <ComingSoon moduleTitle={mod.title} format="Eval Designer" />;
    return <EvalDesigner scenarios={scenarios} slug={slug} title={title} />;
  }

  if (gameType === "incident-triage") {
    const scenarios = getIncidentTriageGameFor(moduleSlug);
    if (!scenarios) return <ComingSoon moduleTitle={mod.title} format="Incident Triage" />;
    return <IncidentTriage scenarios={scenarios} slug={slug} title={title} />;
  }

  if (gameType === "prompt-surgeon") {
    const scenarios = getPromptSurgeonGameFor(moduleSlug);
    if (!scenarios) return <ComingSoon moduleTitle={mod.title} format="Prompt Surgeon" />;
    return <PromptSurgeon scenarios={scenarios} slug={slug} title={title} />;
  }

  if (gameType === "architecture-sketcher") {
    const scenarios = getArchSketcherGameFor(moduleSlug);
    if (!scenarios) return <ComingSoon moduleTitle={mod.title} format="Architecture Sketcher" />;
    return <ArchitectureSketcher scenarios={scenarios} slug={slug} title={title} />;
  }

  return null;
}

function ComingSoon({ moduleTitle, format }: { moduleTitle: string; format: string }) {
  return (
    <div className="max-w-xl mx-auto bg-surface border border-border rounded-2xl p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto mb-4">
        <Sparkles size={20} className="text-accent" />
      </div>
      <p className="font-mono text-xs text-text-secondary mb-1">Coming soon</p>
      <h2 className="text-lg font-bold text-text-primary mb-3">
        {moduleTitle} — {format} Game
      </h2>
      <p className="text-text-secondary text-sm leading-relaxed">
        We&apos;re writing module-specific scenarios for this lesson&apos;s {format} game.
        It&apos;ll show up here as soon as it&apos;s ready.
      </p>
    </div>
  );
}
