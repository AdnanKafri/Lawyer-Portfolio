"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { uploadMediaAction } from "@/lib/actions/media";
import { defaultFormActionState } from "@/lib/actions/form-state";
import { FormSelect } from "@/components/admin/form-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MediaUploadForm() {
  const [state, formAction, isPending] = useActionState(
    uploadMediaAction,
    defaultFormActionState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [selectKey, setSelectKey] = useState(0);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      formRef.current?.reset();
      setSelectKey((current) => current + 1);
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
          Upload premium images first, then attach them to hero, about, SEO, or brand settings.
        </p>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Uploading..." : "Upload media"}
        </Button>
      </div>
    </form>
  );
}
