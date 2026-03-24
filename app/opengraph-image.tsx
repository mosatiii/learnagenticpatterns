import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Learn Agentic Patterns: 21 Design Patterns for Senior Developers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0A0E1A 0%, #131829 50%, #0A0E1A 100%)",
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
        {/* Grid overlay — split into two divs because Satori can't parse multiple gradients in one backgroundImage */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(#00D4FF0D 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(90deg, #00D4FF0D 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            display: "flex",
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 80,
            right: 80,
            height: 3,
            background: "linear-gradient(90deg, transparent, #00D4FF, #FF6B35, transparent)",
            display: "flex",
          }}
        />

        {/* Terminal prompt */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <span style={{ color: "#00D4FF", fontSize: 28, fontWeight: 700 }}>$</span>
          <span style={{ color: "#8B95A5", fontSize: 22 }}>learnagenticpatterns.com</span>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "#E8ECF4",
              lineHeight: 1.1,
            }}
          >
            Learn Agentic
          </span>
          <span
            style={{
              fontSize: 56,
              fontWeight: 800,
              background: "linear-gradient(90deg, #00D4FF, #FF6B35)",
              backgroundClip: "text",
              color: "transparent",
              lineHeight: 1.1,
            }}
          >
            Design Patterns
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 24,
            color: "#8B95A5",
            lineHeight: 1.5,
          }}
        >
          21 Agentic AI patterns mapped to Software Engineering concepts you already know.
        </div>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 36,
          }}
        >
          {["Free Curriculum", "Senior Developers", "Production-Ready"].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  padding: "8px 20px",
                  border: "1px solid #00D4FF4D",
                  borderRadius: 20,
                  color: "#00D4FF",
                  fontSize: 18,
                }}
              >
                {tag}
              </div>
            )
          )}
        </div>

        {/* Author */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 40,
            fontSize: 18,
            color: "#8B95A5",
          }}
        >
          <span>By</span>
          <span style={{ color: "#E8ECF4", fontWeight: 600 }}>Mousa Al-Jawaheri</span>
          <span style={{ color: "#00D4FF" }}>·</span>
          <span>University of Waterloo MBET</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
