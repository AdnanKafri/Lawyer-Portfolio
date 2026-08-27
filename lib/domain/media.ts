import { env } from "@/lib/env";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { validateMediaFile } from "@/lib/validation/media";

function sanitizeFileName(fileName: string) {
  return fileName.toLowerCase().replace(/[^a-z0-9.\-_]/g, "-");
}

export async function uploadMediaAsset(input: {
  organizationId: string;
  adminUserId: string;
  locale?: "en" | "ar";
  file: File;
  altText?: string;
}) {
  const supabase = createSupabaseServiceClient();

  if (!supabase) {
    throw new Error("Supabase service role is not configured.");
  }

  const validationMessage = validateMediaFile(input.file);

  if (validationMessage) {
    throw new Error(validationMessage);
  }

  const buffer = Buffer.from(await input.file.arrayBuffer());
  const fileName = sanitizeFileName(input.file.name);
  const path = `${input.organizationId}/${Date.now()}-${fileName}`;

  const uploadResult = await supabase.storage
    .from(env.SUPABASE_MEDIA_BUCKET)
    .upload(path, buffer, {
      contentType: input.file.type,
      upsert: false,
    });

  if (uploadResult.error) {
    throw new Error(uploadResult.error.message);
  }

  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      organization_id: input.organizationId,
      locale: input.locale ?? null,
      bucket: env.SUPABASE_MEDIA_BUCKET,
      path,
      file_name: input.file.name,
      mime_type: input.file.type || "application/octet-stream",
      alt_text: input.altText ?? null,
      size_bytes: input.file.size,
      created_by: input.adminUserId,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(env.SUPABASE_MEDIA_BUCKET).getPublicUrl(path);

  return {
    asset: data,
    publicUrl,
  };
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
