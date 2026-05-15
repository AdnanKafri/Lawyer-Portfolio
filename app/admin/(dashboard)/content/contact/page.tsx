import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ContactInfoForm } from "@/components/admin/contact-form";
import { requireAdminContext } from "@/lib/domain/admin";
import { getContactInfoForLocale } from "@/lib/domain/content";

export default async function ContactAdminPage() {
  await requireAdminContext();
  const [englishContact, arabicContact] = await Promise.all([
    getContactInfoForLocale("en"),
    getContactInfoForLocale("ar"),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Contact"
        title="Contact and inquiry details"
        description="Keep the public contact block accurate and reassuring for prospective clients."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <ContactInfoForm locale="en" initialValue={englishContact} />
        <ContactInfoForm locale="ar" initialValue={arabicContact} />
      </div>
    </div>
  );
}
