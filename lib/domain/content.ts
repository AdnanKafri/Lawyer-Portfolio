import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import {
  getDefaultSiteSettings,
  getDefaultSocialLinks,
  getPublicSiteScaffold,
} from "@/lib/domain/public-site";
import { getActiveOrganization } from "@/lib/domain/organization";
import type { Locale } from "@/lib/i18n/config";
import type {
  AboutContent,
  ContactInfo,
  FaqItem,
  HeroContent,
  MediaOption,
  SeoPageSettings,
  ServiceItem,
  SiteSettings,
  SocialLink,
  StatisticItem,
  TestimonialItem,
} from "@/types/domain";
import type { Database, Json } from "@/types/supabase";

type ContentClient = SupabaseClient<Database>;

export type LocalizedCollectionEntity =
  | "services"
  | "credentials"
  | "statistics"
  | "testimonials"
  | "faqs";

export type GlobalCollectionEntity = "social_links";
export type CollectionEntity = LocalizedCollectionEntity | GlobalCollectionEntity;

type CollectionRowsMap = {
  services: Database["public"]["Tables"]["services"]["Row"][];
  credentials: Database["public"]["Tables"]["credentials"]["Row"][];
  statistics: Database["public"]["Tables"]["statistics"]["Row"][];
  testimonials: Database["public"]["Tables"]["testimonials"]["Row"][];
  faqs: Database["public"]["Tables"]["faqs"]["Row"][];
  social_links: Database["public"]["Tables"]["social_links"]["Row"][];
};

type PublicSiteContent = {
  hero: HeroContent;
  services: ServiceItem[];
  about: AboutContent;
  statistics: StatisticItem[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  contact: ContactInfo;
};

type MediaRow = Database["public"]["Tables"]["media_assets"]["Row"];

function parseStringArray(input: Json): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.filter((item): item is string => typeof item === "string");
}

function getPublicMediaUrl(
  supabase: ContentClient,
  asset: Pick<MediaRow, "bucket" | "path"> | null | undefined,
) {
  if (!asset) {
    return null;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(asset.bucket).getPublicUrl(asset.path);

  return publicUrl;
}

async function getMediaLookup(
  supabase: ContentClient,
  assetIds: Array<string | null | undefined>,
) {
  const uniqueIds = [...new Set(assetIds.filter(Boolean))] as string[];

  if (uniqueIds.length === 0) {
    return new Map<string, MediaRow>();
  }

  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .in("id", uniqueIds);

  if (error || !data) {
    return new Map<string, MediaRow>();
  }

  return new Map(data.map((asset) => [asset.id, asset]));
}

function mapHero(
  supabase: ContentClient,
  row: Database["public"]["Tables"]["hero_sections"]["Row"] | null,
  assets: Map<string, MediaRow>,
  fallback: HeroContent,
): HeroContent {
  if (!row) {
    return fallback;
  }

  const asset = row.hero_asset_id ? assets.get(row.hero_asset_id) : null;
  const description =
    /starter hero content|dashboard-driven|platform is connected/i.test(
      row.description,
    )
      ? fallback.description
      : row.description;

  return {
    eyebrow: row.eyebrow,
    title: row.title,
    description,
    primaryCta: row.primary_cta_label,
    secondaryCta: row.secondary_cta_label,
    trustPoints: parseStringArray(row.trust_points),
    previewPanels: fallback.previewPanels,
    heroAssetId: row.hero_asset_id,
    imageUrl: getPublicMediaUrl(supabase, asset),
    imageAlt: asset?.alt_text ?? asset?.file_name ?? null,
  };
}

function mapAbout(
  supabase: ContentClient,
  row: Database["public"]["Tables"]["about_sections"]["Row"] | null,
  credentials: Database["public"]["Tables"]["credentials"]["Row"][],
  locale: Locale,
  assets: Map<string, MediaRow>,
  fallback: AboutContent,
): AboutContent {
  if (!row) {
    return fallback;
  }

  const asset = row.profile_asset_id ? assets.get(row.profile_asset_id) : null;

  return {
    eyebrow: row.eyebrow,
    title: row.title,
    summary: row.summary,
    yearsExperience: row.years_experience,
    languages: row.languages,
    certificationsSummary: row.certifications_summary,
    profileAssetId: row.profile_asset_id,
    imageUrl: getPublicMediaUrl(supabase, asset),
    imageAlt: asset?.alt_text ?? asset?.file_name ?? null,
    highlights: [
      {
        label: locale === "ar" ? "الخبرة" : "Experience",
        value:
          row.years_experience !== null
            ? `${row.years_experience}+`
            : fallback.highlights[0]?.value ?? "",
      },
      {
        label: locale === "ar" ? "اللغات" : "Languages",
        value:
          row.languages.length > 0
            ? row.languages.join(", ")
            : fallback.highlights[1]?.value ?? "",
      },
      {
        label: locale === "ar" ? "الاعتمادات" : "Credentials",
        value:
          row.certifications_summary ??
          fallback.highlights[2]?.value ??
          "",
      },
    ],
    credentials:
      credentials.length > 0
        ? credentials.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            sortOrder: item.sort_order,
            isActive: item.is_active,
          }))
        : fallback.credentials,
  };
}

