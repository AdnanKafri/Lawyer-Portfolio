import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { requireAdminContext } from "@/lib/domain/admin";
import { getSocialLinksForAdmin } from "@/lib/domain/content";
import {
  deleteCollectionItemAction,
  moveCollectionItemAction,
  saveCollectionItemAction,
} from "@/lib/actions/content";

export default async function SocialLinksAdminPage() {
  await requireAdminContext();
  const socialLinks = await getSocialLinksForAdmin();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Brand channels"
        title="Social links"
        description="Manage the public links that appear in the footer and support profile discovery."
      />
      <CollectionEditor
        entity="social_links"
        title="Social links"
        description="Add, reorder, or hide the brand channels shown publicly."
        itemLabel="social link"
        itemTypeLabel="brand channel"
        items={socialLinks}
        fields={[
          { name: "platform", label: "Platform" },
          { name: "label", label: "Label" },
          { name: "url", label: "URL", type: "url" },
          { name: "isActive", label: "Active", type: "checkbox", span: 2 },
        ]}
        saveAction={saveCollectionItemAction}
        deleteAction={deleteCollectionItemAction}
        moveAction={moveCollectionItemAction}
        titleField="label"
        subtitleField="url"
      />
    </div>
  );
}
