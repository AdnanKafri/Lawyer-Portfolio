"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import type { FormActionState } from "@/lib/actions/form-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentForm, type ContentField } from "@/components/admin/content-form";

type CollectionItem = {
  id: string;
  isActive?: boolean;
  sortOrder?: number;
  [key: string]: string | number | boolean | null | undefined;
};

type CollectionEditorProps = {
  title: string;
  description: string;
  itemLabel: string;
  items: CollectionItem[];
  fields: ContentField[];
  entity: string;
  saveAction: (
    previousState: FormActionState,
    formData: FormData,
  ) => Promise<FormActionState>;
  deleteAction: (formData: FormData) => Promise<void>;
  moveAction: (formData: FormData) => Promise<void>;
  locale?: "en" | "ar";
  titleField: string;
  subtitleField?: string;
  itemTypeLabel?: string;
};

export function CollectionEditor({
  title,
  description,
  itemLabel,
  items,
  fields,
  saveAction,
  deleteAction,
  moveAction,
  locale,
  titleField,
  subtitleField,
  itemTypeLabel = "item",
  entity,
}: CollectionEditorProps) {
  const [editingItem, setEditingItem] = useState<CollectionItem | null>(null);

  useEffect(() => {
    setEditingItem(null);
  }, [locale]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">{title}</p>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
              {description}
            </p>
          </div>
          <span className="rounded-full border border-border px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-muted-foreground">
            {items.length}
          </span>
        </div>
        <div className="mt-6">
          <ContentForm
            key={editingItem?.id ?? "new"}
            action={saveAction}
            fields={fields}
            initialValues={editingItem ?? undefined}
            hiddenFields={{
              entity,
              locale,
              id: editingItem?.id ?? "",
            }}
            submitLabel={editingItem ? `Update ${itemLabel}` : `Add ${itemLabel}`}
            pendingLabel={editingItem ? `Updating ${itemLabel}...` : `Adding ${itemLabel}...`}
            onSuccess={() => setEditingItem(null)}
          />
        </div>
      </Card>
      <div className="space-y-4">
        {items.length === 0 ? (
          <Card className="p-6 text-sm leading-7 text-muted-foreground">
            No {itemLabel}s yet. Add the first {itemTypeLabel} using the editor panel.
          </Card>
        ) : (
          items.map((item, index) => {
            const heading = String(item[titleField] ?? item.id);
            const subtitle = subtitleField ? String(item[subtitleField] ?? "") : "";

            return (
              <Card key={item.id} className="p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground">{heading}</h3>
                      <span
                        className={`rounded-full border px-3 py-1 text-[0.66rem] uppercase tracking-[0.18em] ${
                          item.isActive
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                            : "border-border bg-white/[0.03] text-muted-foreground"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    {subtitle ? (
                      <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                        {subtitle}
                      </p>
                    ) : null}
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Order #{item.sortOrder ?? index + 1}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      aria-label={`Edit ${itemLabel}`}
                      onClick={() => setEditingItem(item)}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <form action={moveAction}>
                      <input type="hidden" name="entity" value={entity} />
                      <input type="hidden" name="locale" value={locale ?? ""} />
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="direction" value="up" />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        aria-label={`Move ${itemLabel} up`}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                    </form>
                    <form action={moveAction}>
                      <input type="hidden" name="entity" value={entity} />
                      <input type="hidden" name="locale" value={locale ?? ""} />
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="direction" value="down" />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        aria-label={`Move ${itemLabel} down`}
                        disabled={index === items.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </form>
                    <form action={deleteAction}>
                      <input type="hidden" name="entity" value={entity} />
                      <input type="hidden" name="locale" value={locale ?? ""} />
                      <input type="hidden" name="id" value={item.id} />
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        aria-label={`Delete ${itemLabel}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
