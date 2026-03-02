"use client";

import { Bot, ShieldCheck, Database, HelpCircle } from "lucide-react";
import type { BlockDefinition, BlockCategory } from "@/data/games";

const CATEGORY_STYLES: Record<BlockCategory, { border: string; bg: string; text: string; icon: typeof Bot }> = {
  agent:      { border: "border-primary/40", bg: "bg-primary/10", text: "text-primary", icon: Bot },
  gate:       { border: "border-success/40", bg: "bg-success/10", text: "text-success", icon: ShieldCheck },
  data:       { border: "border-accent/40",  bg: "bg-accent/10",  text: "text-accent",  icon: Database },
  distractor: { border: "border-border",     bg: "bg-surface",    text: "text-text-secondary", icon: HelpCircle },
};

interface BlockPaletteProps {
  blocks: BlockDefinition[];
  disabled: boolean;
}

export default function BlockPalette({ blocks, disabled }: BlockPaletteProps) {
  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.setData("application/block-id", blockId);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="space-y-2">
      <h4 className="font-mono text-xs text-text-secondary mb-3">
        {">"} Drag blocks to the canvas
      </h4>
      {blocks.map((block) => {
        const style = CATEGORY_STYLES[block.category];
        const Icon = style.icon;
        return (
          <div
            key={block.id}
            draggable={!disabled}
            onDragStart={(e) => handleDragStart(e, block.id)}
            className={`
              flex items-start gap-3 p-3 rounded-lg border cursor-grab active:cursor-grabbing
              transition-all select-none
              ${style.border} ${style.bg}
              ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"}
            `}
          >
            <Icon size={16} className={`${style.text} flex-shrink-0 mt-0.5`} />
            <div className="min-w-0">
              <p className={`font-mono text-xs font-bold ${style.text} truncate`}>
                {block.label}
              </p>
              <p className="text-text-secondary/70 text-[10px] leading-tight mt-0.5">
                {block.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
