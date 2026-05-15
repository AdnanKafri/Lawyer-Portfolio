import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { requireAdminContext } from "@/lib/domain/admin";
import { getMediaOptions, getSiteSettingsForAdmin } from "@/lib/domain/content";

export default async function SettingsAdminPage() {
  const adminContext = await requireAdminContext();
  const [siteSettings, mediaOptions] = await Promise.all([
    getSiteSettingsForAdmin(),
    getMediaOptions(adminContext.adminUser.organization_id),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Brand"
        title="Site settings"
        description="Keep the brand name, contact details, and logo references in a single authoritative place."
        actions={
          <Link
            href="/admin/content/social-links"
            className="inline-flex items-center rounded-full border border-border bg-white/[0.04] px-5 py-3 text-sm text-foreground transition hover:border-accent hover:text-accent"
          >
            Manage social links
          </Link>
        }
      />
      <SiteSettingsForm initialValue={siteSettings} mediaOptions={mediaOptions} />
    </div>
  );
}
