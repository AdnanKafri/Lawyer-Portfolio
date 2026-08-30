import { env } from "@/lib/env";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import type { Database } from "@/types/supabase";
import {
  MAX_MEDIA_UPLOAD_BYTES,
  validateMediaMetadata,
  type MediaFileMetadata,
} from "@/lib/validation/media";
import { randomUUID } from "crypto";

function sanitizeFileName(fileName: string) {
  return fileName.toLowerCase().replace(/[^a-z0-9.\-_]/g, "-");
}

export type MediaUploadTarget = {
  bucket: string;
  path: string;
  token: string;
};

export type MediaUsage = {
  label: string;
};

export type MediaAsset = Database["public"]["Tables"]["media_assets"]["Row"] & {
  publicUrl: string;
  usages: MediaUsage[];
};

type ServiceClient = NonNullable<
  ReturnType<typeof createSupabaseServiceClient>
>;

function assertMediaMetadata(input: MediaFileMetadata) {
  const validationMessage = validateMediaMetadata(input);

  if (validationMessage) {
    throw new Error(validationMessage);
  }
}

function assertOwnedMediaPath(path: string, organizationId: string) {
  if (!path.startsWith(`${organizationId}/`) || path.includes("..")) {
    throw new Error("Invalid media upload target.");
  }
}

export async function createMediaUploadTarget(
  input: {
    organizationId: string;
  } & MediaFileMetadata,
): Promise<MediaUploadTarget> {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    throw new Error("Supabase service role is not configured.");
  }

  assertMediaMetadata(input);

  const fileName = sanitizeFileName(input.fileName);
  const path = `${input.organizationId}/${Date.now()}-${randomUUID()}-${fileName}`;
  const { data, error } = await supabase.storage
    .from(env.SUPABASE_MEDIA_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data?.token) {
    throw new Error(error?.message ?? "Unable to prepare the media upload.");
  }

  return {
    bucket: env.SUPABASE_MEDIA_BUCKET,
    path,
    token: data.token,
  };
}

export async function completeMediaUpload(
  input: {
    organizationId: string;
    adminUserId: string;
    locale?: "en" | "ar";
    path: string;
    altText?: string;
  } & MediaFileMetadata,
) {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    throw new Error("Supabase service role is not configured.");
  }

  assertMediaMetadata(input);
  assertOwnedMediaPath(input.path, input.organizationId);

  const storage = supabase.storage.from(env.SUPABASE_MEDIA_BUCKET);
  const { data: exists, error: existsError } = await storage.exists(input.path);

  if (existsError || !exists) {
    throw new Error("The uploaded media could not be verified.");
  }

  const { data: fileInfo, error: infoError } = await storage.info(input.path);
  if (
    infoError ||
    !fileInfo ||
    fileInfo.size !== input.sizeBytes ||
    fileInfo.size > MAX_MEDIA_UPLOAD_BYTES ||
    (fileInfo.contentType && fileInfo.contentType !== input.mimeType)
  ) {
    await storage.remove([input.path]);
    throw new Error("The uploaded media metadata could not be verified.");
  }

  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      organization_id: input.organizationId,
      locale: input.locale ?? null,
      bucket: env.SUPABASE_MEDIA_BUCKET,
      path: input.path,
      file_name: input.fileName,
      mime_type: input.mimeType,
      alt_text: input.altText ?? null,
      size_bytes: input.sizeBytes,
      created_by: input.adminUserId,
    })
    .select("*")
    .single();

  if (error) {
    await storage.remove([input.path]);
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = storage.getPublicUrl(input.path);

  return {
    asset: data,
    publicUrl,
  };
}

export async function cancelMediaUpload(input: {
  organizationId: string;
  path: string;
}) {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return;
  }

  assertOwnedMediaPath(input.path, input.organizationId);
  await supabase.storage.from(env.SUPABASE_MEDIA_BUCKET).remove([input.path]);
}

