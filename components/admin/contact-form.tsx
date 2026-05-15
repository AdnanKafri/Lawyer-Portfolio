"use client";

import { Card } from "@/components/ui/card";
import { ContentForm, type ContentField } from "@/components/admin/content-form";
import { saveContactInfoAction } from "@/lib/actions/content";
import type { ContactInfo } from "@/types/domain";

const contactFields: ContentField[] = [
  { name: "eyebrow", label: "Eyebrow" },
  { name: "title", label: "Heading", span: 2, type: "textarea", rows: 3 },
  { name: "description", label: "Description", span: 2, type: "textarea", rows: 5 },
  { name: "phone", label: "Phone", type: "text" },
  { name: "whatsapp", label: "WhatsApp", type: "text" },
  { name: "email", label: "Email", type: "email" },
  { name: "responseTimeLabel", label: "Response label", type: "text", placeholder: "Within 24 hours" },
  { name: "address", label: "Address", span: 2, type: "textarea", rows: 3 },
  { name: "mapEmbedUrl", label: "Map embed URL", span: 2, type: "url", helperText: "Paste a Google Maps embed URL if you want the contact section to include a live map." },
];

export function ContactInfoForm({
  locale,
  initialValue,
}: {
  locale: "en" | "ar";
  initialValue: ContactInfo;
}) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-accent">
          {locale === "ar" ? "النسخة العربية" : "English version"}
        </p>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          {locale === "ar"
            ? "حدّث طرق التواصل ونص الدعوة والسرعة المتوقعة للرد."
            : "Keep the contact block current, direct, and reassuring for prospective clients."}
        </p>
      </div>
      <ContentForm
        key={locale}
        action={saveContactInfoAction}
        fields={contactFields}
        initialValues={initialValue}
        hiddenFields={{ locale }}
        submitLabel={locale === "ar" ? "حفظ التواصل" : "Save contact details"}
      />
    </Card>
  );
}
