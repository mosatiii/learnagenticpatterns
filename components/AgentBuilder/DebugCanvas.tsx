"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Play, RotateCcw, Bug } from "lucide-react";
import type { GameConfig, DebugChallenge, BlockDefinition, SimulationEvent } from "@/data/games";
import { runSimulation, calculateScore } from "@/lib/game/simulation-engine";
import type { Score } from "@/lib/game/simulation-engine";
import { trackGameEvent } from "@/lib/game/analytics";
import CanvasNode from "./CanvasNode";
import ConnectionEdges from "./ConnectionEdges";
import BlockPalette from "./BlockPalette";

interface PlacedNode {
  instanceId: string;
  blockId: string;
}

let debugInstanceCounter = 0;

interface DebugCanvasProps {
  config: GameConfig;
  challenge: DebugChallenge;
  patternSlug: string;
  onComplete: (score: Score) => void;
}

export default function DebugCanvas({
  config,
  challenge,
  patternSlug,
  onComplete,
}: DebugCanvasProps) {
  const startTimeRef = useRef(Date.now());

  const initNodes = (): PlacedNode[] =>
    challenge.brokenTopology.map((blockId) => ({
      instanceId: `dbg-${++debugInstanceCounter}`,
      blockId,
    }));

  const [placedNodes, setPlacedNodes] = useState<PlacedNode[]>(initNodes);
  const [simulating, setSimulating] = useState(false);
  const [events, setEvents] = useState<SimulationEvent[]>([]);
  const [currentEventIdx, setCurrentEventIdx] = useState(-1);

  const blockMap = new Map<string, BlockDefinition>();
  config.availableBlocks.forEach((b) => blockMap.set(b.id, b));

  // Blocks the player can add (those not currently on canvas)
  const placedBlockIds = new Set(placedNodes.map((n) => n.blockId));
  const availableToAdd = config.availableBlocks.filter((b) => !placedBlockIds.has(b.id));

  const nodeStatuses = new Map<string, SimulationEvent>();
  for (let i = 0; i <= currentEventIdx && i < events.length; i++) {
    nodeStatuses.set(events[i].nodeId, events[i]);
  }

  const handleDrop = useCallback((blockId: string) => {
    setPlacedNodes((prev) => [
      ...prev,
      { instanceId: `dbg-${++debugInstanceCounter}`, blockId },
    ]);
    trackGameEvent("game_debug_block_added", { pattern: patternSlug, block_id: blockId });
  }, [patternSlug]);

  const handleRemove = useCallback((instanceId: string) => {
    const node = placedNodes.find((n) => n.instanceId === instanceId);
    const isCorrectRemoval = challenge.bugs.some(
      (b) => b.type === "distractor" && b.blockId === node?.blockId,
    );
    setPlacedNodes((prev) => prev.filter((n) => n.instanceId !== instanceId));
    trackGameEvent("game_debug_block_removed", {
      pattern: patternSlug,
      block_id: node?.blockId,
      was_correct_removal: isCorrectRemoval,
    });
  }, [placedNodes, patternSlug, challenge.bugs]);

  const handleReorder = useCallback((fromIdx: number, toIdx: number) => {
    setPlacedNodes((prev) => {
      const nodes = [...prev];
      const [moved] = nodes.splice(fromIdx, 1);
      nodes.splice(toIdx, 0, moved);
      return nodes;
    });
    trackGameEvent("game_debug_block_reordered", {
      pattern: patternSlug,
      from_idx: fromIdx,
      to_idx: toIdx,
    });
  }, [patternSlug]);

  const handleSubmit = useCallback(() => {
    if (placedNodes.length === 0 || simulating) return;
    setSimulating(true);

    const placedIds = placedNodes.map((n) => n.blockId);
    const simEvents = runSimulation(placedIds, config);
    setEvents(simEvents);

    // Step through events then score
    let idx = -1;
    const step = () => {
      idx++;
      if (idx >= simEvents.length) {
        const score = calculateScore(placedIds, config);
        const elapsed = Date.now() - startTimeRef.current;
        trackGameEvent("game_debug_submitted", {
          pattern: patternSlug,
          score: Math.round((score.total / score.maxTotal) * 100),
          passed: score.passed,
          time_spent_ms: elapsed,
          bugs_found: challenge.bugs.length,
          bugs_total: challenge.bugs.length,
        });
        setTimeout(() => onComplete(score), 600);
        return;
      }
      setCurrentEventIdx(idx);
      const delay = idx === 0 ? 400 : (simEvents[idx].delay - (simEvents[idx - 1]?.delay ?? 0));
      setTimeout(step, Math.max(delay, 300));
    };
    setTimeout(step, 400);
  }, [placedNodes, simulating, config, patternSlug, challenge.bugs.length, onComplete]);

  const handleReset = useCallback(() => {
    setPlacedNodes(initNodes());
    setSimulating(false);
    setEvents([]);
    setCurrentEventIdx(-1);
    startTimeRef.current = Date.now();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge]);

  // Drag handlers for canvas
  const [dragOverActive, setDragOverActive] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDragOverActive(true);
  }, []);

  const onDragLeave = useCallback(() => setDragOverActive(false), []);

  const onCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOverActive(false);
    const blockId = e.dataTransfer.getData("application/block-id");
    if (blockId) handleDrop(blockId);
  }, [handleDrop]);

  const handleNodeDragStart = useCallback((e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("application/reorder-idx", String(index));
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleNodeDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleNodeDrop = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    const fromIdxStr = e.dataTransfer.getData("application/reorder-idx");
    if (fromIdxStr !== "") {
      const fromIdx = Number(fromIdxStr);
      if (fromIdx !== targetIndex) handleReorder(fromIdx, targetIndex);
    }
  }, [handleReorder]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4">
        {/* Available blocks to add */}
        {availableToAdd.length > 0 && (
          <BlockPalette blocks={availableToAdd} disabled={simulating} />
        )}
        {availableToAdd.length === 0 && (
          <div className="text-center text-text-secondary/40 font-mono text-xs py-6">
            All blocks placed on canvas
          </div>
        )}

        {/* Debug canvas with pre-placed nodes */}
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onCanvasDrop}
          className={`
            relative min-h-[300px] rounded-lg border-2 border-dashed p-4 transition-colors
            ${dragOverActive ? "border-red-400/60 bg-red-500/5" : "border-red-500/30 bg-code-bg/50"}
          `}
        >
          <div className="relative space-y-2">
            <ConnectionEdges
              count={placedNodes.length}
              nodeStatuses={nodeStatuses}
              placedNodeIds={placedNodes.map((n) => n.blockId)}
              isSimulating={simulating}
              activeEdgeIdx={currentEventIdx}
            />
            <AnimatePresence>
              {placedNodes.map((node, i) => {
                const block = blockMap.get(node.blockId);
                if (!block) return null;
                return (
                  <CanvasNode
                    key={node.instanceId}
                    block={block}
                    instanceId={node.instanceId}
                    index={i}
                    status={nodeStatuses.get(node.blockId) ?? null}
                    isSimulating={simulating}
                    onRemove={handleRemove}
                    onDragStart={handleNodeDragStart}
                    onDragOver={handleNodeDragOver}
                    onDrop={handleNodeDrop}
                  />
                );
              })}
            </AnimatePresence>
          </div>

          {placedNodes.length > 0 && (
            <div className="mt-3 text-center">
              <span className="font-mono text-xs text-text-secondary/50">
                {placedNodes.length} block{placedNodes.length !== 1 ? "s" : ""} · Fix the pipeline
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Debug controls */}
      {!simulating && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={placedNodes.length === 0}
            className="inline-flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-mono text-sm px-5 py-2.5 rounded-md transition-all disabled:opacity-40 border border-red-500/30"
          >
            <Play size={14} />
            Submit Fix
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary font-mono text-sm px-4 py-2.5 rounded-md transition-colors border border-border hover:border-primary/30"
          >
            <RotateCcw size={14} />
            Reset Bug
          </button>
        </div>
      )}
    </div>
  );
}