function mapContact(
  row: Database["public"]["Tables"]["contact_info"]["Row"] | null,
  fallback: ContactInfo,
): ContactInfo {
  if (!row) {
    return fallback;
  }

  return {
    eyebrow: row.eyebrow ?? fallback.eyebrow,
    title: row.title ?? fallback.title,
    description: row.description ?? fallback.description,
    phone: row.phone ?? fallback.phone,
    whatsapp: row.whatsapp ?? fallback.whatsapp,
    email: row.email ?? fallback.email,
    address: row.address ?? fallback.address,
    mapEmbedUrl: row.map_embed_url,
    responseTimeLabel: row.response_time_label,
  };
}

function mapSiteSettings(
  supabase: ContentClient,
  row: Database["public"]["Tables"]["site_settings"]["Row"] | null,
  assets: Map<string, MediaRow>,
): SiteSettings {
  const fallback = getDefaultSiteSettings();

  if (!row) {
    return fallback;
  }

  const logo = row.logo_asset_id ? assets.get(row.logo_asset_id) : null;

  return {
    siteName: row.site_name,
    tagline: row.tagline,
    primaryPhone: row.primary_phone,
    primaryEmail: row.primary_email,
    officeAddress: row.office_address,
    logoAssetId: row.logo_asset_id,
    faviconAssetId: row.favicon_asset_id,
    logoUrl: getPublicMediaUrl(supabase, logo),
  };
}

function mapSocialLinks(
  rows: Database["public"]["Tables"]["social_links"]["Row"][] | null,
): SocialLink[] {
  if (!rows || rows.length === 0) {
    return getDefaultSocialLinks();
  }

  return rows.map((row) => ({
    id: row.id,
    platform: row.platform,
    label: row.label ?? row.platform,
    url: row.url,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  }));
}

export function mapServiceRows(
  rows: Database["public"]["Tables"]["services"]["Row"][] | null,
): ServiceItem[] {
  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    slug: item.slug,
    iconKey: item.icon_key,
    sortOrder: item.sort_order,
    isActive: item.is_active,
  }));
}

export function mapCredentialRows(
  rows: Database["public"]["Tables"]["credentials"]["Row"][] | null,
): AboutContent["credentials"] {
  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    sortOrder: item.sort_order,
    isActive: item.is_active,
  }));
}

export function mapStatisticRows(
  rows: Database["public"]["Tables"]["statistics"]["Row"][] | null,
): StatisticItem[] {
  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map((item) => ({
    id: item.id,
    label: item.label,
    value: item.value,
    description: item.description ?? "",
    sortOrder: item.sort_order,
    isActive: item.is_active,
  }));
}

export function mapTestimonialRows(
  rows: Database["public"]["Tables"]["testimonials"]["Row"][] | null,
): TestimonialItem[] {
  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map((item) => ({
    id: item.id,
    quote: item.quote,
    author: item.author_name,
    role: item.author_role ?? "",
    rating: item.rating,
    sortOrder: item.sort_order,
    isActive: item.is_active,
  }));
}

