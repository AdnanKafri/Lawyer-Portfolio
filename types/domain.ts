export type LocalizedContent<T> = Record<"en" | "ar", T>;

export type SectionVisibility = {
  sectionKey: string;
  isActive: boolean;
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  trustPoints: string[];
  previewPanels: { title: string; description: string }[];
  heroAssetId?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  slug?: string;
  iconKey?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

export type CredentialItem = {
  id: string;
  title: string;
  description: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type AboutContent = {
  eyebrow: string;
  title: string;
  summary: string;
  highlights: { label: string; value: string }[];
  credentials: CredentialItem[];
  yearsExperience?: number | null;
  languages?: string[];
  certificationsSummary?: string | null;
  profileAssetId?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
};

export type StatisticItem = {
  id: string;
  label: string;
  value: string;
  description: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type TestimonialItem = {
  id: string;
  quote: string;
  author: string;
  role: string;
  rating?: number | null;
  sortOrder?: number;
  isActive?: boolean;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type ContactInfo = {
  eyebrow: string;
  title: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapEmbedUrl?: string | null;
  responseTimeLabel?: string | null;
};

export type SeoPageSettings = {
  locale: "en" | "ar";
  pageKey: string;
  title: string;
  description: string;
  ogTitle?: string | null;
  ogDescription?: string | null;
  canonicalPath?: string | null;
  ogImageAssetId?: string | null;
};

export type SiteSettings = {
  siteName: string;
  tagline?: string | null;
  primaryPhone?: string | null;
  primaryEmail?: string | null;
  officeAddress?: string | null;
  logoAssetId?: string | null;
  faviconAssetId?: string | null;
  logoUrl?: string | null;
};

export type SocialLink = {
  id: string;
  platform: string;
  label: string;
  url: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type MediaOption = {
  id: string;
  label: string;
  url: string;
  altText?: string | null;
  locale?: "en" | "ar" | null;
};

export type LeadSubmissionCreate = {
  locale: "en" | "ar";
  fullName: string;
  email: string;
  phone: string;
  message: string;
};
