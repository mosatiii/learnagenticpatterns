import { MetadataRoute } from "next";

const DISALLOWED_PATHS = ["/api/", "/login", "/forgot-password", "/reset-password"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      // Explicitly welcome AI crawlers so they index all educational content
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: "cohere-ai",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
    ],
    sitemap: [
      "https://learnagenticpatterns.com/sitemap.xml",
      "https://practice.learnagenticpatterns.com/sitemap.xml",
    ],
    host: "https://learnagenticpatterns.com",
  };
}