export function mapFaqRows(
  rows: Database["public"]["Tables"]["faqs"]["Row"][] | null,
): FaqItem[] {
  if (!rows || rows.length === 0) {
    return [];
  }

  return rows.map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
    sortOrder: item.sort_order,
    isActive: item.is_active,
  }));
}

async function getPublicSiteContentFromClient(
  supabase: ContentClient,
  locale: Locale,
): Promise<PublicSiteContent | null> {
  const organization = await getActiveOrganization(supabase);

  if (!organization) {
    return null;
  }

  const fallback = getPublicSiteScaffold(locale);

  const [
    heroResult,
    servicesResult,
    aboutResult,
    credentialsResult,
    statisticsResult,
    testimonialsResult,
    faqsResult,
    contactResult,
  ] = await Promise.all([
    supabase
      .from("hero_sections")
      .select("*")
      .eq("organization_id", organization.id)
      .eq("locale", locale)
      .eq("is_active", true)
      .maybeSingle(),
    supabase
      .from("services")
      .select("*")
      .eq("organization_id", organization.id)
      .eq("locale", locale)
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("about_sections")
      .select("*")
      .eq("organization_id", organization.id)
      .eq("locale", locale)
      .eq("is_active", true)
      .maybeSingle(),
    supabase
      .from("credentials")
      .select("*")
      .eq("organization_id", organization.id)
      .eq("locale", locale)
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("statistics")
      .select("*")
      .eq("organization_id", organization.id)
      .eq("locale", locale)
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("testimonials")
      .select("*")
      .eq("organization_id", organization.id)
      .eq("locale", locale)
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("faqs")
      .select("*")
      .eq("organization_id", organization.id)
      .eq("locale", locale)
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("contact_info")
      .select("*")
      .eq("organization_id", organization.id)
      .eq("locale", locale)
      .eq("is_active", true)
      .maybeSingle(),
  ]);

  const assets = await getMediaLookup(supabase, [
    heroResult.data?.hero_asset_id,
    aboutResult.data?.profile_asset_id,
  ]);

  return {
    hero: mapHero(supabase, heroResult.data ?? null, assets, fallback.hero),
    services:
      servicesResult.data && servicesResult.data.length > 0
        ? servicesResult.data.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            slug: item.slug,
            iconKey: item.icon_key,
            sortOrder: item.sort_order,
            isActive: item.is_active,
          }))
        : fallback.services,
    about: mapAbout(
      supabase,
      aboutResult.data ?? null,
      credentialsResult.data ?? [],
      locale,
      assets,
      fallback.about,
    ),
    statistics:
      statisticsResult.data && statisticsResult.data.length > 0
        ? statisticsResult.data.map((item) => ({
            id: item.id,
            label: item.label,
            value: item.value,
            description: item.description ?? "",
            sortOrder: item.sort_order,
            isActive: item.is_active,
          }))
        : fallback.statistics,
    testimonials:
      testimonialsResult.data && testimonialsResult.data.length > 0
        ? testimonialsResult.data.map((item) => ({
            id: item.id,
            quote: item.quote,
            author: item.author_name,
            role: item.author_role ?? "",
            rating: item.rating,
            sortOrder: item.sort_order,
            isActive: item.is_active,
          }))
        : fallback.testimonials,
    faqs:
      faqsResult.data && faqsResult.data.length > 0
        ? faqsResult.data.map((item) => ({
            id: item.id,
            question: item.question,
            answer: item.answer,
            sortOrder: item.sort_order,
            isActive: item.is_active,
          }))
        : fallback.faqs,
    contact: mapContact(contactResult.data ?? null, fallback.contact),
  };
}

function getServiceClientOrThrow() {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    throw new Error("Supabase service role is not configured.");
  }

  return supabase;
}

type EqBuilder<T> = {
  eq(column: string, value: string): T;
};

