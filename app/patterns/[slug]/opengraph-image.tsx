import { ImageResponse } from "next/og";
import { getPatternBySlug, patterns } from "@/data/patterns";

export const runtime = "edge";
export const alt = "Learn Agentic Patterns";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateImageMetadata() {
  return patterns.map((p) => ({
    id: p.slug,
    alt: `${p.name} → ${p.sweParallel} | Learn Agentic Patterns`,
    size,
    contentType,
  }));
}

export default async function OgImage({
  params,
}: {
  params: { slug: string };
}) {
  const pattern = getPatternBySlug(params.slug);

  if (!pattern) {
    return new ImageResponse(
      (
        <div
          style={{
            background: "#0A0E1A",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "monospace",
            color: "#E8ECF4",
            fontSize: 48,
          }}
        >
          Pattern Not Found
        </div>
      ),
      { ...size }
    );
  }

  const patternNumber = String(pattern.number).padStart(2, "0");

  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(135deg, #0A0E1A 0%, #131829 50%, #0A0E1A 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          fontFamily: "monospace",
          position: "relative",
        }}
      >

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 80,
            right: 80,
            height: 3,
            background:
              "linear-gradient(90deg, transparent, #00D4FF, #FF6B35, transparent)",
            display: "flex",
          }}
        />

        {/* Top section */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Pattern number badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 20px",
                border: "2px solid #00D4FF66",
                borderRadius: 8,
                color: "#00D4FF",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              Pattern {patternNumber}
            </div>
            <span style={{ color: "#8B95A5", fontSize: 20 }}>
              learnagenticpatterns.com
            </span>
          </div>

          {/* Pattern name */}
          <div
            style={{
              display: "flex",
              fontSize: 52,
              fontWeight: 800,
              color: "#E8ECF4",
              lineHeight: 1.15,
              maxWidth: "90%",
            }}
          >
            {pattern.name}
          </div>

          {/* SWE mapping */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{ color: "#00D4FF", fontSize: 28, fontWeight: 700 }}
            >
              ~
            </span>
            <span style={{ color: "#8B95A5", fontSize: 28 }}>
              {pattern.sweParallelFull}
            </span>
          </div>
        </div>

        {/* Bottom section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Tags */}
          <div style={{ display: "flex", gap: 12 }}>
            {["Agentic AI", "Design Pattern", "Free"].map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  padding: "6px 16px",
                  border: "1px solid #00D4FF4D",
                  borderRadius: 16,
                  color: "#00D4FF",
                  fontSize: 16,
                }}
              >
                {tag}
              </div>
            ))}
          </div>

          {/* Author */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 16,
              color: "#8B95A5",
            }}
          >
            <span>By</span>
            <span style={{ color: "#E8ECF4", fontWeight: 600 }}>
              Mousa Al-Jawaheri
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
