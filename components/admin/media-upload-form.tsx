"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { uploadMediaAction } from "@/lib/actions/media";
import { defaultFormActionState } from "@/lib/actions/form-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MediaUploadForm() {
  const [state, formAction, isPending] = useActionState(
    uploadMediaAction,
    defaultFormActionState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      formRef.current?.reset();
    }

    if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-4 md:grid-cols-[1fr_200px]">
      <div className="grid gap-4">
        <Input type="file" name="file" accept="image/*" required />
        <Input
          name="altText"
          placeholder="Alt text"
        />
      </div>
      <div className="grid gap-4">
        <select
          name="locale"
          className="rounded-2xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground outline-none"
          defaultValue=""
        >
          <option value="">All locales</option>
          <option value="en">English</option>
          <option value="ar">Arabic</option>
        </select>
        <p className="text-xs leading-6 text-muted-foreground">
          Upload premium images first, then attach them to hero, about, SEO, or brand settings.
        </p>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Uploading..." : "Upload media"}
        </Button>
      </div>
    </form>
  );
}
