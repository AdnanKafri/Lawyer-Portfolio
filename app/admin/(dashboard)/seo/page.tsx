import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SeoSettingsForm } from "@/components/admin/seo-form";
import { requireAdminContext } from "@/lib/domain/admin";
import { getMediaOptions, getSeoSettingsForLocale } from "@/lib/domain/content";

const pages = [
  { pageKey: "home", label: "Homepage", description: "Primary search metadata for the public home page." },
  { pageKey: "privacy", label: "Privacy policy", description: "Metadata for the privacy policy page." },
  { pageKey: "terms", label: "Terms", description: "Metadata for the terms and conditions page." },
];

export default async function SeoAdminPage() {
  const adminContext = await requireAdminContext();
  const mediaOptions = await getMediaOptions(adminContext.adminUser.organization_id);

  const seoMatrix = await Promise.all(
    pages.map(async (page) => ({
      ...page,
      en: await getSeoSettingsForLocale("en", page.pageKey),
      ar: await getSeoSettingsForLocale("ar", page.pageKey),
    })),
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Search"
        title="SEO management"
        description="Edit metadata, share previews, and canonical paths without leaving the dashboard."
      />
      <div className="space-y-8">
        {seoMatrix.map((page) => (
          <section key={page.pageKey} className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.22em] text-accent">
                  {page.label}
                </p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  {page.description}
                </p>
              </div>
            </div>
            <div className="grid gap-6 xl:grid-cols-2">
              <SeoSettingsForm
                locale="en"
                pageKey={page.pageKey}
                initialValue={page.en}
                mediaOptions={mediaOptions}
              />
              <SeoSettingsForm
                locale="ar"
                pageKey={page.pageKey}
                initialValue={page.ar}
                mediaOptions={mediaOptions}
              />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
