import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