function applyEq<T>(builder: T, column: string, value: string) {
  return (builder as unknown as EqBuilder<T>).eq(column, value);
}

function isLocalizedEntity(entity: CollectionEntity): entity is LocalizedCollectionEntity {
  return entity !== "social_links";
}

async function getNextSortOrder(
  supabase: ContentClient,
  entity: CollectionEntity,
  organizationId: string,
  locale?: Locale,
) {
  let query = supabase
    .from(entity)
    .select("sort_order")
    .eq("organization_id", organizationId)
    .order("sort_order", { ascending: false })
    .limit(1);

  if (isLocalizedEntity(entity) && locale) {
    query = applyEq(query, "locale", locale);
  }

  const { data } = await query.maybeSingle();

  return (data?.sort_order ?? -1) + 1;
}

export async function getPublicSiteContent(locale: Locale) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return getPublicSiteScaffold(locale);
  }

  try {
    return (
      (await getPublicSiteContentFromClient(supabase, locale)) ??
      getPublicSiteScaffold(locale)
    );
  } catch {
    return getPublicSiteScaffold(locale);
  }
}

export async function getPublicSiteSettings() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    const fallback = getDefaultSiteSettings();
    return {
      siteSettings: fallback,
      socialLinks: getDefaultSocialLinks(),
    };
  }

  try {
    const organization = await getActiveOrganization(supabase);

    if (!organization) {
      return {
        siteSettings: getDefaultSiteSettings(),
        socialLinks: getDefaultSocialLinks(),
      };
    }

    const [siteSettingsResult, socialLinksResult] = await Promise.all([
      supabase
        .from("site_settings")
        .select("*")
        .eq("organization_id", organization.id)
        .maybeSingle(),
      supabase
        .from("social_links")
        .select("*")
        .eq("organization_id", organization.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
    ]);

    const assets = await getMediaLookup(supabase, [
      siteSettingsResult.data?.logo_asset_id,
    ]);

    return {
      siteSettings: mapSiteSettings(supabase, siteSettingsResult.data ?? null, assets),
      socialLinks: mapSocialLinks(socialLinksResult.data ?? null),
    };
  } catch {
    return {
      siteSettings: getDefaultSiteSettings(),
      socialLinks: getDefaultSocialLinks(),
    };
  }
}

export async function getHeroSectionForLocale(locale: Locale) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return getPublicSiteScaffold(locale).hero;
  }

  const organization = await getActiveOrganization(supabase);

  if (!organization) {
    return getPublicSiteScaffold(locale).hero;
  }

  const { data } = await supabase
    .from("hero_sections")
    .select("*")
    .eq("organization_id", organization.id)
    .eq("locale", locale)
    .maybeSingle();

  const assets = await getMediaLookup(supabase, [data?.hero_asset_id]);

  return mapHero(supabase, data ?? null, assets, getPublicSiteScaffold(locale).hero);
}

export async function getAboutSectionForLocale(locale: Locale) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return getPublicSiteScaffold(locale).about;
  }

  const organization = await getActiveOrganization(supabase);

  if (!organization) {
    return getPublicSiteScaffold(locale).about;
  }

  const [aboutResult, credentialsResult] = await Promise.all([
    supabase
      .from("about_sections")
      .select("*")
      .eq("organization_id", organization.id)
      .eq("locale", locale)
      .maybeSingle(),
    supabase
      .from("credentials")
      .select("*")
      .eq("organization_id", organization.id)
      .eq("locale", locale)
      .order("sort_order", { ascending: true }),
  ]);

  const assets = await getMediaLookup(supabase, [aboutResult.data?.profile_asset_id]);

  return mapAbout(
    supabase,
    aboutResult.data ?? null,
    credentialsResult.data ?? [],
    locale,
    assets,
    getPublicSiteScaffold(locale).about,
  );
}

