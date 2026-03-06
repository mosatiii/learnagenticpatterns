"use client";

const SKILL_CATEGORIES: { label: string; patterns: string[] }[] = [
  { label: "Orchestration", patterns: ["prompt-chaining", "routing", "planning"] },
  { label: "Analysis", patterns: ["parallelization", "reflection"] },
  { label: "Tools", patterns: ["tool-use", "state-management-mcp"] },
  { label: "Multi-Agent", patterns: ["multi-agent-collaboration", "inter-agent-communication"] },
  { label: "Memory", patterns: ["memory-management", "knowledge-retrieval-rag"] },
  { label: "Resilience", patterns: ["exception-handling-recovery", "guardrails-safety", "human-in-the-loop"] },
];

interface ScoreEntry {
  pattern_slug: string;
  score_total: number;
  score_max: number;
}

interface SkillRadarProps {
  scores: ScoreEntry[];
}

export default function SkillRadar({ scores }: SkillRadarProps) {
  const size = 260;
  const center = size / 2;
  const maxRadius = 100;
  const levels = 4;
  const categories = SKILL_CATEGORIES;
  const angleStep = (Math.PI * 2) / categories.length;

  const getScoreForCategory = (patterns: string[]): number => {
    const matching = scores.filter((s) => patterns.includes(s.pattern_slug));
    if (matching.length === 0) return 0;
    const avg = matching.reduce((sum, s) => sum + (s.score_max > 0 ? (s.score_total / s.score_max) * 100 : 0), 0) / matching.length;
    return avg;
  };

  const values = categories.map((cat) => getScoreForCategory(cat.patterns));

  const getPoint = (angle: number, radius: number) => ({
    x: center + Math.cos(angle - Math.PI / 2) * radius,
    y: center + Math.sin(angle - Math.PI / 2) * radius,
  });

  const polygonPoints = values
    .map((val, i) => {
      const r = (val / 100) * maxRadius;
      const p = getPoint(i * angleStep, r);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  const hasData = values.some((v) => v > 0);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background grid rings */}
        {Array.from({ length: levels }, (_, i) => {
          const r = ((i + 1) / levels) * maxRadius;
          const points = categories
            .map((_, j) => {
              const p = getPoint(j * angleStep, r);
              return `${p.x},${p.y}`;
            })
            .join(" ");
          return (
            <polygon
              key={`ring-${i}`}
              points={points}
              fill="none"
              stroke="#1E293B"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis lines */}
        {categories.map((_, i) => {
          const p = getPoint(i * angleStep, maxRadius);
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke="#1E293B"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        {hasData && (
          <polygon
            points={polygonPoints}
            fill="rgba(0, 212, 255, 0.15)"
            stroke="#00D4FF"
            strokeWidth="2"
          />
        )}

        {/* Data points */}
        {hasData &&
          values.map((val, i) => {
            const r = (val / 100) * maxRadius;
            const p = getPoint(i * angleStep, r);
            return (
              <circle
                key={`point-${i}`}
                cx={p.x}
                cy={p.y}
                r={3}
                fill="#00D4FF"
              />
            );
          })}

        {/* Labels */}
        {categories.map((cat, i) => {
          const labelRadius = maxRadius + 20;
          const p = getPoint(i * angleStep, labelRadius);
          return (
            <text
              key={`label-${i}`}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-text-secondary font-mono"
              fontSize="9"
            >
              {cat.label}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      {hasData && (
        <div className="flex flex-wrap gap-3 mt-4 justify-center">
          {categories.map((cat, i) => (
            <div key={cat.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="font-mono text-[10px] text-text-secondary">
                {cat.label}: {Math.round(values[i])}%
              </span>
            </div>
          ))}
        </div>
      )}

      {!hasData && (
        <p className="text-text-secondary/40 font-mono text-xs mt-4">
          Complete challenges to see your skill breakdown
        </p>
      )}
    </div>
  );
}
