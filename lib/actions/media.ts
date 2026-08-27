"use server";

import { revalidatePath } from "next/cache";
import type { FormActionState } from "@/lib/actions/form-state";
import { requireAdminContext } from "@/lib/domain/admin";
import { uploadMediaAsset } from "@/lib/domain/media";
import { validateMediaFile } from "@/lib/validation/media";

export async function uploadMediaAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const adminContext = await requireAdminContext();
  const file = formData.get("file");
  const localeValue = String(formData.get("locale") ?? "").trim();
  const altText = String(formData.get("altText") ?? "").trim();

  if (!(file instanceof File) || file.size === 0) {
    return {
      status: "error",
      message: "Please select a file to upload.",
    };
  }

  const validationMessage = validateMediaFile(file);

  if (validationMessage) {
    return {
      status: "error",
      message: validationMessage,
    };
  }

  try {
    await uploadMediaAsset({
      organizationId: adminContext.adminUser.organization_id,
      adminUserId: adminContext.adminUser.id,
      locale:
        localeValue === "en" || localeValue === "ar" ? localeValue : undefined,
      file,
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