export async function getContactInfoForLocale(locale: Locale) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return getPublicSiteScaffold(locale).contact;
  }

  const organization = await getActiveOrganization(supabase);

  if (!organization) {
    return getPublicSiteScaffold(locale).contact;
  }

  const { data } = await supabase
    .from("contact_info")
    .select("*")
    .eq("organization_id", organization.id)
    .eq("locale", locale)
    .maybeSingle();

  return mapContact(data ?? null, getPublicSiteScaffold(locale).contact);
}

export async function getSeoSettingsForLocale(
  locale: Locale,
  pageKey = "home",
): Promise<SeoPageSettings> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return {
      locale,
      pageKey,
      title:
        locale === "ar"
          ? "مكتب محاماة واستشارات قانونية"
          : "Premium law firm and legal advisory",
      description:
        locale === "ar"
          ? "مكتب قانوني متخصص في الاستشارات التجارية والعقود والنزاعات."
          : "A premium law firm focused on commercial advisory, contracts, and dispute strategy.",
    };
  }

  const organization = await getActiveOrganization(supabase);

  if (!organization) {
    return {
      locale,
      pageKey,
      title: "Premium law firm and legal advisory",
      description:
        "A premium law firm focused on commercial advisory, contracts, and dispute strategy.",
    };
  }

  const { data } = await supabase
    .from("seo_settings")
    .select("*")
    .eq("organization_id", organization.id)
    .eq("locale", locale)
    .eq("page_key", pageKey)
    .maybeSingle();

  return {
    locale,
    pageKey,
    title: data?.meta_title ?? "Premium law firm and legal advisory",
    description:
      data?.meta_description ??
      "A premium law firm focused on commercial advisory, contracts, and dispute strategy.",
    ogTitle: data?.og_title,
    ogDescription: data?.og_description,
    canonicalPath: data?.canonical_path,
    ogImageAssetId: data?.og_image_asset_id,
  };
}

export async function getSiteSettingsForAdmin() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return getDefaultSiteSettings();
  }

  const organization = await getActiveOrganization(supabase);

  if (!organization) {
    return getDefaultSiteSettings();
  }

  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("organization_id", organization.id)
    .maybeSingle();

  const assets = await getMediaLookup(supabase, [data?.logo_asset_id]);

  return mapSiteSettings(supabase, data ?? null, assets);
}

export async function getSocialLinksForAdmin() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return getDefaultSocialLinks();
  }

  const organization = await getActiveOrganization(supabase);

  if (!organization) {
    return getDefaultSocialLinks();
  }

  const { data } = await supabase
    .from("social_links")
    .select("*")
    .eq("organization_id", organization.id)
    .order("sort_order", { ascending: true });

  return mapSocialLinks(data ?? null);
}

export async function getCollectionItems<E extends CollectionEntity>(
  entity: E,
  locale?: Locale,
): Promise<CollectionRowsMap[E]> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return [] as CollectionRowsMap[E];
  }

  const organization = await getActiveOrganization(supabase);

  if (!organization) {
    return [] as CollectionRowsMap[E];
  }

  let query = applyEq(
    supabase.from(entity).select("*"),
    "organization_id",
    organization.id,
  ).order("sort_order", { ascending: true });

  if (isLocalizedEntity(entity) && locale) {
    query = applyEq(query, "locale", locale);
  }

  const { data, error } = await query;

  if (error || !data) {
    return [] as CollectionRowsMap[E];
  }

  return data as unknown as CollectionRowsMap[E];
}

export async function getMediaOptions(organizationId: string): Promise<MediaOption[]> {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((asset) => ({
    id: asset.id,
    label: asset.alt_text || asset.file_name,
    url: getPublicMediaUrl(supabase, asset) ?? "",
    altText: asset.alt_text,
    locale: asset.locale,
  }));
}

