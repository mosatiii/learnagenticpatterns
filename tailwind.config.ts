import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0E1A",
        surface: "#0F1629",
        primary: "#00D4FF",
        accent: "#FF6B35",
        "text-primary": "#E8EDF8",
        "text-secondary": "#8B9BB4",
        border: "#1E2D47",
        success: "#00FF88",
        "code-bg": "#060A14",
      },
      fontFamily: {
        mono: ["Space Mono", "Fira Code", "monospace"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
        code: ["Fira Code", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "slide-in": "slideIn 0.5s ease-out forwards",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(0, 212, 255, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(0, 212, 255, 0.4)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
