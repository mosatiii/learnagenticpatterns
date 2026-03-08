import { MetadataRoute } from "next";
import { patterns } from "@/data/patterns";
import { pmModules } from "@/data/pm-curriculum";
import { getAllBlogPosts } from "@/data/blog";

const LAST_CONTENT_UPDATE = new Date("2026-03-05");

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://learnagenticpatterns.com";
  const practiceUrl = "https://practice.learnagenticpatterns.com";

  const patternPages = patterns.map((p) => ({
    url: `${baseUrl}/patterns/${p.slug}`,
    lastModified: LAST_CONTENT_UPDATE,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const pmPages = pmModules.map((m) => ({
    url: `${baseUrl}/pm/${m.slug}`,
    lastModified: LAST_CONTENT_UPDATE,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const blogPages = getAllBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const practicePages: MetadataRoute.Sitemap = [
    {
      url: practiceUrl,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    {
      url: `${practiceUrl}/leaderboard`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    ...patterns.map((p) => ({
      url: `${practiceUrl}/patterns/${p.slug}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...pmModules.map((m) => ({
      url: `${practiceUrl}/pm/${m.slug}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];

  return [
    {
      url: baseUrl,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/agentic-ai-design-patterns-cheatsheet`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guide/from-software-engineer-to-agentic-architect`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/assessment`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...patternPages,
    ...pmPages,
    ...blogPages,
    ...practicePages,
  ];
}
