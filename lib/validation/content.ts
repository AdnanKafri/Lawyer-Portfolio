import { z } from "zod";

export const localeSchema = z.enum(["en", "ar"]);

const optionalTrimmed = z
  .string()
  .optional()
  .transform((value) => {
    const normalized = value?.trim() ?? "";
    return normalized.length > 0 ? normalized : undefined;
  });

const optionalNumber = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  return value;
}, z.number().int().nonnegative().optional());

export const localizedTextSchema = z.object({
  locale: localeSchema,
  value: z.string().min(1),
});

export const heroContentSchema = z.object({
  locale: localeSchema,
  eyebrow: z.string().min(1).max(120),
  title: z.string().min(10).max(180),
  description: z.string().min(20).max(400),
  primaryCta: z.string().min(1).max(80),
  secondaryCta: z.string().min(1).max(80),
  trustPoints: z.array(z.string().min(1).max(60)).min(1).max(4).default([]),
  heroAssetId: optionalTrimmed,
});

export const serviceItemSchema = z.object({
  id: optionalTrimmed,
  locale: localeSchema,
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(240),
  slug: optionalTrimmed,
  iconKey: optionalTrimmed,
  isActive: z.boolean().default(true),
});

export const aboutContentSchema = z.object({
  locale: localeSchema,
  eyebrow: z.string().min(1).max(120),
  title: z.string().min(10).max(180),
  summary: z.string().min(20).max(700),
  yearsExperience: optionalNumber,
  languages: z.array(z.string().min(1).max(60)).default([]),
  certificationsSummary: optionalTrimmed,
  profileAssetId: optionalTrimmed,
});

export const credentialSchema = z.object({
  id: optionalTrimmed,
  locale: localeSchema,
  title: z.string().min(2).max(120),
  description: z.string().min(10).max(220),
  isActive: z.boolean().default(true),
});

export const statisticSchema = z.object({
  id: optionalTrimmed,
  locale: localeSchema,
  label: z.string().min(1).max(120),
  value: z.string().min(1).max(40),
  description: z.string().min(10).max(180),
  isActive: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  id: optionalTrimmed,
  locale: localeSchema,
  quote: z.string().min(10).max(500),
  author: z.string().min(2).max(120),
  role: z.string().min(2).max(120),
  rating: optionalNumber,
  isActive: z.boolean().default(true),
});

export const faqSchema = z.object({
  id: optionalTrimmed,
  locale: localeSchema,
  question: z.string().min(8).max(180),
  answer: z.string().min(10).max(500),
  isActive: z.boolean().default(true),
});

export const contactInfoSchema = z.object({
  locale: localeSchema,
  eyebrow: z.string().min(1).max(120),
  title: z.string().min(2).max(180),
  description: z.string().min(10).max(400),
  phone: z.string().min(5).max(32),
  whatsapp: z.string().min(5).max(32),
  email: z.string().email(),
  address: z.string().min(8).max(240),
  mapEmbedUrl: optionalTrimmed,
  responseTimeLabel: optionalTrimmed,
});

export const socialLinkSchema = z.object({
  id: optionalTrimmed,
  platform: z.string().min(2).max(40),
  label: z.string().min(2).max(80),
  url: z.string().url(),
  isActive: z.boolean().default(true),
});

export const seoSettingsSchema = z.object({
  locale: localeSchema,
  pageKey: z.string().min(1).max(80),
  metaTitle: z.string().min(10).max(180),
  metaDescription: z.string().min(20).max(320),
  ogTitle: optionalTrimmed,
  ogDescription: optionalTrimmed,
  canonicalPath: optionalTrimmed,
  ogImageAssetId: optionalTrimmed,
});

export const siteSettingsSchema = z.object({
  siteName: z.string().min(2).max(120),
  tagline: optionalTrimmed,
  primaryPhone: optionalTrimmed,
  primaryEmail: z.union([z.string().email(), z.literal(""), z.undefined()]).transform(
    (value) => (value ? value : undefined),
  ),
  officeAddress: optionalTrimmed,
  logoAssetId: optionalTrimmed,
  faviconAssetId: optionalTrimmed,
});

export const mediaAssetSchema = z.object({
  locale: localeSchema.optional(),
  altText: z.string().max(180).optional(),
});

export const leadSubmissionSchema = z.object({
  locale: localeSchema,
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(5).max(32),
  message: z.string().min(10).max(1200),
});
