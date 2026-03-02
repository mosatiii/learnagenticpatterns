import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Learn Agentic Patterns",
    short_name: "AgenticPatterns",
    description:
      "A free curriculum mapping 21 Agentic AI Design Patterns to Software Engineering concepts you already know.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0E1A",
    theme_color: "#00D4FF",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