export async function upsertHeroSection(input: {
  organizationId: string;
  locale: Locale;
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  trustPoints: string[];
  heroAssetId?: string;
}) {
  const supabase = getServiceClientOrThrow();

  const { error } = await supabase.from("hero_sections").upsert(
    {
      organization_id: input.organizationId,
      locale: input.locale,
      eyebrow: input.eyebrow,
      title: input.title,
      description: input.description,
      primary_cta_label: input.primaryCta,
      primary_cta_href: "#contact",
      secondary_cta_label: input.secondaryCta,
      secondary_cta_href: "#services",
      trust_points: input.trustPoints,
      hero_asset_id: input.heroAssetId ?? null,
      is_active: true,
    },
    {
      onConflict: "organization_id,locale",
    },
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function upsertAboutSection(input: {
  organizationId: string;
  locale: Locale;
  eyebrow: string;
  title: string;
  summary: string;
  yearsExperience?: number;
  languages: string[];
  certificationsSummary?: string;
  profileAssetId?: string;
}) {
  const supabase = getServiceClientOrThrow();

  const { error } = await supabase.from("about_sections").upsert(
    {
      organization_id: input.organizationId,
      locale: input.locale,
      eyebrow: input.eyebrow,
      title: input.title,
      summary: input.summary,
      years_experience: input.yearsExperience ?? null,
      languages: input.languages,
      certifications_summary: input.certificationsSummary ?? null,
      profile_asset_id: input.profileAssetId ?? null,
      is_active: true,
    },
    {
      onConflict: "organization_id,locale",
    },
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function upsertContactInfo(input: {
  organizationId: string;
  locale: Locale;
  eyebrow: string;
  title: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  mapEmbedUrl?: string;
  responseTimeLabel?: string;
}) {
  const supabase = getServiceClientOrThrow();

  const { error } = await supabase.from("contact_info").upsert(
    {
      organization_id: input.organizationId,
      locale: input.locale,
      eyebrow: input.eyebrow,
      title: input.title,
      description: input.description,
      phone: input.phone,
      whatsapp: input.whatsapp,
      email: input.email,
      address: input.address,
      map_embed_url: input.mapEmbedUrl ?? null,
      response_time_label: input.responseTimeLabel ?? null,
      is_active: true,
    },
    {
      onConflict: "organization_id,locale",
    },
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function upsertSeoSettings(input: {
  organizationId: string;
  locale: Locale;
  pageKey: string;
  metaTitle: string;
  metaDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalPath?: string;
  ogImageAssetId?: string;
}) {
  const supabase = getServiceClientOrThrow();

  const { error } = await supabase.from("seo_settings").upsert(
    {
      organization_id: input.organizationId,
      locale: input.locale,
      page_key: input.pageKey,
      meta_title: input.metaTitle,
      meta_description: input.metaDescription,
      og_title: input.ogTitle ?? null,
      og_description: input.ogDescription ?? null,
      canonical_path: input.canonicalPath ?? null,
      og_image_asset_id: input.ogImageAssetId ?? null,
      is_active: true,
    },
    {
      onConflict: "organization_id,locale,page_key",
    },
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function upsertSiteSettings(input: {
  organizationId: string;
  siteName: string;
  tagline?: string;
  primaryPhone?: string;
  primaryEmail?: string;
  officeAddress?: string;
  logoAssetId?: string;
  faviconAssetId?: string;
}) {
  const supabase = getServiceClientOrThrow();

  const { error } = await supabase.from("site_settings").upsert(
    {
      organization_id: input.organizationId,
      site_name: input.siteName,
      tagline: input.tagline ?? null,
      primary_phone: input.primaryPhone ?? null,
      primary_email: input.primaryEmail ?? null,
      office_address: input.officeAddress ?? null,
      logo_asset_id: input.logoAssetId ?? null,
      favicon_asset_id: input.faviconAssetId ?? null,
    },
    {
      onConflict: "organization_id",
    },
  );

  if (error) {
    throw new Error(error.message);
  }
}

export async function upsertCollectionItem(input: {
  entity: CollectionEntity;
  organizationId: string;
  locale?: Locale;
  id?: string;
  values: Record<string, unknown>;
}) {
  const supabase = getServiceClientOrThrow();
  if (input.entity === "services") {
    if (input.id) {
      const { error } = await supabase
        .from("services")
        .update({
          slug: String(input.values.slug),
          title: String(input.values.title),
          description: String(input.values.description),
          icon_key: (input.values.iconKey as string | undefined) ?? null,
          is_active: Boolean(input.values.isActive ?? true),
        })
        .eq("id", input.id)
        .eq("organization_id", input.organizationId);

      if (error) throw new Error(error.message);
      return;
    }

    const sortOrder = await getNextSortOrder(
      supabase,
      input.entity,
      input.organizationId,
      input.locale ?? "en",
    );
    const { error } = await supabase.from("services").insert({
      organization_id: input.organizationId,
      locale: input.locale ?? "en",
      slug: String(input.values.slug),
      title: String(input.values.title),
      description: String(input.values.description),
      icon_key: (input.values.iconKey as string | undefined) ?? null,
      sort_order: sortOrder,
      is_active: Boolean(input.values.isActive ?? true),
    });

    if (error) throw new Error(error.message);
    return;
  }

  if (input.entity === "credentials") {
    if (input.id) {
      const { error } = await supabase
        .from("credentials")
        .update({
          title: String(input.values.title),
          description: String(input.values.description),
          is_active: Boolean(input.values.isActive ?? true),
        })
        .eq("id", input.id)
        .eq("organization_id", input.organizationId)
        .eq("locale", input.locale ?? "en");

      if (error) throw new Error(error.message);
      return;
    }

    const sortOrder = await getNextSortOrder(
      supabase,
      input.entity,
      input.organizationId,
      input.locale ?? "en",
    );
    const { error } = await supabase.from("credentials").insert({
      organization_id: input.organizationId,
      locale: input.locale ?? "en",
      title: String(input.values.title),
      description: String(input.values.description),
      sort_order: sortOrder,
      is_active: Boolean(input.values.isActive ?? true),
    });

    if (error) throw new Error(error.message);
    return;
  }

  if (input.entity === "statistics") {
    if (input.id) {
      const { error } = await supabase
        .from("statistics")
        .update({
          label: String(input.values.label),
          value: String(input.values.value),
          description: String(input.values.description),
          is_active: Boolean(input.values.isActive ?? true),
        })
        .eq("id", input.id)
        .eq("organization_id", input.organizationId)
        .eq("locale", input.locale ?? "en");

      if (error) throw new Error(error.message);
      return;
    }

    const sortOrder = await getNextSortOrder(
      supabase,
      input.entity,
      input.organizationId,
      input.locale ?? "en",
    );
    const { error } = await supabase.from("statistics").insert({
      organization_id: input.organizationId,
      locale: input.locale ?? "en",
      label: String(input.values.label),
      value: String(input.values.value),
      description: String(input.values.description),
      sort_order: sortOrder,
      is_active: Boolean(input.values.isActive ?? true),
    });

    if (error) throw new Error(error.message);
    return;
  }

  if (input.entity === "testimonials") {
    if (input.id) {
      const { error } = await supabase
        .from("testimonials")
        .update({
          author_name: String(input.values.author),
          author_role: String(input.values.role ?? ""),
          quote: String(input.values.quote),
          rating:
            input.values.rating !== undefined && input.values.rating !== null && input.values.rating !== ""
              ? Number(input.values.rating)
              : null,
          is_active: Boolean(input.values.isActive ?? true),
        })
        .eq("id", input.id)
        .eq("organization_id", input.organizationId)
        .eq("locale", input.locale ?? "en");

      if (error) throw new Error(error.message);
      return;
    }

    const sortOrder = await getNextSortOrder(
      supabase,
      input.entity,
      input.organizationId,
      input.locale ?? "en",
    );
    const { error } = await supabase.from("testimonials").insert({
      organization_id: input.organizationId,
      locale: input.locale ?? "en",
      author_name: String(input.values.author),
      author_role: String(input.values.role ?? ""),
      quote: String(input.values.quote),
      rating:
        input.values.rating !== undefined && input.values.rating !== null && input.values.rating !== ""
          ? Number(input.values.rating)
          : null,
      sort_order: sortOrder,
      is_active: Boolean(input.values.isActive ?? true),
    });

    if (error) throw new Error(error.message);
    return;
  }

  if (input.entity === "faqs") {
    if (input.id) {
      const { error } = await supabase
        .from("faqs")
        .update({
          question: String(input.values.question),
          answer: String(input.values.answer),
          is_active: Boolean(input.values.isActive ?? true),
        })
        .eq("id", input.id)
        .eq("organization_id", input.organizationId)
        .eq("locale", input.locale ?? "en");

      if (error) throw new Error(error.message);
      return;
    }

    const sortOrder = await getNextSortOrder(
      supabase,
      input.entity,
      input.organizationId,
      input.locale ?? "en",
    );
    const { error } = await supabase.from("faqs").insert({
      organization_id: input.organizationId,
      locale: input.locale ?? "en",
      question: String(input.values.question),
      answer: String(input.values.answer),
      sort_order: sortOrder,
      is_active: Boolean(input.values.isActive ?? true),
    });

    if (error) throw new Error(error.message);
    return;
  }

  if (input.entity === "social_links") {
    if (input.id) {
      const { error } = await supabase
        .from("social_links")
        .update({
          platform: String(input.values.platform),
          label: String(input.values.label),
          url: String(input.values.url),
          is_active: Boolean(input.values.isActive ?? true),
        })
        .eq("id", input.id)
        .eq("organization_id", input.organizationId);

      if (error) throw new Error(error.message);
      return;
    }

    const sortOrder = await getNextSortOrder(supabase, input.entity, input.organizationId);
    const { error } = await supabase.from("social_links").insert({
      organization_id: input.organizationId,
      platform: String(input.values.platform),
      label: String(input.values.label),
      url: String(input.values.url),
      sort_order: sortOrder,
      is_active: Boolean(input.values.isActive ?? true),
    });

    if (error) throw new Error(error.message);
  }
}

export async function deleteCollectionItem(
  entity: CollectionEntity,
  id: string,
  organizationId: string,
  locale?: Locale,
) {
  const supabase = getServiceClientOrThrow();
  let query = supabase.from(entity).delete().eq("id", id).eq("organization_id", organizationId);

  if (isLocalizedEntity(entity)) {
    if (!locale) {
      throw new Error("A locale is required for localized content.");
    }

    query = applyEq(query, "locale", locale);
  }

  const { error } = await query;

  if (error) {
    throw new Error(error.message);
  }
}

export async function moveCollectionItem(input: {
  entity: CollectionEntity;
  organizationId: string;
  id: string;
  direction: "up" | "down";
  locale?: Locale;
}) {
  const supabase = getServiceClientOrThrow();

  let query = supabase
    .from(input.entity)
    .select("id, sort_order")
    .eq("organization_id", input.organizationId)
    .order("sort_order", { ascending: true });

  if (isLocalizedEntity(input.entity) && input.locale) {
    query = applyEq(query, "locale", input.locale);
  }

  const { data, error } = await query;

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to load items for ordering.");
  }

  const currentIndex = data.findIndex((item) => item.id === input.id);

  if (currentIndex === -1) {
    return;
  }

  const targetIndex =
    input.direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0 || targetIndex >= data.length) {
    return;
  }

  const current = data[currentIndex];
  const target = data[targetIndex];

  let currentUpdate = supabase
    .from(input.entity)
    .update({ sort_order: target.sort_order })
    .eq("id", current.id)
    .eq("organization_id", input.organizationId);
  let targetUpdate = supabase
    .from(input.entity)
    .update({ sort_order: current.sort_order })
    .eq("id", target.id)
    .eq("organization_id", input.organizationId);

  if (isLocalizedEntity(input.entity) && input.locale) {
    currentUpdate = applyEq(currentUpdate, "locale", input.locale);
    targetUpdate = applyEq(targetUpdate, "locale", input.locale);
  }

  const [currentResult, targetResult] = await Promise.all([
    currentUpdate,
    targetUpdate,
  ]);

  if (currentResult.error || targetResult.error) {
    throw new Error(
      currentResult.error?.message ??
        targetResult.error?.message ??
        "Unable to reorder items.",
    );
  }
}
