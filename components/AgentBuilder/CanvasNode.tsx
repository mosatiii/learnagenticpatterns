"use client";

import { motion } from "framer-motion";
import { X, Bot, ShieldCheck, Database, HelpCircle, GripVertical } from "lucide-react";
import type { BlockDefinition, BlockCategory, SimulationEvent } from "@/data/games";

const CATEGORY_STYLES: Record<BlockCategory, { border: string; bg: string; text: string; icon: typeof Bot }> = {
  agent:      { border: "border-primary/30", bg: "bg-primary/5", text: "text-primary", icon: Bot },
  gate:       { border: "border-success/30", bg: "bg-success/5", text: "text-success", icon: ShieldCheck },
  data:       { border: "border-accent/30",  bg: "bg-accent/5",  text: "text-accent",  icon: Database },
  distractor: { border: "border-border",     bg: "bg-surface",   text: "text-text-secondary", icon: HelpCircle },
};

const STATUS_STYLES: Record<string, string> = {
  pass: "ring-2 ring-success/60 shadow-[0_0_12px_rgba(0,255,136,0.3)]",
  fail: "ring-2 ring-red-500/60 shadow-[0_0_12px_rgba(255,50,50,0.3)]",
  warn: "ring-2 ring-yellow-500/60 shadow-[0_0_12px_rgba(255,200,50,0.3)]",
};

interface CanvasNodeProps {
  block: BlockDefinition;
  instanceId: string;
  index: number;
  status: SimulationEvent | null;
  isSimulating: boolean;
  onRemove: (instanceId: string) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetIndex: number) => void;
}

export default function CanvasNode({
  block,
  instanceId,
  index,
  status,
  isSimulating,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
}: CanvasNodeProps) {
  const style = CATEGORY_STYLES[block.category];
  const Icon = style.icon;
  const statusStyle = status ? STATUS_STYLES[status.status] : "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      draggable={!isSimulating}
      onDragStart={(e) => onDragStart(e as unknown as React.DragEvent, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e as unknown as React.DragEvent, index)}
      className={`
        relative flex items-center gap-3 p-3 rounded-lg border transition-all
        ${style.border} ${style.bg} ${statusStyle}
        ${!isSimulating ? "cursor-grab active:cursor-grabbing" : ""}
      `}
    >
      {!isSimulating && (
        <GripVertical size={14} className="text-text-secondary/40 flex-shrink-0" />
      )}
      <Icon size={16} className={`${style.text} flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <p className={`font-mono text-xs font-bold ${style.text} truncate`}>
          {block.label}
        </p>
        {status && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-[10px] leading-tight mt-1 ${
              status.status === "pass"
                ? "text-success/80"
                : status.status === "fail"
                ? "text-red-400/80"
                : "text-yellow-400/80"
            }`}
          >
            {status.message}
          </motion.p>
        )}
      </div>
      {!isSimulating && (
        <button
          onClick={() => onRemove(instanceId)}
          className="text-text-secondary/40 hover:text-red-400 transition-colors flex-shrink-0"
          aria-label="Remove block"
        >
          <X size={14} />
        </button>
      )}

      {/* Animated pulse during simulation */}
      {status && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 0] }}
          transition={{ duration: 0.6 }}
          className={`absolute -right-1 -top-1 w-3 h-3 rounded-full ${
            status.status === "pass"
              ? "bg-success"
              : status.status === "fail"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        />
      )}
    </motion.div>
  );
}
