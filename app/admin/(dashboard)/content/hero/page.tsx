import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { HeroForm } from "@/components/admin/hero-form";
import { requireAdminContext } from "@/lib/domain/admin";
import { getHeroSectionForLocale, getMediaOptions } from "@/lib/domain/content";

export default async function HeroAdminPage() {
  const adminContext = await requireAdminContext();
  const mediaOptions = await getMediaOptions(adminContext.adminUser.organization_id);
  const [englishHero, arabicHero] = await Promise.all([
    getHeroSectionForLocale("en"),
    getHeroSectionForLocale("ar"),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Hero editor"
        title="Luxury first impression"
        description="Control the opening statement, primary calls to action, and lead image for both locales from one place."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <HeroForm locale="en" initialValue={englishHero} mediaOptions={mediaOptions} />
        <HeroForm locale="ar" initialValue={arabicHero} mediaOptions={mediaOptions} />
      </div>
    </div>
  );
}
