import { env } from "@/lib/env";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
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

export async function listMediaAssets(organizationId: string) {
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

  return data.map((asset) => {
    const {
      data: { publicUrl },
    } = supabase.storage.from(asset.bucket).getPublicUrl(asset.path);

    return {
      ...asset,
      publicUrl,
    };
  });
}
