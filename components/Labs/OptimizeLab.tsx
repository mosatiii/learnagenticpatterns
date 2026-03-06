"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingDown, DollarSign, Gauge, Clock,
  CheckCircle2, XCircle, Lightbulb, RotateCcw,
} from "lucide-react";
import type { OptimizeLabConfig } from "@/data/optimize-labs";
import { calculatePipelineCost } from "@/data/optimize-labs";
import TierBadge from "./TierBadge";

interface OptimizeLabProps {
  config: OptimizeLabConfig;
  patternSlug: string;
  patternName: string;
}

function MetricGauge({
  label,
  value,
  target,
  unit,
  isGood,
  icon: Icon,
}: {
  label: string;
  value: number;
  target: number;
  unit: string;
  isGood: boolean;
  icon: React.ElementType;
}) {
  const formatValue = () => {
    if (unit === "$") return `$${value.toFixed(4)}`;
    if (unit === "ms") return `${Math.round(value)}ms`;
    return `${value.toFixed(1)}%`;
  };
  const formatTarget = () => {
    if (unit === "$") return `$${target.toFixed(4)}`;
    if (unit === "ms") return `${target}ms`;
    return `${target}%`;
  };

  return (
    <div className={`bg-surface border rounded-xl p-4 transition-colors ${
      isGood ? "border-success/30" : "border-red-500/30"
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={16} className={isGood ? "text-success" : "text-red-400"} />
          <span className="font-mono text-xs text-text-secondary">{label}</span>
        </div>
        {isGood ? (
          <CheckCircle2 size={14} className="text-success" />
        ) : (
          <XCircle size={14} className="text-red-400" />
        )}
      </div>
      <p className={`text-xl font-bold font-mono ${isGood ? "text-success" : "text-red-400"}`}>
        {formatValue()}
      </p>
      <p className="font-mono text-[10px] text-text-secondary/50 mt-1">
        Target: {unit === "%" ? `>= ${formatTarget()}` : `<= ${formatTarget()}`}
      </p>
    </div>
  );
}

export default function OptimizeLab({ config, patternSlug, patternName }: OptimizeLabProps) {
  const defaultChoices: Record<string, string> = {};
  for (const step of config.pipeline) {
    defaultChoices[step.id] = step.defaultModel;
  }

  const [modelChoices, setModelChoices] = useState<Record<string, string>>(defaultChoices);
  const [enabledOpts, setEnabledOpts] = useState<Set<string>>(new Set());
  const [hintIdx, setHintIdx] = useState(-1);

  const metrics = useMemo(
    () =>
      calculatePipelineCost(
        config.pipeline,
        modelChoices,
        Array.from(enabledOpts),
        config.availableModels,
        config.optimizations,
      ),
    [modelChoices, enabledOpts, config],
  );

  const costOk = metrics.cost <= config.constraints.maxCostPerRun;
  const qualityOk = metrics.quality >= config.constraints.minQuality;
  const latencyOk = metrics.latency <= config.constraints.maxLatency;
  const allPassed = costOk && qualityOk && latencyOk;

  const handleModelChange = (stepId: string, modelId: string) => {
    setModelChoices((prev) => ({ ...prev, [stepId]: modelId }));
  };

  const toggleOpt = (optId: string) => {
    setEnabledOpts((prev) => {
      const next = new Set(prev);
      if (next.has(optId)) next.delete(optId);
      else next.add(optId);
      return next;
    });
  };

  const reset = () => {
    setModelChoices(defaultChoices);
    setEnabledOpts(new Set());
    setHintIdx(-1);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TierBadge tier="architect" size="md" />
          <span className="px-2 py-0.5 rounded-full bg-surface text-text-secondary font-mono text-[10px] uppercase tracking-wider border border-border">
            Optimize Lab
          </span>
        </div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <TrendingDown size={24} className="text-purple-400" />
          {config.title}
        </h1>
      </div>

      {/* Scenario */}
      <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 mb-6">
        <p className="text-text-primary text-sm leading-relaxed">{config.scenario}</p>
      </div>

      {/* Metric gauges */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <MetricGauge
          label="Cost / Run"
          value={metrics.cost}
          target={config.constraints.maxCostPerRun}
          unit="$"
          isGood={costOk}
          icon={DollarSign}
        />
        <MetricGauge
          label="Quality"
          value={metrics.quality}
          target={config.constraints.minQuality}
          unit="%"
          isGood={qualityOk}
          icon={Gauge}
        />
        <MetricGauge
          label="Latency"
          value={metrics.latency}
          target={config.constraints.maxLatency}
          unit="ms"
          isGood={latencyOk}
          icon={Clock}
        />
      </div>

      {/* Pass/fail banner */}
      {allPassed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-success/5 border border-success/30 rounded-xl p-4 mb-6 text-center"
        >
          <CheckCircle2 size={24} className="text-success mx-auto mb-2" />
          <p className="text-success font-bold">All constraints met!</p>
          <p className="text-success/70 text-xs font-mono">
            Cost: ${metrics.cost.toFixed(4)} | Quality: {metrics.quality.toFixed(1)}% | Latency: {Math.round(metrics.latency)}ms
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Pipeline steps — model selection */}
        <div className="space-y-3">
          <h2 className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2">Pipeline Steps</h2>
          {config.pipeline.map((step) => {
            const selectedModel = config.availableModels.find((m) => m.id === modelChoices[step.id]);
            return (
              <div key={step.id} className="bg-surface border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-text-primary font-medium text-sm">{step.name}</h3>
                    <p className="font-mono text-[10px] text-text-secondary/50">
                      ~{step.inputTokensPerRun} in / ~{step.outputTokensPerRun} out tokens
                    </p>
                  </div>
                  {selectedModel && (
                    <span className="font-mono text-[10px] text-text-secondary/40">
                      Q: {selectedModel.qualityScore}% | {selectedModel.latencyMs}ms
                    </span>
                  )}
                </div>
                <select
                  value={modelChoices[step.id]}
                  onChange={(e) => handleModelChange(step.id, e.target.value)}
                  className="w-full bg-code-bg border border-border rounded-lg px-3 py-2 font-mono text-sm text-text-primary focus:outline-none focus:border-purple-500/50 transition-colors"
                >
                  {config.availableModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name} — ${model.costPerMillionInput}/M in, Q:{model.qualityScore}%, {model.latencyMs}ms
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>

        {/* Optimizations panel */}
        <div className="space-y-3">
          <h2 className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-2">Optimizations</h2>
          {config.optimizations.map((opt) => (
            <button
              key={opt.id}
              onClick={() => toggleOpt(opt.id)}
              className={`w-full text-left bg-surface border rounded-lg p-3 transition-all ${
                enabledOpts.has(opt.id)
                  ? "border-purple-500/40 bg-purple-500/5"
                  : "border-border hover:border-purple-500/20"
              }`}
            >
              <div className="flex items-start gap-2">
                <div className={`w-4 h-4 rounded border mt-0.5 flex-shrink-0 flex items-center justify-center transition-colors ${
                  enabledOpts.has(opt.id) ? "bg-purple-500 border-purple-500" : "border-border"
                }`}>
                  {enabledOpts.has(opt.id) && <CheckCircle2 size={10} className="text-white" />}
                </div>
                <div>
                  <p className="text-text-primary text-sm font-medium">{opt.name}</p>
                  <p className="text-text-secondary text-xs mt-0.5 leading-relaxed">{opt.description}</p>
                  <div className="flex gap-3 mt-2 font-mono text-[10px]">
                    <span className={opt.costMultiplier < 1 ? "text-success" : "text-text-secondary/40"}>
                      Cost: {opt.costMultiplier < 1 ? `${Math.round((1 - opt.costMultiplier) * 100)}% off` : "—"}
                    </span>
                    <span className={opt.qualityMultiplier < 1 ? "text-red-400" : "text-text-secondary/40"}>
                      Quality: {opt.qualityMultiplier < 1 ? `${Math.round((1 - opt.qualityMultiplier) * 100)}% drop` : "—"}
                    </span>
                    <span className={opt.latencyMultiplier !== 1 ? (opt.latencyMultiplier < 1 ? "text-success" : "text-red-400") : "text-text-secondary/40"}>
                      Latency: {opt.latencyMultiplier < 1 ? `${Math.round((1 - opt.latencyMultiplier) * 100)}% faster` : opt.latencyMultiplier > 1 ? `${Math.round((opt.latencyMultiplier - 1) * 100)}% slower` : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}

          {/* Controls */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary font-mono text-xs px-4 py-2 rounded-lg transition-colors border border-border hover:border-primary/30"
            >
              <RotateCcw size={12} />
              Reset
            </button>
            {hintIdx < config.hints.length - 1 && (
              <button
                onClick={() => setHintIdx((i) => i + 1)}
                className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-mono text-xs px-4 py-2 rounded-lg transition-colors border border-yellow-500/20"
              >
                <Lightbulb size={12} />
                Hint
              </button>
            )}
          </div>

          {/* Hints */}
          {hintIdx >= 0 && (
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
              {config.hints.slice(0, hintIdx + 1).map((hint, i) => (
                <p key={i} className="text-yellow-300/80 text-xs font-mono flex items-start gap-2 mb-1 last:mb-0">
                  <Lightbulb size={10} className="mt-0.5 flex-shrink-0" />
                  {hint}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
