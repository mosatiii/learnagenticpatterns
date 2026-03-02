"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import type { BlockDefinition, SimulationEvent } from "@/data/games";
import CanvasNode from "./CanvasNode";
import ConnectionEdges from "./ConnectionEdges";

interface PlacedNode {
  instanceId: string;
  blockId: string;
}

interface BuildCanvasProps {
  placedNodes: PlacedNode[];
  blockMap: Map<string, BlockDefinition>;
  nodeStatuses: Map<string, SimulationEvent>;
  isSimulating: boolean;
  onDrop: (blockId: string) => void;
  onRemove: (instanceId: string) => void;
  onReorder: (fromIdx: number, toIdx: number) => void;
}

export default function BuildCanvas({
  placedNodes,
  blockMap,
  nodeStatuses,
  isSimulating,
  onDrop,
  onRemove,
  onReorder,
}: BuildCanvasProps) {
  const [dragOverActive, setDragOverActive] = useState(false);
  const [reorderDragIdx, setReorderDragIdx] = useState<number | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDragOverActive(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOverActive(false);
      const blockId = e.dataTransfer.getData("application/block-id");
      if (blockId) {
        onDrop(blockId);
      }
    },
    [onDrop]
  );

  // Reordering within canvas
  const handleNodeDragStart = useCallback((e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("application/reorder-idx", String(index));
    e.dataTransfer.effectAllowed = "move";
    setReorderDragIdx(index);
  }, []);

  const handleNodeDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleNodeDrop = useCallback(
    (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();
      e.stopPropagation();
      const fromIdxStr = e.dataTransfer.getData("application/reorder-idx");
      if (fromIdxStr !== "") {
        const fromIdx = Number(fromIdxStr);
        if (fromIdx !== targetIndex) {
          onReorder(fromIdx, targetIndex);
        }
      }
      setReorderDragIdx(null);
    },
    [onReorder]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative min-h-[300px] rounded-lg border-2 border-dashed p-4 transition-colors
        ${dragOverActive ? "border-primary/60 bg-primary/5" : "border-border bg-code-bg/50"}
      `}
    >
      {placedNodes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full min-h-[280px] text-text-secondary/40">
          <Plus size={32} className="mb-3" />
          <p className="font-mono text-sm text-center">
            Drop blocks here to build your agent pipeline
          </p>
          <p className="font-mono text-xs mt-1 text-center">
            Arrange them in the correct order
          </p>
        </div>
      ) : (
        <div className="relative space-y-2">
          {/* Connection lines */}
          <ConnectionEdges
            count={placedNodes.length}
            nodeStatuses={nodeStatuses}
            placedNodeIds={placedNodes.map((n) => n.blockId)}
            isSimulating={isSimulating}
          />

          {/* Nodes */}
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
                  isSimulating={isSimulating}
                  onRemove={onRemove}
                  onDragStart={handleNodeDragStart}
                  onDragOver={handleNodeDragOver}
                  onDrop={handleNodeDrop}
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Node count indicator */}
      {placedNodes.length > 0 && (
        <div className="mt-3 text-center">
          <span className="font-mono text-xs text-text-secondary/50">
            {placedNodes.length} block{placedNodes.length !== 1 ? "s" : ""} placed
          </span>
        </div>
      )}
    </div>
  );
}
