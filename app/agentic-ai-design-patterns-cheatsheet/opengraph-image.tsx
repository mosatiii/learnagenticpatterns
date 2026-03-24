import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "21 Agentic AI Design Patterns Cheat Sheet — Free PDF for Senior Engineers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
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
          justifyContent: "center",
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

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "8px 20px",
              border: "2px solid #FF6B3580",
              borderRadius: 8,
              color: "#FF6B35",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            FREE PDF
          </div>
          <span style={{ color: "#8B95A5", fontSize: 20 }}>
            learnagenticpatterns.com
          </span>
        </div>

        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: "#E8ECF4",
              lineHeight: 1.1,
            }}
          >
            21 Agentic AI Design
          </span>
          <span
            style={{
              fontSize: 52,
              fontWeight: 800,
              background: "linear-gradient(90deg, #00D4FF, #FF6B35)",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: 1.1,
            }}
          >
            Patterns Cheat Sheet
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 22,
            color: "#8B95A5",
            lineHeight: 1.5,
          }}
        >
          Every pattern mapped to a classical SWE concept you already know.
        </div>

        {/* Pattern examples */}
        <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
          {[
            "Reflection → TDD",
            "Chaining → Pipe & Filter",
            "Multi-Agent → Microservices",
          ].map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                padding: "8px 20px",
                border: "1px solid #00D4FF4D",
                borderRadius: 20,
                color: "#00D4FF",
                fontSize: 17,
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
            marginTop: 36,
            fontSize: 17,
            color: "#8B95A5",
          }}
        >
          <span>By</span>
          <span style={{ color: "#E8ECF4", fontWeight: 600 }}>
            Mousa Al-Jawaheri
          </span>
          <span style={{ color: "#00D4FF" }}>·</span>
          <span>No email gate. Direct download.</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
