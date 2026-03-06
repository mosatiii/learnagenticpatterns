"use client";

import { useReducer, useCallback, useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Lightbulb, Target, Timer, Bug, Wrench, Zap } from "lucide-react";
import { getGameConfig } from "@/data/games";
import type { BlockDefinition, SimulationEvent, Difficulty, GameConfig } from "@/data/games";
import { runSimulation, calculateScore } from "@/lib/game/simulation-engine";
import type { Score } from "@/lib/game/simulation-engine";
import { useAuth } from "@/contexts/AuthContext";
import { trackGameEvent } from "@/lib/game/analytics";
import BlockPalette from "./BlockPalette";
import BuildCanvas from "./BuildCanvas";
import ScoreCard from "./ScoreCard";
import DebugCanvas from "./DebugCanvas";

// ─── State Machine ───────────────────────────────────────────────────────────

interface PlacedNode {
  instanceId: string;
  blockId: string;
}

type GamePhase = "building" | "simulating" | "complete";

interface GameState {
  phase: GamePhase;
  placedNodes: PlacedNode[];
  events: SimulationEvent[];
  currentEventIdx: number;
  score: Score | null;
  hintIdx: number;
}

type GameAction =
  | { type: "PLACE_BLOCK"; blockId: string }
  | { type: "REMOVE_BLOCK"; instanceId: string }
  | { type: "REORDER"; fromIdx: number; toIdx: number }
  | { type: "RUN_SIMULATION"; events: SimulationEvent[] }
  | { type: "SIMULATION_TICK" }
  | { type: "SIMULATION_COMPLETE"; score: Score }
  | { type: "RESET" }
  | { type: "INIT_NODES"; nodes: PlacedNode[] }
  | { type: "SHOW_HINT" };

let instanceCounter = 0;

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "PLACE_BLOCK": {
      const node: PlacedNode = {
        instanceId: `node-${++instanceCounter}`,
        blockId: action.blockId,
      };
      return { ...state, placedNodes: [...state.placedNodes, node] };
    }
    case "REMOVE_BLOCK":
      return {
        ...state,
        placedNodes: state.placedNodes.filter((n) => n.instanceId !== action.instanceId),
      };
    case "REORDER": {
      const nodes = [...state.placedNodes];
      const [moved] = nodes.splice(action.fromIdx, 1);
      nodes.splice(action.toIdx, 0, moved);
      return { ...state, placedNodes: nodes };
    }
    case "RUN_SIMULATION":
      return { ...state, phase: "simulating", events: action.events, currentEventIdx: -1 };
    case "SIMULATION_TICK":
      return { ...state, currentEventIdx: state.currentEventIdx + 1 };
    case "SIMULATION_COMPLETE":
      return { ...state, phase: "complete", score: action.score };
    case "RESET":
      return { ...initialState };
    case "INIT_NODES":
      return { ...initialState, placedNodes: action.nodes };
    case "SHOW_HINT":
      return { ...state, hintIdx: state.hintIdx + 1 };
    default:
      return state;
  }
}

