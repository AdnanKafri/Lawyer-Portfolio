"use client";

import { Card } from "@/components/ui/card";
import { ContentForm, type ContentField } from "@/components/admin/content-form";
import { saveSeoSettingsAction } from "@/lib/actions/content";
import type { MediaOption, SeoPageSettings } from "@/types/domain";

const seoFields = (mediaOptions: MediaOption[]): ContentField[] => [
  { name: "metaTitle", label: "Meta title", span: 2 },
  { name: "metaDescription", label: "Meta description", span: 2, type: "textarea", rows: 4 },
  { name: "ogTitle", label: "Open Graph title", span: 2 },
  { name: "ogDescription", label: "Open Graph description", span: 2, type: "textarea", rows: 4 },
  { name: "canonicalPath", label: "Canonical path", span: 2, helperText: "Example: /en or /ar/legal/privacy" },
  {
    name: "ogImageAssetId",
    label: "Open Graph image",
    type: "select",
    span: 2,
    helperText: "Select a strong preview image for sharing on social platforms.",
    options: mediaOptions.map((asset) => ({ label: asset.label, value: asset.id })),
  },
];

export function SeoSettingsForm({
  locale,
  pageKey,
  initialValue,
  mediaOptions,
}: {
  locale: "en" | "ar";
  pageKey: string;
  initialValue: SeoPageSettings;
  mediaOptions: MediaOption[];
}) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-accent">
          {pageKey}
        </p>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          {locale === "ar"
            ? "اضبط العنوان والوصف وبيانات المشاركة لتحسين الظهور في البحث ومواقع التواصل."
            : "Control page metadata and preview content for search and social sharing."}
        </p>
      </div>
      <ContentForm
        key={`${locale}-${pageKey}`}
        action={saveSeoSettingsAction}
        fields={seoFields(mediaOptions)}
        initialValues={{
          metaTitle: initialValue.title,
          metaDescription: initialValue.description,
          ogTitle: initialValue.ogTitle ?? "",
          ogDescription: initialValue.ogDescription ?? "",
          canonicalPath: initialValue.canonicalPath ?? "",
          ogImageAssetId: initialValue.ogImageAssetId ?? "",
        }}
        hiddenFields={{ locale, pageKey }}
        submitLabel={locale === "ar" ? "حفظ SEO" : "Save SEO"}
      />
    </Card>
  );
}
