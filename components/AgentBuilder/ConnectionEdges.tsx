"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { SimulationEvent } from "@/data/games";

const STATUS_COLORS: Record<string, string> = {
  pass: "#00FF88",
  fail: "#FF3232",
  warn: "#FFD700",
};

interface ConnectionEdgesProps {
  count: number;
  nodeStatuses: Map<string, SimulationEvent>;
  placedNodeIds: string[];
  isSimulating: boolean;
  activeEdgeIdx?: number;
}

export default function ConnectionEdges({
  count,
  nodeStatuses,
  placedNodeIds,
  isSimulating,
  activeEdgeIdx = -1,
}: ConnectionEdgesProps) {
  if (count <= 1) return null;

  const NODE_HEIGHT = 64;
  const GAP = 8;
  const totalHeight = (count - 1) * (NODE_HEIGHT + GAP);

  return (
    <svg
      className="absolute left-7 top-0 w-2 pointer-events-none"
      style={{ height: totalHeight }}
      viewBox={`0 0 8 ${totalHeight}`}
      preserveAspectRatio="none"
    >
      {Array.from({ length: count - 1 }, (_, i) => {
        const y1 = i * (NODE_HEIGHT + GAP) + NODE_HEIGHT;
        const y2 = (i + 1) * (NODE_HEIGHT + GAP);
        const nodeId = placedNodeIds[i];
        const status = nodeId ? nodeStatuses.get(nodeId) : null;

        let strokeColor = "#1E2D47";
        if (isSimulating && status) {
          strokeColor = STATUS_COLORS[status.status] ?? "#1E2D47";
        }

        const showDot = isSimulating && i <= activeEdgeIdx && status;
        const dotColor = status ? (STATUS_COLORS[status.status] ?? "#1E2D47") : "#1E2D47";
        const isFail = status?.status === "fail";

        return (
          <g key={i}>
            <motion.line
              x1={4}
              y1={y1}
              x2={4}
              y2={y2}
              stroke={strokeColor}
              strokeWidth={2}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            />

            {/* Animated data-flow dot */}
            <AnimatePresence>
              {showDot && (
                <motion.circle
                  r={3}
                  cx={4}
                  fill={dotColor}
                  initial={{ cy: y1, opacity: 1, scale: 1 }}
                  animate={
                    isFail
                      ? { cy: (y1 + y2) / 2, opacity: 0, scale: 0 }
                      : { cy: y2, opacity: [1, 1, 0], scale: [1, 1.4, 0] }
                  }
                  exit={{ opacity: 0 }}
                  transition={{ duration: isFail ? 0.5 : 0.6, ease: "easeInOut" }}
                >
                  {/* Glow filter applied via fill opacity */}
                </motion.circle>
              )}
            </AnimatePresence>
          </g>
        );
      })}
    </svg>
  );
}
