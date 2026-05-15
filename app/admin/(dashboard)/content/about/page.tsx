import { AboutForm } from "@/components/admin/about-form";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { requireAdminContext } from "@/lib/domain/admin";
import {
  getAboutSectionForLocale,
  getCollectionItems,
  getMediaOptions,
  mapCredentialRows,
} from "@/lib/domain/content";
import {
  deleteCollectionItemAction,
  moveCollectionItemAction,
  saveCollectionItemAction,
} from "@/lib/actions/content";

export default async function AboutAdminPage() {
  const adminContext = await requireAdminContext();
  const [englishAbout, arabicAbout, englishCredentials, arabicCredentials, mediaOptions] =
    await Promise.all([
      getAboutSectionForLocale("en"),
      getAboutSectionForLocale("ar"),
      getCollectionItems("credentials", "en"),
      getCollectionItems("credentials", "ar"),
      getMediaOptions(adminContext.adminUser.organization_id),
    ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="About section"
        title="Professional profile and credentials"
        description="Shape the biography, languages, and credential list that appear under the hero across both locales."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <AboutForm locale="en" initialValue={englishAbout} mediaOptions={mediaOptions} />
        <AboutForm locale="ar" initialValue={arabicAbout} mediaOptions={mediaOptions} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <CollectionEditor
          entity="credentials"
          title="English credentials"
          description="List the credentials and professional markers that reinforce the profile in English."
          itemLabel="credential"
          itemTypeLabel="credential"
          locale="en"
          items={mapCredentialRows(englishCredentials)}
          fields={[
            { name: "title", label: "Title" },
            { name: "description", label: "Description", type: "textarea", span: 2, rows: 4 },
            { name: "isActive", label: "Active", type: "checkbox", span: 2, helperText: "Hide this credential from the public site without deleting it." },
          ]}
          saveAction={saveCollectionItemAction}
          deleteAction={deleteCollectionItemAction}
          moveAction={moveCollectionItemAction}
          titleField="title"
          subtitleField="description"
        />
        <CollectionEditor
          entity="credentials"
          title="Arabic credentials"
          description="Maintain the Arabic credential list with the same care and order."
          itemLabel="credential"
          itemTypeLabel="credential"
          locale="ar"
          items={mapCredentialRows(arabicCredentials)}
          fields={[
            { name: "title", label: "Title" },
            { name: "description", label: "Description", type: "textarea", span: 2, rows: 4 },
            { name: "isActive", label: "Active", type: "checkbox", span: 2, helperText: "Hide this credential from the public site without deleting it." },
          ]}
          saveAction={saveCollectionItemAction}
          deleteAction={deleteCollectionItemAction}
          moveAction={moveCollectionItemAction}
          titleField="title"
          subtitleField="description"
        />
      </div>
    </div>
  );
}
