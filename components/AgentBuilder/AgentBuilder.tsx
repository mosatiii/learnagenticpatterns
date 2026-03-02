"use client";

import { useReducer, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Lightbulb, Target } from "lucide-react";
import { getGameConfig } from "@/data/games";
import type { BlockDefinition, SimulationEvent } from "@/data/games";
import { runSimulation, calculateScore } from "@/lib/game/simulation-engine";
import type { Score } from "@/lib/game/simulation-engine";
import { useAuth } from "@/contexts/AuthContext";
import BlockPalette from "./BlockPalette";
import BuildCanvas from "./BuildCanvas";
import ScoreCard from "./ScoreCard";

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

// ─── Component ───────────────────────────────────────────────────────────────

interface AgentBuilderProps {
  patternSlug: string;
}

export default function AgentBuilder({ patternSlug }: AgentBuilderProps) {
  const config = getGameConfig(patternSlug);
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scoreSavedRef = useRef(false);
  const { saveGameScore } = useAuth();

  // Cleanup simulation timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Persist score to backend once when game completes
  useEffect(() => {
    if (state.phase !== "complete" || !state.score || scoreSavedRef.current) return;
    scoreSavedRef.current = true;
    saveGameScore({
      patternSlug,
      scoreTotal: state.score.total,
      scoreMax: state.score.maxTotal,
      architecture: state.score.architecture,
      resilience: state.score.resilience,
      efficiency: state.score.efficiency,
      passed: state.score.passed,
    });
  }, [state.phase, state.score, patternSlug, saveGameScore]);

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

  const handleDrop = useCallback((blockId: string) => {
    dispatch({ type: "PLACE_BLOCK", blockId });
  }, []);

  const handleRemove = useCallback((instanceId: string) => {
    dispatch({ type: "REMOVE_BLOCK", instanceId });
  }, []);

  const handleReorder = useCallback((fromIdx: number, toIdx: number) => {
    dispatch({ type: "REORDER", fromIdx, toIdx });
  }, []);

  const handleRun = useCallback(() => {
    if (!config || state.placedNodes.length === 0) return;
    const placedIds = state.placedNodes.map((n) => n.blockId);
    const events = runSimulation(placedIds, config);
    dispatch({ type: "RUN_SIMULATION", events });
  }, [config, state.placedNodes]);

  const handleReset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    scoreSavedRef.current = false;
    dispatch({ type: "RESET" });
  }, []);

  if (!config) {
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
      {/* Mission briefing */}
      <div className="bg-surface border border-primary/20 rounded-lg p-5 border-glow">
        <div className="flex items-start gap-3">
          <Target size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-mono text-primary text-sm font-bold mb-1">
              Mission: {config.mission}
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              {config.missionDetail}
            </p>
          </div>
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
              onDrop={handleDrop}
              onRemove={handleRemove}
              onReorder={handleReorder}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      {state.phase !== "complete" && (
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

          <button
            onClick={() => dispatch({ type: "SHOW_HINT" })}
            disabled={state.hintIdx >= config.hints.length - 1 || state.phase === "simulating"}
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-mono text-sm px-4 py-2.5 rounded-md transition-colors border border-accent/20 hover:border-accent/40 disabled:opacity-40 ml-auto"
          >
            <Lightbulb size={14} />
            Hint
          </button>
        </div>
      )}

      {/* Hint display */}
      <AnimatePresence>
        {currentHint && state.phase === "building" && (
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
