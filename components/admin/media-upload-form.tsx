"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { uploadMediaAction } from "@/lib/actions/media";
import { defaultFormActionState } from "@/lib/actions/form-state";
import { FormSelect } from "@/components/admin/form-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MAX_MEDIA_UPLOAD_BYTES,
  validateMediaFile,
} from "@/lib/validation/media";

export function MediaUploadForm() {
  const [state, formAction, isPending] = useActionState(
    uploadMediaAction,
    defaultFormActionState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [selectKey, setSelectKey] = useState(0);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      formRef.current?.reset();
      setSelectKey((current) => current + 1);
      setFileError(null);
    }

    if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
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
          <Input id="media-alt-text" name="altText" placeholder="Alt text" />
        </div>
      </div>
      <div className="grid gap-4">
        <FormSelect
          key={selectKey}
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
        <Button type="submit" disabled={isPending}>
          {isPending ? "Uploading..." : "Upload media"}
        </Button>
      </div>
    </form>
  );
}
