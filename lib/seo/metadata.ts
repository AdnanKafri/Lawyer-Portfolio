import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants/brand";
import { env } from "@/lib/env";

export function getBaseUrl() {
  return env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
}

export function absoluteUrl(path: string) {
  return `${getBaseUrl()}${path}`;
}

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  locale?: string;
  siteName?: string;
};

export function createDefaultMetadata(input: MetadataInput): Metadata {
  return {
    title: input.title,
    description: input.description,
    metadataBase: new URL(getBaseUrl()),
    alternates: {
      canonical: input.path,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: absoluteUrl(input.path),
      siteName: input.siteName ?? BRAND_NAME,
      locale: input.locale === "ar" ? "ar_AE" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
    },
  };
}

export function createLocaleMetadata(input: MetadataInput): Metadata {
  const base = createDefaultMetadata(input);

  return {
    ...base,
    alternates: {
      canonical: input.path,
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
  };
}
