"use client";

import { useActionState, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { defaultFormActionState, type FormActionState } from "@/lib/actions/form-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/cn";

export type ContentField =
  | {
      name: string;
      label: string;
      type?: "text" | "email" | "url" | "number";
      placeholder?: string;
      helperText?: string;
      span?: 1 | 2;
    }
  | {
      name: string;
      label: string;
      type: "textarea";
      placeholder?: string;
      helperText?: string;
      span?: 1 | 2;
      rows?: number;
    }
  | {
      name: string;
      label: string;
      type: "select";
      helperText?: string;
      span?: 1 | 2;
      options: { label: string; value: string }[];
    }
  | {
      name: string;
      label: string;
      type: "checkbox";
      helperText?: string;
      span?: 1 | 2;
    };

type ContentFormProps = {
  action: (
    previousState: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
  fields: ContentField[];
  initialValues?: Record<string, string | number | boolean | null | undefined>;
  hiddenFields?: Record<string, string | number | boolean | null | undefined>;
  submitLabel: string;
  pendingLabel?: string;
  className?: string;
  onSuccess?: () => void;
};

function getStringValue(value: string | number | boolean | null | undefined) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

export function ContentForm({
  action,
  fields,
  initialValues = {},
  hiddenFields = {},
  submitLabel,
  pendingLabel = "Saving...",
  className,
  onSuccess,
}: ContentFormProps) {
  const [state, formAction, isPending] = useActionState(action, defaultFormActionState);
  const formRef = useRef<HTMLFormElement>(null);

  const hiddenInputs = useMemo(
    () =>
      Object.entries(hiddenFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={getStringValue(value)} />
      )),
    [hiddenFields],
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      formRef.current?.reset();
      onSuccess?.();
    }

    if (state.status === "error") {
      toast.error(state.message);
    }
  }, [state, onSuccess]);

  return (
    <form ref={formRef} action={formAction} className={cn("grid gap-5", className)}>
      {hiddenInputs}
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => {
          const spanClass = field.span === 2 ? "md:col-span-2" : "";
          const value = initialValues[field.name];

          if (field.type === "textarea") {
            return (
              <label key={field.name} className={cn("grid gap-2", spanClass)}>
                <span className="text-sm font-medium text-foreground">{field.label}</span>
                <Textarea
                  name={field.name}
                  defaultValue={getStringValue(value)}
                  placeholder={field.placeholder}
                  rows={field.rows}
                />
                {field.helperText ? (
                  <span className="text-xs leading-6 text-muted-foreground">
                    {field.helperText}
                  </span>
                ) : null}
              </label>
            );
          }

          if (field.type === "select") {
            return (
              <label key={field.name} className={cn("grid gap-2", spanClass)}>
                <span className="text-sm font-medium text-foreground">{field.label}</span>
                <select
                  name={field.name}
                  defaultValue={getStringValue(value)}
                  className="rounded-[1.35rem] border border-border bg-white/[0.03] px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-border-strong focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select an option</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {field.helperText ? (
                  <span className="text-xs leading-6 text-muted-foreground">
                    {field.helperText}
                  </span>
                ) : null}
              </label>
            );
          }

          if (field.type === "checkbox") {
            return (
              <label
                key={field.name}
                className={cn(
                  "flex items-start gap-3 rounded-[1.35rem] border border-border bg-white/[0.03] px-4 py-3.5",
                  spanClass,
                )}
              >
                <input
                  name={field.name}
                  type="checkbox"
                  defaultChecked={Boolean(value)}
                  className="mt-1 h-4 w-4 rounded border-border bg-background text-accent focus:ring-ring"
                />
                <span className="grid gap-1">
                  <span className="text-sm font-medium text-foreground">{field.label}</span>
                  {field.helperText ? (
                    <span className="text-xs leading-6 text-muted-foreground">
                      {field.helperText}
                    </span>
                  ) : null}
                </span>
              </label>
            );
          }

          return (
            <label key={field.name} className={cn("grid gap-2", spanClass)}>
              <span className="text-sm font-medium text-foreground">{field.label}</span>
              <Input
                name={field.name}
                type={field.type ?? "text"}
                defaultValue={getStringValue(value)}
                placeholder={field.placeholder}
              />
              {field.helperText ? (
                <span className="text-xs leading-6 text-muted-foreground">
                  {field.helperText}
                </span>
              ) : null}
            </label>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Use the save action to update the live CMS content
        </p>
        <Button type="submit" disabled={isPending}>
          {isPending ? pendingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
