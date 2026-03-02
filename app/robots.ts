import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/login", "/forgot-password", "/reset-password"],
      },
    ],
    sitemap: "https://learnagenticpatterns.com/sitemap.xml",
    host: "https://learnagenticpatterns.com",
  };
}
