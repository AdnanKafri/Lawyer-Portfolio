"use client";

import { Card } from "@/components/ui/card";
import { ContentForm, type ContentField } from "@/components/admin/content-form";
import type { HeroContent, MediaOption } from "@/types/domain";
import { saveHeroSectionAction } from "@/lib/actions/content";

const heroFields = (mediaOptions: MediaOption[]): ContentField[] => [
  { name: "eyebrow", label: "Eyebrow", placeholder: "Small intro label" },
  { name: "title", label: "Headline", placeholder: "Main hero headline", span: 2, type: "textarea", rows: 3 },
  { name: "description", label: "Description", placeholder: "Short positioning paragraph", span: 2, type: "textarea", rows: 5 },
  { name: "primaryCta", label: "Primary CTA", placeholder: "Book a consultation" },
  { name: "secondaryCta", label: "Secondary CTA", placeholder: "View practice areas" },
  {
    name: "trustPoints",
    label: "Trust points",
    type: "textarea",
    rows: 3,
    span: 2,
    placeholder:
      "Response within 24 hours, Strict confidentiality, Bilingual representation",
    helperText: "Separate each trust point with a comma.",
  },
  {
    name: "heroAssetId",
    label: "Hero image",
    type: "select",
    span: 2,
    helperText: "Select a premium image from the media library. Upload new assets from the media page first.",
    options: mediaOptions.map((asset) => ({
      value: asset.id,
      label: asset.label,
    })),
  },
];

export function HeroForm({
  locale,
  initialValue,
  mediaOptions,
}: {
  locale: "en" | "ar";
  initialValue: HeroContent;
  mediaOptions: MediaOption[];
}) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.22em] text-accent">
            {locale === "ar" ? "النسخة العربية" : "English version"}
          </p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {locale === "ar"
              ? "عدّل العنوان الرئيس والرسائل الداعمة وصورة البطل من هنا."
              : "Refine the hero positioning, trust cues, and selected lead image here."}
          </p>
        </div>
      </div>
      <ContentForm
        key={locale}
        action={saveHeroSectionAction}
        fields={heroFields(mediaOptions)}
        initialValues={initialValue}
        hiddenFields={{ locale }}
        submitLabel={locale === "ar" ? "حفظ النسخة العربية" : "Save hero copy"}
      />
    </Card>
  );
}
