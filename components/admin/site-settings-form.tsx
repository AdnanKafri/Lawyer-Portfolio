"use client";

import { Card } from "@/components/ui/card";
import { ContentForm, type ContentField } from "@/components/admin/content-form";
import { saveSiteSettingsAction } from "@/lib/actions/content";
import type { MediaOption, SiteSettings } from "@/types/domain";

const siteFields = (mediaOptions: MediaOption[]): ContentField[] => [
  { name: "siteName", label: "Site name" },
  { name: "tagline", label: "Tagline", span: 2, type: "textarea", rows: 3 },
  { name: "primaryPhone", label: "Primary phone" },
  { name: "primaryEmail", label: "Primary email", type: "email" },
  { name: "officeAddress", label: "Office address", span: 2, type: "textarea", rows: 3 },
  {
    name: "logoAssetId",
    label: "Logo asset",
    type: "select",
    span: 2,
    helperText: "Choose the image that should appear in the public header when available.",
    options: mediaOptions.map((asset) => ({ label: asset.label, value: asset.id })),
  },
  {
    name: "faviconAssetId",
    label: "Favicon asset",
    type: "select",
    span: 2,
    helperText: "This is stored for later favicon wiring and brand consistency.",
    options: mediaOptions.map((asset) => ({ label: asset.label, value: asset.id })),
  },
];

export function SiteSettingsForm({
  initialValue,
  mediaOptions,
}: {
  initialValue: SiteSettings;
  mediaOptions: MediaOption[];
}) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <p className="text-[0.72rem] uppercase tracking-[0.22em] text-accent">Brand settings</p>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          Keep the public brand identity, contact details, and logo references in one place.
        </p>
      </div>
      <ContentForm
        action={saveSiteSettingsAction}
        fields={siteFields(mediaOptions)}
        initialValues={initialValue}
        hiddenFields={{}}
        submitLabel="Save brand settings"
      />
    </Card>
  );
}
