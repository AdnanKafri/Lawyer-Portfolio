"use server";

import { revalidatePath } from "next/cache";
import type { FormActionState } from "@/lib/actions/form-state";
import { requireAdminContext } from "@/lib/domain/admin";
import {
  cancelMediaUpload,
  completeMediaUpload,
  createMediaUploadTarget,
  deleteMediaAsset,
  type MediaUsage,
  type MediaUploadTarget,
} from "@/lib/domain/media";
import { validateMediaMetadata } from "@/lib/validation/media";

export type MediaUploadActionState = FormActionState & {
  target?: MediaUploadTarget;
};

export type MediaDeleteActionState = FormActionState & {
  usages?: MediaUsage[];
};

export async function createMediaUploadTargetAction(
  _previousState: MediaUploadActionState,
  formData: FormData,
): Promise<MediaUploadActionState> {
  const adminContext = await requireAdminContext();
  const fileName = String(formData.get("fileName") ?? "").trim();
  const mimeType = String(formData.get("mimeType") ?? "").trim();
  const sizeBytes = Number(formData.get("sizeBytes") ?? 0);

  const validationMessage = validateMediaMetadata({
    fileName,
    mimeType,
    sizeBytes,
  });

  if (validationMessage) {
    return {
      status: "error",
      message: validationMessage,
    };
  }

  try {
    const target = await createMediaUploadTarget({
      organizationId: adminContext.adminUser.organization_id,
      fileName,
      mimeType,
      sizeBytes,
    });

    return {
      status: "success",
      message: "Upload target ready.",
      target,
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Media upload failed.",
    };
  }
}

export async function completeMediaUploadAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const adminContext = await requireAdminContext();
  const fileName = String(formData.get("fileName") ?? "").trim();
  const mimeType = String(formData.get("mimeType") ?? "").trim();
  const sizeBytes = Number(formData.get("sizeBytes") ?? 0);
  const path = String(formData.get("path") ?? "").trim();
  const localeValue = String(formData.get("locale") ?? "").trim();
  const altText = String(formData.get("altText") ?? "").trim();

  const validationMessage = validateMediaMetadata({
    fileName,
    mimeType,
    sizeBytes,
  });

  if (validationMessage || !path) {
    return {
      status: "error",
      message: validationMessage ?? "Invalid media upload target.",
    };
  }

  try {
    await completeMediaUpload({
      organizationId: adminContext.adminUser.organization_id,
      adminUserId: adminContext.adminUser.id,
      locale:
        localeValue === "en" || localeValue === "ar" ? localeValue : undefined,
      path,
      fileName,
      mimeType,
      sizeBytes,
      altText,
    });

    revalidatePath("/admin/media");

    return {
      status: "success",
      message: "Media uploaded successfully.",
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Media upload failed.",
    };
  }
}

export async function cancelMediaUploadAction(path: string) {
  const adminContext = await requireAdminContext();

  await cancelMediaUpload({
    organizationId: adminContext.adminUser.organization_id,
    path,
  });
}

export async function deleteMediaAssetAction(
  _previousState: MediaDeleteActionState,
  formData: FormData,
): Promise<MediaDeleteActionState> {
  const adminContext = await requireAdminContext();
  const assetId = String(formData.get("assetId") ?? "").trim();
  const confirmed = formData.get("confirmed") === "true";

  if (!assetId || !confirmed) {
    return {
      status: "error",
      message: "Confirmation is required before deleting media.",
    };
  }

  try {
    const result = await deleteMediaAsset({
      organizationId: adminContext.adminUser.organization_id,
      assetId,
      confirmed,
    });

    if (!result.deleted) {
      return {
        status: "error",
        message:
          result.usages.length > 0
            ? `This media is currently used in: ${result.usages.map((usage) => usage.label).join(", ")}.`
            : "Confirmation is required before deleting media.",
        usages: result.usages,
      };
    }

    for (const path of [
      "/en",
      "/ar",
      "/admin",
      "/admin/media",
      "/admin/content/hero",
      "/admin/content/about",
      "/admin/seo",
      "/admin/settings",
    ]) {
      revalidatePath(path);
    }

    return {
      status: "success",
      message: "Media deleted successfully.",
      usages: result.usages,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Media deletion failed.",
    };
  }
}