async function getMediaUsageMap(
  supabase: ServiceClient,
  organizationId: string,
  assetIds: string[],
) {
  const usagesByAsset = new Map<string, MediaUsage[]>();

  if (assetIds.length === 0) {
    return usagesByAsset;
  }

  const [heroResult, aboutResult, seoResult, siteSettingsResult] =
    await Promise.all([
      supabase
        .from("hero_sections")
        .select("hero_asset_id,locale")
        .eq("organization_id", organizationId)
        .in("hero_asset_id", assetIds),
      supabase
        .from("about_sections")
        .select("profile_asset_id,locale")
        .eq("organization_id", organizationId)
        .in("profile_asset_id", assetIds),
      supabase
        .from("seo_settings")
        .select("og_image_asset_id,locale")
        .eq("organization_id", organizationId)
        .in("og_image_asset_id", assetIds),
      supabase
        .from("site_settings")
        .select("logo_asset_id,favicon_asset_id")
        .eq("organization_id", organizationId)
        .maybeSingle(),
    ]);

  if (
    heroResult.error ||
    aboutResult.error ||
    seoResult.error ||
    siteSettingsResult.error
  ) {
    throw new Error("Unable to determine media usage.");
  }

  const addUsage = (assetId: string | null, label: string) => {
    if (!assetId) {
      return;
    }

    const usages = usagesByAsset.get(assetId) ?? [];
    usages.push({ label });
    usagesByAsset.set(assetId, usages);
  };

  for (const row of heroResult.data ?? []) {
    addUsage(
      row.hero_asset_id,
      `Hero (${row.locale === "ar" ? "Arabic" : "English"})`,
    );
  }

  for (const row of aboutResult.data ?? []) {
    addUsage(
      row.profile_asset_id,
      `About/Profile (${row.locale === "ar" ? "Arabic" : "English"})`,
    );
  }

  for (const row of seoResult.data ?? []) {
    addUsage(
      row.og_image_asset_id,
      `SEO Open Graph (${row.locale === "ar" ? "Arabic" : "English"})`,
    );
  }

  if (siteSettingsResult.data) {
    addUsage(siteSettingsResult.data.logo_asset_id, "Brand logo");
    addUsage(siteSettingsResult.data.favicon_asset_id, "Brand favicon");
  }

  return usagesByAsset;
}

async function clearMediaAssetReferences(
  supabase: ServiceClient,
  organizationId: string,
  assetId: string,
) {
  const referenceUpdates = [
    supabase
      .from("hero_sections")
      .update({ hero_asset_id: null })
      .eq("organization_id", organizationId)
      .eq("hero_asset_id", assetId),
    supabase
      .from("about_sections")
      .update({ profile_asset_id: null })
      .eq("organization_id", organizationId)
      .eq("profile_asset_id", assetId),
    supabase
      .from("seo_settings")
      .update({ og_image_asset_id: null })
      .eq("organization_id", organizationId)
      .eq("og_image_asset_id", assetId),
    supabase
      .from("site_settings")
      .update({ logo_asset_id: null })
      .eq("organization_id", organizationId)
      .eq("logo_asset_id", assetId),
    supabase
      .from("site_settings")
      .update({ favicon_asset_id: null })
      .eq("organization_id", organizationId)
      .eq("favicon_asset_id", assetId),
  ];

  const results = await Promise.all(referenceUpdates);
  const failed = results.find((result) => result.error);

  if (failed?.error) {
    throw new Error(failed.error.message);
  }
}

export async function deleteMediaAsset(input: {
  organizationId: string;
  assetId: string;
  confirmed: boolean;
}) {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    throw new Error("Supabase service role is not configured.");
  }

  const { data: asset, error: assetError } = await supabase
    .from("media_assets")
    .select("*")
    .eq("id", input.assetId)
    .eq("organization_id", input.organizationId)
    .maybeSingle();

  if (assetError) {
    throw new Error(assetError.message);
  }

  if (!asset) {
    throw new Error("Media asset not found.");
  }

  const usageMap = await getMediaUsageMap(supabase, input.organizationId, [
    input.assetId,
  ]);
  const usages = usageMap.get(input.assetId) ?? [];

  if (!input.confirmed) {
    return { deleted: false, usages };
  }

  await clearMediaAssetReferences(
    supabase,
    input.organizationId,
    input.assetId,
  );

  const { error: storageError } = await supabase.storage
    .from(asset.bucket)
    .remove([asset.path]);

  if (storageError) {
    throw new Error(storageError.message);
  }

  const { error: deleteError } = await supabase
    .from("media_assets")
    .delete()
    .eq("id", input.assetId)
    .eq("organization_id", input.organizationId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  return { deleted: true, usages };
}

export async function listMediaAssets(
  organizationId: string,
): Promise<MediaAsset[]> {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(40);

  if (error || !data) {
    return [];
  }

  const usagesByAsset = await getMediaUsageMap(
    supabase,
    organizationId,
    data.map((asset) => asset.id),
  );

  return data.map((asset) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from(asset.bucket).getPublicUrl(asset.path);

    return {
      ...asset,
      publicUrl,
      usages: usagesByAsset.get(asset.id) ?? [],
    };
  });
}