const initialState: GameState = {
  phase: "building",
  placedNodes: [],
  events: [],
  currentEventIdx: -1,
  score: null,
  hintIdx: -1,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function applyDifficulty(config: GameConfig, difficulty: Difficulty): GameConfig {
  if (difficulty === "medium") return config;
  const override = config.difficultyOverrides?.[difficulty];
  if (!override) return config;

  let blocks = override.availableBlocks ?? config.availableBlocks;
  if (override.extraDistractors) {
    blocks = [...blocks, ...override.extraDistractors];
  }
  const hints = override.hints ?? config.hints;
  return { ...config, availableBlocks: blocks, hints };
}

function formatTimer(ms: number): string {
  const totalSecs = ms / 1000;
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return mins > 0
    ? `${mins}:${secs.toFixed(1).padStart(4, "0")}`
    : `${secs.toFixed(1)}s`;
}

const DIFFICULTY_OPTIONS: { id: Difficulty; label: string; color: string }[] = [
  { id: "easy", label: "Easy", color: "text-success border-success/30 bg-success/10" },
  { id: "medium", label: "Medium", color: "text-primary border-primary/30 bg-primary/10" },
  { id: "hard", label: "Hard", color: "text-red-400 border-red-500/30 bg-red-500/10" },
];

// ─── Component ───────────────────────────────────────────────────────────────

interface AgentBuilderProps {
  patternSlug: string;
}

export default function AgentBuilder({ patternSlug }: AgentBuilderProps) {
  const rawConfig = getGameConfig(patternSlug);
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scoreSavedRef = useRef(false);
  const attemptRef = useRef(0);
  const buildStartRef = useRef<number | null>(null);
  const { saveGameScore } = useAuth();

  // ─── New feature state ─────────────────────────────────────
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [mode, setMode] = useState<"build" | "debug">("build");
  const [debugIdx, setDebugIdx] = useState(0);
  const [speedRun, setSpeedRun] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const speedStartRef = useRef<number | null>(null);

  const config = useMemo(
    () => (rawConfig ? applyDifficulty(rawConfig, difficulty) : null),
    [rawConfig, difficulty],
  );

  const hasDebug = (rawConfig?.debugChallenges?.length ?? 0) > 0;
  const hasDifficulty = !!rawConfig?.difficultyOverrides;

  // Track game_started on mount
  useEffect(() => {
    if (!config) return;
    attemptRef.current = 1;
    buildStartRef.current = Date.now();
    trackGameEvent("game_started", {
      pattern: patternSlug,
      difficulty,
      mode,
      speed_run: speedRun,
    });
  // Only fire on mount or when pattern changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patternSlug]);

  // Cleanup simulation timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Build timer — always tick while building (speed run uses speedStartRef, normal uses buildStartRef)
  useEffect(() => {
    if (state.phase !== "building") return;
    const ref = speedRun ? speedStartRef.current : buildStartRef.current;
    if (!ref) return;
    const id = setInterval(() => {
      setElapsedMs(Date.now() - ref);
    }, 100);
    return () => clearInterval(id);
  }, [speedRun, state.phase]);

  // Persist score to backend once when game completes
  useEffect(() => {
    if (state.phase !== "complete" || !state.score || scoreSavedRef.current) return;
    scoreSavedRef.current = true;

    const finalElapsed = speedStartRef.current ? Date.now() - speedStartRef.current : 0;
    if (speedRun) setElapsedMs(finalElapsed);

    const percent = Math.round((state.score.total / state.score.maxTotal) * 100);
    trackGameEvent("game_completed", {
      pattern: patternSlug,
      score_percent: percent,
      architecture: state.score.architecture,
      resilience: state.score.resilience,
      efficiency: state.score.efficiency,
      passed: state.score.passed,
      difficulty,
      mode,
      speed_run: speedRun,
      elapsed_ms: finalElapsed,
      attempt_number: attemptRef.current,
    });

    saveGameScore({
      patternSlug,
      scoreTotal: state.score.total,
      scoreMax: state.score.maxTotal,
      architecture: state.score.architecture,
      resilience: state.score.resilience,
      efficiency: state.score.efficiency,
      passed: state.score.passed,
    });
  }, [state.phase, state.score, patternSlug, saveGameScore, difficulty, mode, speedRun]);

  // Step through simulation events with staggered delays
  useEffect(() => {
    if (state.phase !== "simulating" || !config) return;

    const nextIdx = state.currentEventIdx + 1;
    if (nextIdx >= state.events.length) {
      const placedIds = state.placedNodes.map((n) => n.blockId);
      const score = calculateScore(placedIds, config);
      timerRef.current = setTimeout(() => {
        dispatch({ type: "SIMULATION_COMPLETE", score });
      }, 800);
      return;
    }

    const delay = nextIdx === 0 ? 400 : state.events[nextIdx].delay - (state.events[nextIdx - 1]?.delay ?? 0);
    timerRef.current = setTimeout(() => {
      dispatch({ type: "SIMULATION_TICK" });
    }, Math.max(delay, 300));
  }, [state.phase, state.currentEventIdx, state.events, state.placedNodes, config]);

  // ─── Handlers ──────────────────────────────────────────────
  const handleDrop = useCallback((blockId: string) => {
    // Start speed run timer on first block drop
    if (speedRun && !speedStartRef.current) {
      speedStartRef.current = Date.now();
    }
    dispatch({ type: "PLACE_BLOCK", blockId });
    const block = config?.availableBlocks.find((b) => b.id === blockId);
    trackGameEvent("game_block_dropped", {
      pattern: patternSlug,
      block_id: blockId,
      block_category: block?.category ?? "unknown",
    });
  }, [config, patternSlug, speedRun]);

  const handleRemove = useCallback((instanceId: string) => {
    dispatch({ type: "REMOVE_BLOCK", instanceId });
    trackGameEvent("game_block_removed", {
      pattern: patternSlug,
      instance_id: instanceId,
    });
  }, [patternSlug]);

  const handleReorder = useCallback((fromIdx: number, toIdx: number) => {
    dispatch({ type: "REORDER", fromIdx, toIdx });
    trackGameEvent("game_block_reordered", {
      pattern: patternSlug,
      from_idx: fromIdx,
      to_idx: toIdx,
    });
  }, [patternSlug]);

  const handleRun = useCallback(() => {
    if (!config || state.placedNodes.length === 0) return;
    const placedIds = state.placedNodes.map((n) => n.blockId);
    const buildTimeMs = buildStartRef.current ? Date.now() - buildStartRef.current : 0;
    trackGameEvent("game_simulation_started", {
      pattern: patternSlug,
      placed_blocks: placedIds,
      block_count: placedIds.length,
      time_building_ms: buildTimeMs,
      difficulty,
      mode,
    });
    const events = runSimulation(placedIds, config);
    dispatch({ type: "RUN_SIMULATION", events });
  }, [config, state.placedNodes, patternSlug, difficulty, mode]);

  const handleReset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const prevScore = state.score
      ? Math.round((state.score.total / state.score.maxTotal) * 100)
      : null;
    trackGameEvent("game_retry", {
      pattern: patternSlug,
      previous_score: prevScore,
      attempt_number: attemptRef.current,
    });
    attemptRef.current += 1;
    buildStartRef.current = Date.now();
    speedStartRef.current = null;
    setElapsedMs(0);
    scoreSavedRef.current = false;
    dispatch({ type: "RESET" });
  }, [patternSlug, state.score]);

  const handleDifficultyChange = useCallback((d: Difficulty) => {
    trackGameEvent("game_difficulty_selected", {
      pattern: patternSlug,
      difficulty: d,
      previous_difficulty: difficulty,
    });
    setDifficulty(d);
    speedStartRef.current = null;
    setElapsedMs(0);
    buildStartRef.current = Date.now();
    scoreSavedRef.current = false;
    dispatch({ type: "RESET" });
  }, [patternSlug, difficulty]);

  const handleModeSwitch = useCallback((m: "build" | "debug") => {
    setMode(m);
    speedStartRef.current = null;
    setElapsedMs(0);
    buildStartRef.current = Date.now();
    scoreSavedRef.current = false;
    dispatch({ type: "RESET" });
    if (m === "debug") {
      trackGameEvent("game_debug_started", {
        pattern: patternSlug,
        challenge_index: debugIdx,
      });
    }
  }, [patternSlug, debugIdx]);

  const handleSpeedRunToggle = useCallback(() => {
    const next = !speedRun;
    setSpeedRun(next);
    speedStartRef.current = null;
    setElapsedMs(0);
    trackGameEvent("game_speedrun_toggled", {
      pattern: patternSlug,
      enabled: next,
    });
  }, [speedRun, patternSlug]);

  // ─── Render guards ─────────────────────────────────────────
  if (!config || !rawConfig) {
    return (
      <div className="text-center py-16">
        <Target size={48} className="text-text-secondary/30 mx-auto mb-4" />
        <p className="font-mono text-text-secondary text-sm">
          Game coming soon for this pattern.
        </p>
      </div>
    );
  }

  // Map block IDs to their definitions for canvas rendering
  const blockMap = new Map<string, BlockDefinition>();
  config.availableBlocks.forEach((b) => blockMap.set(b.id, b));
  // Also include blocks from raw config for debug mode
  rawConfig.availableBlocks.forEach((b) => { if (!blockMap.has(b.id)) blockMap.set(b.id, b); });

  // Build the event status map for canvas node highlighting
  const nodeStatuses = new Map<string, SimulationEvent>();
  if (state.phase === "simulating" || state.phase === "complete") {
    for (let i = 0; i <= state.currentEventIdx && i < state.events.length; i++) {
      nodeStatuses.set(state.events[i].nodeId, state.events[i]);
    }
  }

  const currentHint =
    state.hintIdx >= 0 && state.hintIdx < config.hints.length
      ? config.hints[state.hintIdx]
      : null;

  return (
    <div className="space-y-6">
      {/* Mode + Difficulty + Speed Run controls */}
      {state.phase === "building" && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Build / Debug toggle */}
          {hasDebug && (
            <div className="flex gap-1 mr-3">
              <button
                onClick={() => handleModeSwitch("build")}
                className={`inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-md border transition-all ${
                  mode === "build"
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-text-secondary hover:text-text-primary"
                }`}
              >
                <Wrench size={12} />
                Build
              </button>
              <button
                onClick={() => handleModeSwitch("debug")}
                className={`inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-md border transition-all ${
                  mode === "debug"
                    ? "border-red-500/40 bg-red-500/10 text-red-400"
                    : "border-border text-text-secondary hover:text-text-primary"
                }`}
              >
                <Bug size={12} />
                Debug
              </button>
            </div>
          )}

          {/* Difficulty selector */}
          {hasDifficulty && mode === "build" && (
            <div className="flex gap-1 mr-3">
              {DIFFICULTY_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleDifficultyChange(opt.id)}
                  className={`font-mono text-xs px-3 py-1.5 rounded-md border transition-all ${
                    difficulty === opt.id
                      ? opt.color
                      : "border-border text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Speed Run toggle */}
          {mode === "build" && (
            <button
              onClick={handleSpeedRunToggle}
              className={`inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-md border transition-all ml-auto ${
                speedRun
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : "border-border text-text-secondary hover:text-text-primary"
              }`}
            >
              <Zap size={12} />
              Speed Run
            </button>
          )}
        </div>
      )}

      {/* Mission briefing */}
      <div className="bg-surface border border-primary/20 rounded-lg p-5 border-glow">
        <div className="flex items-start gap-3">
          {mode === "debug" ? (
            <Bug size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
          ) : (
            <Target size={18} className="text-primary flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            {mode === "debug" && rawConfig.debugChallenges?.[debugIdx] ? (
              <>
                <h3 className="font-mono text-red-400 text-sm font-bold mb-1">
                  Debug Challenge {debugIdx + 1}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {rawConfig.debugChallenges[debugIdx].diagnosisPrompt}
                </p>
              </>
            ) : (
              <>
                <h3 className="font-mono text-primary text-sm font-bold mb-1">
                  Mission: {config.mission}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {config.missionDetail}
                </p>
              </>
            )}
          </div>

          {/* Build timer — always visible during build phase */}
          {state.phase !== "complete" && mode === "build" && (
            <div className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 flex-shrink-0 border ${
              speedRun
                ? "bg-accent/10 border-accent/30"
                : "bg-code-bg border-border"
            }`}>
              <Timer size={12} className={speedRun ? "text-accent" : "text-text-secondary"} />
              <span className={`font-mono text-sm font-bold tabular-nums ${
                speedRun ? "text-accent" : "text-text-secondary"
              }`}>
                {formatTimer(elapsedMs)}
              </span>
              {speedRun && (
                <span className="text-accent/60 text-[10px] font-mono ml-1">SPEED</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Building area */}
      <AnimatePresence mode="wait">
        {state.phase === "complete" && state.score ? (
          <motion.div
            key="score"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ScoreCard
              score={state.score}
              events={state.events}
              successMessage={config.successMessage}
              blockMap={blockMap}
              onRetry={handleReset}
              elapsedMs={speedRun ? elapsedMs : undefined}
              patternSlug={patternSlug}
              explainChallenge={rawConfig.explainChallenge}
            />
          </motion.div>
        ) : mode === "debug" && rawConfig.debugChallenges?.[debugIdx] ? (
          <motion.div
            key="debug"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DebugCanvas
              config={rawConfig}
              challenge={rawConfig.debugChallenges[debugIdx]}
              patternSlug={patternSlug}
              onComplete={(score) => {
                dispatch({ type: "SIMULATION_COMPLETE", score });
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="builder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4"
          >
            {/* Block palette */}
            <BlockPalette
              blocks={config.availableBlocks}
              disabled={state.phase === "simulating"}
            />

            {/* Canvas */}
            <BuildCanvas
              placedNodes={state.placedNodes}
              blockMap={blockMap}
              nodeStatuses={nodeStatuses}
              isSimulating={state.phase === "simulating"}
              activeEdgeIdx={state.currentEventIdx}
              onDrop={handleDrop}
              onRemove={handleRemove}
              onReorder={handleReorder}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls — only show in build mode when not complete */}
      {state.phase !== "complete" && mode === "build" && (
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleRun}
            disabled={state.placedNodes.length === 0 || state.phase === "simulating"}
            className="inline-flex items-center gap-2 bg-success/20 hover:bg-success/30 text-success font-mono text-sm px-5 py-2.5 rounded-md transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-success/30"
          >
            <Play size={14} />
            {state.phase === "simulating" ? "Running..." : "Run Simulation"}
          </button>

          <button
            onClick={handleReset}
            disabled={state.phase === "simulating"}
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary font-mono text-sm px-4 py-2.5 rounded-md transition-colors border border-border hover:border-primary/30 disabled:opacity-40"
          >
            <RotateCcw size={14} />
            Reset
          </button>

          {config.hints.length > 0 && (
            <button
              onClick={() => {
                dispatch({ type: "SHOW_HINT" });
                trackGameEvent("game_hint_used", {
                  pattern: patternSlug,
                  hint_index: state.hintIdx + 1,
                  total_hints: config.hints.length,
                  time_since_start_ms: buildStartRef.current ? Date.now() - buildStartRef.current : 0,
                });
              }}
              disabled={state.hintIdx >= config.hints.length - 1 || state.phase === "simulating"}
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-mono text-sm px-4 py-2.5 rounded-md transition-colors border border-accent/20 hover:border-accent/40 disabled:opacity-40 ml-auto"
            >
              <Lightbulb size={14} />
              Hint
            </button>
          )}
        </div>
      )}

      {/* Hint display */}
      <AnimatePresence>
        {currentHint && state.phase === "building" && mode === "build" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-accent/5 border border-accent/20 rounded-lg px-4 py-3">
              <p className="text-accent text-sm font-mono">
                <Lightbulb size={12} className="inline mr-2" />
                {currentHint}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
