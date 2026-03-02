"use client";

import { motion } from "framer-motion";
import type { SimulationEvent } from "@/data/games";

interface ConnectionEdgesProps {
  count: number;
  nodeStatuses: Map<string, SimulationEvent>;
  placedNodeIds: string[];
  isSimulating: boolean;
}

export default function ConnectionEdges({
  count,
  nodeStatuses,
  placedNodeIds,
  isSimulating,
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

        let strokeColor = "#1E2D47"; // border color default
        if (isSimulating && status) {
          strokeColor =
            status.status === "pass" ? "#00FF88" :
            status.status === "fail" ? "#FF3232" :
            "#FFD700";
        }

        return (
          <motion.line
            key={i}
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
        );
      })}
    </svg>
  );
}
