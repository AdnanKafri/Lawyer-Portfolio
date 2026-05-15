"use server";

import { revalidatePath } from "next/cache";
import { defaultFormActionState, type FormActionState } from "@/lib/actions/form-state";
import { requireAdminContext } from "@/lib/domain/admin";
import {
  type CollectionEntity,
  deleteCollectionItem,
  moveCollectionItem,
  upsertAboutSection,
  upsertCollectionItem,
  upsertContactInfo,
  upsertHeroSection,
  upsertSeoSettings,
  upsertSiteSettings,
} from "@/lib/domain/content";
import { localeSchema, aboutContentSchema, contactInfoSchema, heroContentSchema, seoSettingsSchema, siteSettingsSchema, serviceItemSchema, credentialSchema, statisticSchema, testimonialSchema, faqSchema, socialLinkSchema } from "@/lib/validation/content";

function parseCommaList(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseBoolean(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function adminSectionPath(section: string) {
  return `/admin/${section}`;
}

function revalidateContentPaths(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
}

function localizedContentPaths(locale: "en" | "ar", section: string) {
  return [`/${locale}`, adminSectionPath(section), "/admin"];
}

function parseLocaleValue(value: FormDataEntryValue | null) {
  const parsed = localeSchema.safeParse(String(value ?? "en"));

  return parsed.success ? parsed.data : "en";
}

function parseOptionalString(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length > 0 ? text : undefined;
}

function parseEntity(value: FormDataEntryValue | null) {
  return String(value ?? "");
}

function isCollectionEntity(value: string): value is CollectionEntity {
  return [
    "services",
    "credentials",
    "statistics",
    "testimonials",
    "faqs",
    "social_links",
  ].includes(value);
}

export async function saveHeroSectionAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const adminContext = await requireAdminContext();

  const parsed = heroContentSchema.safeParse({
    locale: parseLocaleValue(formData.get("locale")),
    eyebrow: String(formData.get("eyebrow") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    primaryCta: String(formData.get("primaryCta") ?? "").trim(),
    secondaryCta: String(formData.get("secondaryCta") ?? "").trim(),
    trustPoints: parseCommaList(formData.get("trustPoints")),
    heroAssetId: parseOptionalString(formData.get("heroAssetId")),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid hero content." };
  }

  try {
    await upsertHeroSection({
      organizationId: adminContext.adminUser.organization_id,
      ...parsed.data,
    });

    revalidateContentPaths(localizedContentPaths(parsed.data.locale, "content/hero"));

    return { status: "success", message: "Hero section updated successfully." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Could not save hero section.",
    };
  }
}

export async function saveAboutSectionAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const adminContext = await requireAdminContext();

  const parsed = aboutContentSchema.safeParse({
    locale: parseLocaleValue(formData.get("locale")),
    eyebrow: String(formData.get("eyebrow") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    yearsExperience: formData.get("yearsExperience"),
    languages: parseCommaList(formData.get("languages")),
    certificationsSummary: parseOptionalString(formData.get("certificationsSummary")),
    profileAssetId: parseOptionalString(formData.get("profileAssetId")),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid about content." };
  }

  try {
    await upsertAboutSection({
      organizationId: adminContext.adminUser.organization_id,
      ...parsed.data,
    });

    revalidateContentPaths(localizedContentPaths(parsed.data.locale, "content/about"));

    return { status: "success", message: "About section updated successfully." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Could not save about section.",
    };
  }
}

export async function saveContactInfoAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const adminContext = await requireAdminContext();

  const parsed = contactInfoSchema.safeParse({
    locale: parseLocaleValue(formData.get("locale")),
    eyebrow: String(formData.get("eyebrow") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    whatsapp: String(formData.get("whatsapp") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    mapEmbedUrl: parseOptionalString(formData.get("mapEmbedUrl")),
    responseTimeLabel: parseOptionalString(formData.get("responseTimeLabel")),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid contact content." };
  }

  try {
    await upsertContactInfo({
      organizationId: adminContext.adminUser.organization_id,
      ...parsed.data,
    });

    revalidateContentPaths(localizedContentPaths(parsed.data.locale, "content/contact"));

    return { status: "success", message: "Contact information updated successfully." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Could not save contact information.",
    };
  }
}

export async function saveSeoSettingsAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const adminContext = await requireAdminContext();

  const parsed = seoSettingsSchema.safeParse({
    locale: parseLocaleValue(formData.get("locale")),
    pageKey: String(formData.get("pageKey") ?? "").trim(),
    metaTitle: String(formData.get("metaTitle") ?? "").trim(),
    metaDescription: String(formData.get("metaDescription") ?? "").trim(),
    ogTitle: parseOptionalString(formData.get("ogTitle")),
    ogDescription: parseOptionalString(formData.get("ogDescription")),
    canonicalPath: parseOptionalString(formData.get("canonicalPath")),
    ogImageAssetId: parseOptionalString(formData.get("ogImageAssetId")),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid SEO settings." };
  }

  try {
    await upsertSeoSettings({
      organizationId: adminContext.adminUser.organization_id,
      locale: parsed.data.locale,
      pageKey: parsed.data.pageKey,
      metaTitle: parsed.data.metaTitle,
      metaDescription: parsed.data.metaDescription,
      ogTitle: parsed.data.ogTitle,
      ogDescription: parsed.data.ogDescription,
      canonicalPath: parsed.data.canonicalPath,
      ogImageAssetId: parsed.data.ogImageAssetId,
    });

    revalidateContentPaths([`/${parsed.data.locale}`, "/admin/seo", "/admin"]);

    return { status: "success", message: "SEO settings saved successfully." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Could not save SEO settings.",
    };
  }
}

export async function saveSiteSettingsAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const adminContext = await requireAdminContext();

  const parsed = siteSettingsSchema.safeParse({
    siteName: String(formData.get("siteName") ?? "").trim(),
    tagline: parseOptionalString(formData.get("tagline")),
    primaryPhone: parseOptionalString(formData.get("primaryPhone")),
    primaryEmail: parseOptionalString(formData.get("primaryEmail")),
    officeAddress: parseOptionalString(formData.get("officeAddress")),
    logoAssetId: parseOptionalString(formData.get("logoAssetId")),
    faviconAssetId: parseOptionalString(formData.get("faviconAssetId")),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid site settings.",
    };
  }

  try {
    await upsertSiteSettings({
      organizationId: adminContext.adminUser.organization_id,
      ...parsed.data,
    });

    revalidateContentPaths(["/en", "/ar", "/admin/settings", "/admin"]);

    return { status: "success", message: "Site settings updated successfully." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Could not save site settings.",
    };
  }
}

export async function saveCollectionItemAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const adminContext = await requireAdminContext();
  const entity = parseEntity(formData.get("entity"));
  const id = parseOptionalString(formData.get("id"));

  try {
    if (entity === "services") {
      const parsed = serviceItemSchema.safeParse({
        id,
        locale: parseLocaleValue(formData.get("locale")),
        title: String(formData.get("title") ?? "").trim(),
        description: String(formData.get("description") ?? "").trim(),
        slug: parseOptionalString(formData.get("slug")),
        iconKey: parseOptionalString(formData.get("iconKey")),
        isActive: parseBoolean(formData.get("isActive")),
      });

      if (!parsed.success) {
        return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid service." };
      }

      await upsertCollectionItem({
        entity,
        organizationId: adminContext.adminUser.organization_id,
        locale: parsed.data.locale,
        id: parsed.data.id,
        values: {
          title: parsed.data.title,
          description: parsed.data.description,
          slug:
            parsed.data.slug ??
            (slugify(parsed.data.title) || `service-${Date.now().toString(36)}`),
          iconKey: parsed.data.iconKey,
          isActive: parsed.data.isActive,
        },
      });

      revalidateContentPaths(localizedContentPaths(parsed.data.locale, "content/services"));

      return { status: "success", message: id ? "Service updated successfully." : "Service created successfully." };
    }

    if (entity === "credentials") {
      const parsed = credentialSchema.safeParse({
        id,
        locale: parseLocaleValue(formData.get("locale")),
        title: String(formData.get("title") ?? "").trim(),
        description: String(formData.get("description") ?? "").trim(),
        isActive: parseBoolean(formData.get("isActive")),
      });

      if (!parsed.success) {
        return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid credential." };
      }

      await upsertCollectionItem({
        entity,
        organizationId: adminContext.adminUser.organization_id,
        locale: parsed.data.locale,
        id: parsed.data.id,
        values: {
          title: parsed.data.title,
          description: parsed.data.description,
          isActive: parsed.data.isActive,
        },
      });

      revalidateContentPaths(localizedContentPaths(parsed.data.locale, "content/about"));

      return { status: "success", message: id ? "Credential updated successfully." : "Credential created successfully." };
    }

    if (entity === "statistics") {
      const parsed = statisticSchema.safeParse({
        id,
        locale: parseLocaleValue(formData.get("locale")),
        label: String(formData.get("label") ?? "").trim(),
        value: String(formData.get("value") ?? "").trim(),
        description: String(formData.get("description") ?? "").trim(),
        isActive: parseBoolean(formData.get("isActive")),
      });

      if (!parsed.success) {
        return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid statistic." };
      }

      await upsertCollectionItem({
        entity,
        organizationId: adminContext.adminUser.organization_id,
        locale: parsed.data.locale,
        id: parsed.data.id,
        values: {
          label: parsed.data.label,
          value: parsed.data.value,
          description: parsed.data.description,
          isActive: parsed.data.isActive,
        },
      });

      revalidateContentPaths(localizedContentPaths(parsed.data.locale, "content/statistics"));

      return { status: "success", message: id ? "Statistic updated successfully." : "Statistic created successfully." };
    }

    if (entity === "testimonials") {
      const parsed = testimonialSchema.safeParse({
        id,
        locale: parseLocaleValue(formData.get("locale")),
        quote: String(formData.get("quote") ?? "").trim(),
        author: String(formData.get("author") ?? "").trim(),
        role: String(formData.get("role") ?? "").trim(),
        rating: formData.get("rating"),
        isActive: parseBoolean(formData.get("isActive")),
      });

      if (!parsed.success) {
        return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid testimonial." };
      }

      await upsertCollectionItem({
        entity,
        organizationId: adminContext.adminUser.organization_id,
        locale: parsed.data.locale,
        id: parsed.data.id,
        values: {
          quote: parsed.data.quote,
          author: parsed.data.author,
          role: parsed.data.role,
          rating: parsed.data.rating,
          isActive: parsed.data.isActive,
        },
      });

      revalidateContentPaths(localizedContentPaths(parsed.data.locale, "content/testimonials"));

      return { status: "success", message: id ? "Testimonial updated successfully." : "Testimonial created successfully." };
    }

    if (entity === "faqs") {
      const parsed = faqSchema.safeParse({
        id,
        locale: parseLocaleValue(formData.get("locale")),
        question: String(formData.get("question") ?? "").trim(),
        answer: String(formData.get("answer") ?? "").trim(),
        isActive: parseBoolean(formData.get("isActive")),
      });

      if (!parsed.success) {
        return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid FAQ." };
      }

      await upsertCollectionItem({
        entity,
        organizationId: adminContext.adminUser.organization_id,
        locale: parsed.data.locale,
        id: parsed.data.id,
        values: {
          question: parsed.data.question,
          answer: parsed.data.answer,
          isActive: parsed.data.isActive,
        },
      });

      revalidateContentPaths(localizedContentPaths(parsed.data.locale, "content/faqs"));

      return { status: "success", message: id ? "FAQ updated successfully." : "FAQ created successfully." };
    }

    if (entity === "social_links") {
      const parsed = socialLinkSchema.safeParse({
        id,
        platform: String(formData.get("platform") ?? "").trim(),
        label: String(formData.get("label") ?? "").trim(),
        url: String(formData.get("url") ?? "").trim(),
        isActive: parseBoolean(formData.get("isActive")),
      });

      if (!parsed.success) {
        return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid social link." };
      }

      await upsertCollectionItem({
        entity,
        organizationId: adminContext.adminUser.organization_id,
        id: parsed.data.id,
        values: {
          platform: parsed.data.platform,
          label: parsed.data.label,
          url: parsed.data.url,
          isActive: parsed.data.isActive,
        },
      });

      revalidateContentPaths(["/en", "/ar", "/admin/content/social-links", "/admin/settings", "/admin"]);

      return { status: "success", message: id ? "Social link updated successfully." : "Social link created successfully." };
    }

    if (entity === "services" || entity === "credentials" || entity === "statistics" || entity === "testimonials" || entity === "faqs" || entity === "social_links") {
      return { status: "error", message: "Unsupported collection." };
    }

    return { status: "error", message: "Unsupported collection." };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Could not save item.",
    };
  }
}

export async function deleteCollectionItemAction(formData: FormData): Promise<void> {
  const adminContext = await requireAdminContext();
  const entity = parseEntity(formData.get("entity"));
  const localeValue = parseOptionalString(formData.get("locale"));
  const id = parseOptionalString(formData.get("id"));

  if (!id) {
    return;
  }

  if (!isCollectionEntity(entity)) {
    return;
  }

  const locale =
    entity === "social_links"
      ? undefined
      : parseLocaleValue(localeValue ? localeValue : formData.get("locale"));

  await deleteCollectionItem(
    entity as CollectionEntity,
    id,
    adminContext.adminUser.organization_id,
    locale,
  );

  if (entity === "social_links") {
    revalidateContentPaths(["/en", "/ar", "/admin/content/social-links", "/admin/settings", "/admin"]);
    return;
  }

  const effectiveLocale = parseLocaleValue(localeValue ? localeValue : formData.get("locale"));

  const sectionMap: Record<string, string> = {
    services: "content/services",
    credentials: "content/about",
    statistics: "content/statistics",
    testimonials: "content/testimonials",
    faqs: "content/faqs",
  };

  revalidateContentPaths(localizedContentPaths(effectiveLocale, sectionMap[entity] ?? "content"));
}

export async function moveCollectionItemAction(formData: FormData): Promise<void> {
  const adminContext = await requireAdminContext();
  const entity = parseEntity(formData.get("entity"));
  const id = parseOptionalString(formData.get("id"));
  const direction = String(formData.get("direction") ?? "");
  const localeValue = parseOptionalString(formData.get("locale"));

  if (!id || (direction !== "up" && direction !== "down")) {
    return;
  }

  if (!isCollectionEntity(entity)) {
    return;
  }

  if (entity === "social_links") {
    await moveCollectionItem({
      entity: entity as CollectionEntity,
      organizationId: adminContext.adminUser.organization_id,
      id,
      direction,
    });

    revalidateContentPaths(["/en", "/ar", "/admin/content/social-links", "/admin/settings", "/admin"]);
    return;
  }

  const locale = parseLocaleValue(localeValue ? localeValue : formData.get("locale"));

  await moveCollectionItem({
    entity: entity as CollectionEntity,
    organizationId: adminContext.adminUser.organization_id,
    id,
    direction,
    locale,
  });

  const sectionMap: Record<string, string> = {
    services: "content/services",
    credentials: "content/about",
    statistics: "content/statistics",
    testimonials: "content/testimonials",
    faqs: "content/faqs",
  };

  revalidateContentPaths(localizedContentPaths(locale, sectionMap[entity] ?? "content"));
}

export { defaultFormActionState };
