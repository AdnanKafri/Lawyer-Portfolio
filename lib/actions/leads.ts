"use server";

import { revalidatePath } from "next/cache";
import { createLeadSubmission } from "@/lib/domain/leads";
import type { FormActionState } from "@/lib/actions/form-state";
import { leadSubmissionSchema } from "@/lib/validation/content";

export async function submitLeadAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const parsed = leadSubmissionSchema.safeParse({
    locale: String(formData.get("locale") ?? "en"),
    fullName: String(formData.get("fullName") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please complete the form correctly.",
    };
  }

  try {
    const notification = await createLeadSubmission(parsed.data);
    revalidatePath("/admin/leads");

    return {
      status: "success",
      message: notification.delivered
        ? "Your inquiry was submitted successfully."
        : "Your inquiry was stored successfully.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Failed to submit your inquiry.",
    };
  }
}
