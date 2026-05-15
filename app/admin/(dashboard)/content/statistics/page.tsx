import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CollectionEditor } from "@/components/admin/collection-editor";
import type { ContentField } from "@/components/admin/content-form";
import { requireAdminContext } from "@/lib/domain/admin";
import { getCollectionItems, mapStatisticRows } from "@/lib/domain/content";
import {
  deleteCollectionItemAction,
  moveCollectionItemAction,
  saveCollectionItemAction,
} from "@/lib/actions/content";

export default async function StatisticsAdminPage() {
  await requireAdminContext();
  const [englishStatistics, arabicStatistics] = await Promise.all([
    getCollectionItems("statistics", "en"),
    getCollectionItems("statistics", "ar"),
  ]);

  const fields: ContentField[] = [
    { name: "label", label: "Label" },
    { name: "value", label: "Value" },
    { name: "description", label: "Description", span: 2, type: "textarea", rows: 4 },
    { name: "isActive", label: "Active", type: "checkbox", span: 2 },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Trust signals"
        title="Statistics management"
        description="Tune the trust metrics that appear under the hero and help establish authority at a glance."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <CollectionEditor
          entity="statistics"
          title="English statistics"
          description="Edit the English trust metrics."
          itemLabel="statistic"
          itemTypeLabel="trust metric"
          locale="en"
          items={mapStatisticRows(englishStatistics)}
          fields={fields}
          saveAction={saveCollectionItemAction}
          deleteAction={deleteCollectionItemAction}
          moveAction={moveCollectionItemAction}
          titleField="label"
          subtitleField="description"
        />
        <CollectionEditor
          entity="statistics"
          title="Arabic statistics"
          description="Edit the Arabic trust metrics."
          itemLabel="statistic"
          itemTypeLabel="trust metric"
          locale="ar"
          items={mapStatisticRows(arabicStatistics)}
          fields={fields}
          saveAction={saveCollectionItemAction}
          deleteAction={deleteCollectionItemAction}
          moveAction={moveCollectionItemAction}
          titleField="label"
          subtitleField="description"
        />
      </div>
    </div>
  );
}
