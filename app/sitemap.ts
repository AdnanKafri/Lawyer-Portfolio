import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/seo/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicRoutes = locales.map((locale) => ({
    url: absoluteUrl(`/${locale}`),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1,
  }));

  return [
    ...publicRoutes,
    {
      url: absoluteUrl("/en/legal/privacy"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/en/legal/terms"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/ar/legal/privacy"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: absoluteUrl("/ar/legal/terms"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];
}
