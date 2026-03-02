"use client";

export default function AnimatedGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Blueprint dotted grid at 3% opacity */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(0, 212, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Subtle horizontal lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(30, 45, 71, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30, 45, 71, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}
