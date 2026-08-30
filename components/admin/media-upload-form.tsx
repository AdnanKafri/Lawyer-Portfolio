"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  cancelMediaUploadAction,
  completeMediaUploadAction,
  createMediaUploadTargetAction,
} from "@/lib/actions/media";
import { defaultFormActionState } from "@/lib/actions/form-state";
import { FormSelect } from "@/components/admin/form-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  MAX_MEDIA_UPLOAD_BYTES,
  validateMediaFile,
} from "@/lib/validation/media";

export function MediaUploadForm() {
  const [isPending, setIsPending] = useState(false);
  const [progressMessage, setProgressMessage] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isPending) {
      return;
    }

    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("file");
    const file =
      fileInput instanceof HTMLInputElement ? fileInput.files?.[0] : undefined;
    const validationMessage = file
      ? validateMediaFile(file)
      : "Please select a file to upload.";

    if (validationMessage) {
      setFileError(validationMessage);
      return;
    }

    const supabase = createSupabaseBrowserClient();

    if (!supabase || !file) {
      setFileError("Media storage is not configured.");
      return;
    }

    setFileError(null);
    setIsPending(true);
    setProgressMessage("Preparing secure upload...");

    try {
      const targetFormData = new FormData();
      targetFormData.set("fileName", file.name);
      targetFormData.set("mimeType", file.type);
      targetFormData.set("sizeBytes", String(file.size));

      const targetResult = await createMediaUploadTargetAction(
        defaultFormActionState,
        targetFormData,
      );

      if (targetResult.status === "error" || !targetResult.target) {
        throw new Error(
          targetResult.message || "Unable to prepare the media upload.",
        );
      }

      setProgressMessage("Uploading image...");
      const { error: uploadError } = await supabase.storage
        .from(targetResult.target.bucket)
        .uploadToSignedUrl(
          targetResult.target.path,
          targetResult.target.token,
          file,
          {
            cacheControl: "3600",
            contentType: file.type,
            upsert: false,
          },
        );

      if (uploadError) {
        try {
          await cancelMediaUploadAction(targetResult.target.path);
        } catch {
          // The upload error is more useful to the admin than cleanup failure.
        }

        throw new Error(uploadError.message);
      }

      setProgressMessage("Saving media details...");
      const sourceFormData = new FormData(form);
      const completeFormData = new FormData();
      completeFormData.set("path", targetResult.target.path);
      completeFormData.set("fileName", file.name);
      completeFormData.set("mimeType", file.type);
      completeFormData.set("sizeBytes", String(file.size));
      completeFormData.set(
        "locale",
        String(sourceFormData.get("locale") ?? ""),
      );
      completeFormData.set(
        "altText",
        String(sourceFormData.get("altText") ?? ""),
      );

      const completeResult = await completeMediaUploadAction(
        defaultFormActionState,
        completeFormData,
      );

      if (completeResult.status === "error") {
        try {
          await cancelMediaUploadAction(targetResult.target.path);
        } catch {
          // The completion error is more useful to the admin than cleanup failure.
        }

        throw new Error(completeResult.message || "Media upload failed.");
      }

      toast.success(completeResult.message);
      form.reset();
      setProgressMessage("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Media upload failed.";
      setProgressMessage("");
      toast.error(message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 md:grid-cols-[1fr_200px]"
    >
      <div className="grid gap-4">
        <div className="grid gap-2">
          <label
            htmlFor="media-file"
            className="text-sm font-medium text-foreground"
          >
            Image file
          </label>
          <Input
            id="media-file"
            type="file"
            name="file"
            accept=".jpg,.jpeg,.png,.webp,.avif,.gif,image/jpeg,image/png,image/webp,image/avif,image/gif"
            required
            disabled={isPending}
            onChange={(event) => {
              const file = event.target.files?.[0];
              setFileError(file ? validateMediaFile(file) : null);
            }}
          />
          <p className="text-xs leading-6 text-muted-foreground">
            JPG, PNG, WebP, AVIF, or GIF up to{" "}
            {Math.round(MAX_MEDIA_UPLOAD_BYTES / 1024 / 1024)} MB.
          </p>
          {fileError ? (
            <p className="text-xs text-danger">{fileError}</p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="media-alt-text"
            className="text-sm font-medium text-foreground"
          >
            Alt text
          </label>
          <Input
            id="media-alt-text"
            name="altText"
            placeholder="Alt text"
            disabled={isPending}
          />
        </div>
      </div>
      <div className="grid content-start gap-4">
        <FormSelect
          name="locale"
          ariaLabel="Locale"
          placeholder="All locales"
          emptyLabel="All locales"
          defaultValue=""
          options={[
            { label: "English", value: "en" },
            { label: "Arabic", value: "ar" },
          ]}
        />
        <p className="text-xs leading-6 text-muted-foreground">
          Upload premium images first, then attach them to hero, about, SEO, or
          brand settings.
        </p>
        {progressMessage ? (
          <p role="status" className="text-xs text-accent">
            {progressMessage}
          </p>
        ) : null}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Uploading..." : "Upload media"}
        </Button>
      </div>
    </form>
  );
}
