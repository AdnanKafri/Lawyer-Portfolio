"use client";

import { Card } from "@/components/ui/card";
import { ContentForm, type ContentField } from "@/components/admin/content-form";
import { saveAboutSectionAction } from "@/lib/actions/content";
import type { AboutContent, MediaOption } from "@/types/domain";

const aboutFields = (mediaOptions: MediaOption[]): ContentField[] => [
  { name: "eyebrow", label: "Eyebrow" },
  { name: "title", label: "Heading", span: 2, type: "textarea", rows: 3 },
  { name: "summary", label: "Biography", span: 2, type: "textarea", rows: 6 },
  { name: "yearsExperience", label: "Years of experience", type: "number", helperText: "Leave blank if you do not want to show a number." },
  { name: "languages", label: "Languages", helperText: "Comma-separated, for example: Arabic, English" },
  { name: "certificationsSummary", label: "Certifications summary", span: 2 },
  {
    name: "profileAssetId",
    label: "Profile image",
    type: "select",
    span: 2,
    helperText: "Choose the portrait or office image to pair with the about section.",
    options: mediaOptions.map((asset) => ({ label: asset.label, value: asset.id })),
  },
];

export function AboutForm({
  locale,
  initialValue,
  mediaOptions,
}: {
  locale: "en" | "ar";
  initialValue: AboutContent;
  mediaOptions: MediaOption[];
}) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-accent">
          {locale === "ar" ? "النسخة العربية" : "English version"}
        </p>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          {locale === "ar"
            ? "عدّل السيرة المهنية والخبرة والاعتمادات اللغوية والمصورة هنا."
            : "Refine the lawyer biography, credentials, and supporting image here."}
        </p>
      </div>
      <ContentForm
        key={locale}
        action={saveAboutSectionAction}
        fields={aboutFields(mediaOptions)}
        initialValues={{
          ...initialValue,
          languages: initialValue.languages?.join(", ") ?? "",
        }}
        hiddenFields={{ locale }}
        submitLabel={locale === "ar" ? "حفظ السيرة" : "Save about copy"}
      />
    </Card>
  );
}
