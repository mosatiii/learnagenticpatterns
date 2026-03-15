"use client";

import { motion } from "framer-motion";
import { getGameConfig } from "@/data/games";
import type { BlockCategory } from "@/data/games";

const CATEGORY_STYLES: Record<BlockCategory, { fill: string; stroke: string; text: string; icon: string }> = {
  agent:      { fill: "#00D4FF10", stroke: "#00D4FF", text: "#00D4FF", icon: "⚡" },
  gate:       { fill: "#10B98110", stroke: "#10B981", text: "#10B981", icon: "◆" },
  data:       { fill: "#F59E0B10", stroke: "#F59E0B", text: "#F59E0B", icon: "▣" },
  distractor: { fill: "#6B728010", stroke: "#6B7280", text: "#6B7280", icon: "✗" },
};

interface Props {
  patternSlug: string;
}

export default function PatternFlowDiagram({ patternSlug }: Props) {
  const config = getGameConfig(patternSlug);
  if (!config) return null;

  const requiredBlocks = config.requiredBlockIds
    .map((id) => config.availableBlocks.find((b) => b.id === id))
    .filter(Boolean);

  if (requiredBlocks.length === 0) return null;

  const nodeWidth = 160;
  const nodeHeight = 56;
  const hGap = 40;
  const vGap = 24;
  const padding = 20;

  // Determine layout: if 5+ nodes, use 2-row layout
  const useTwoRows = requiredBlocks.length >= 5;
  const topRow = useTwoRows ? requiredBlocks.slice(0, Math.ceil(requiredBlocks.length / 2)) : requiredBlocks;
  const bottomRow = useTwoRows ? requiredBlocks.slice(Math.ceil(requiredBlocks.length / 2)) : [];

  const totalWidth = Math.max(topRow.length, bottomRow.length) * (nodeWidth + hGap) - hGap + padding * 2;
  const totalHeight = useTwoRows
    ? 2 * nodeHeight + vGap + padding * 2 + 30
    : nodeHeight + padding * 2 + 30;

  function renderNode(block: typeof requiredBlocks[0], x: number, y: number, index: number) {
    if (!block) return null;
    const style = CATEGORY_STYLES[block.category];
    return (
      <motion.g
        key={block.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.12, duration: 0.4 }}
      >
        <rect
          x={x}
          y={y}
          width={nodeWidth}
          height={nodeHeight}
          rx={10}
          fill={style.fill}
          stroke={style.stroke}
          strokeWidth={1.5}
        />
        <text
          x={x + nodeWidth / 2}
          y={y + nodeHeight / 2 - 6}
          textAnchor="middle"
          fill={style.text}
          fontSize={11}
          fontFamily="monospace"
          fontWeight="bold"
        >
          {block.label.length > 18 ? block.label.slice(0, 17) + "…" : block.label}
        </text>
        <text
          x={x + nodeWidth / 2}
          y={y + nodeHeight / 2 + 10}
          textAnchor="middle"
          fill={style.text}
          fontSize={9}
          fontFamily="monospace"
          opacity={0.6}
        >
          {block.category}
        </text>
      </motion.g>
    );
  }

  function renderArrow(x1: number, y1: number, x2: number, y2: number, index: number) {
    const midY = (y1 + y2) / 2;
    const isStraight = Math.abs(y1 - y2) < 2;

    const path = isStraight
      ? `M ${x1} ${y1} L ${x2} ${y2}`
      : `M ${x1} ${y1} C ${x1 + 20} ${y1}, ${x2 - 20} ${y2}, ${x2} ${y2}`;

    return (
      <motion.path
        key={`arrow-${index}`}
        d={path}
        fill="none"
        stroke="#00D4FF"
        strokeWidth={1.5}
        strokeDasharray="6 3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: index * 0.12 + 0.2, duration: 0.5 }}
        markerEnd="url(#arrowhead)"
      />
    );
  }

  const nodePositions: { x: number; y: number }[] = [];

  // Calculate positions
  topRow.forEach((_, i) => {
    const rowWidth = topRow.length * (nodeWidth + hGap) - hGap;
    const xOffset = (totalWidth - rowWidth) / 2;
    nodePositions.push({
      x: xOffset + i * (nodeWidth + hGap),
      y: padding + 10,
    });
  });

  bottomRow.forEach((_, i) => {
    const rowWidth = bottomRow.length * (nodeWidth + hGap) - hGap;
    const xOffset = (totalWidth - rowWidth) / 2;
    nodePositions.push({
      x: xOffset + i * (nodeWidth + hGap),
      y: padding + 10 + nodeHeight + vGap,
    });
  });

  return (
    <div className="bg-code-bg border border-border rounded-xl p-4 mb-6 overflow-x-auto select-none cursor-default">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-xs text-primary font-bold">Architecture Flow</span>
        <div className="flex gap-3 ml-auto">
          {(["agent", "gate"] as BlockCategory[]).map((cat) => (
            <span key={cat} className="flex items-center gap-1 text-[10px] font-mono" style={{ color: CATEGORY_STYLES[cat].text }}>
              <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: CATEGORY_STYLES[cat].stroke }} />
              {cat}
            </span>
          ))}
        </div>
      </div>
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className="w-full pointer-events-none"
        style={{ maxHeight: useTwoRows ? 200 : 130 }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="7"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="#00D4FF" />
          </marker>
        </defs>

        {/* Arrows between consecutive nodes */}
        {nodePositions.map((pos, i) => {
          if (i === 0) return null;
          const prev = nodePositions[i - 1];
          return renderArrow(
            prev.x + nodeWidth,
            prev.y + nodeHeight / 2,
            pos.x,
            pos.y + nodeHeight / 2,
            i,
          );
        })}

        {/* Nodes */}
        {requiredBlocks.map((block, i) => {
          const pos = nodePositions[i];
          return renderNode(block, pos.x, pos.y, i);
        })}
      </svg>
    </div>
  );
}
