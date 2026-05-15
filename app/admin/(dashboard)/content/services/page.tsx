import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { requireAdminContext } from "@/lib/domain/admin";
import { getCollectionItems, mapServiceRows } from "@/lib/domain/content";
import {
  deleteCollectionItemAction,
  moveCollectionItemAction,
  saveCollectionItemAction,
} from "@/lib/actions/content";

const iconOptions = [
  { label: "Scale", value: "scale" },
  { label: "Shield", value: "shield" },
  { label: "Scroll", value: "scroll" },
  { label: "Briefcase", value: "briefcase" },
  { label: "Landmark", value: "landmark" },
  { label: "File", value: "file" },
];

export default async function ServicesAdminPage() {
  await requireAdminContext();
  const [englishServices, arabicServices] = await Promise.all([
    getCollectionItems("services", "en"),
    getCollectionItems("services", "ar"),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Practice areas"
        title="Services management"
        description="Keep the practice area list focused, ordered, and easy to expand as the firm grows."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <CollectionEditor
          entity="services"
          title="English services"
          description="Edit the English practice areas shown on the public site."
          itemLabel="service"
          itemTypeLabel="practice area"
          locale="en"
          items={mapServiceRows(englishServices)}
          fields={[
            { name: "title", label: "Title" },
            { name: "slug", label: "Slug", helperText: "Optional. The system can generate one from the title." },
            {
              name: "iconKey",
              label: "Icon",
              type: "select",
              options: iconOptions,
            },
            { name: "description", label: "Description", span: 2, type: "textarea", rows: 4 },
            { name: "isActive", label: "Active", type: "checkbox", span: 2 },
          ]}
          saveAction={saveCollectionItemAction}
          deleteAction={deleteCollectionItemAction}
          moveAction={moveCollectionItemAction}
          titleField="title"
          subtitleField="description"
        />
        <CollectionEditor
          entity="services"
          title="Arabic services"
          description="Edit the Arabic practice areas shown on the public site."
          itemLabel="service"
          itemTypeLabel="practice area"
          locale="ar"
          items={mapServiceRows(arabicServices)}
          fields={[
            { name: "title", label: "Title" },
            { name: "slug", label: "Slug", helperText: "Optional. The system can generate one from the title." },
            {
              name: "iconKey",
              label: "Icon",
              type: "select",
              options: iconOptions,
            },
            { name: "description", label: "Description", span: 2, type: "textarea", rows: 4 },
            { name: "isActive", label: "Active", type: "checkbox", span: 2 },
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
