import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CollectionEditor } from "@/components/admin/collection-editor";
import type { ContentField } from "@/components/admin/content-form";
import { requireAdminContext } from "@/lib/domain/admin";
import { getCollectionItems, mapFaqRows } from "@/lib/domain/content";
import {
  deleteCollectionItemAction,
  moveCollectionItemAction,
  saveCollectionItemAction,
} from "@/lib/actions/content";

export default async function FaqAdminPage() {
  await requireAdminContext();
  const [englishFaqs, arabicFaqs] = await Promise.all([
    getCollectionItems("faqs", "en"),
    getCollectionItems("faqs", "ar"),
  ]);

  const fields: ContentField[] = [
    { name: "question", label: "Question", span: 2, type: "textarea", rows: 3 },
    { name: "answer", label: "Answer", span: 2, type: "textarea", rows: 6 },
    { name: "isActive", label: "Active", type: "checkbox", span: 2 },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="FAQ"
        title="FAQ management"
        description="Keep the FAQ concise, credible, and useful for both prospects and search visibility."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <CollectionEditor
          entity="faqs"
          title="English FAQs"
          description="Keep the English questions direct and client-focused."
          itemLabel="FAQ"
          itemTypeLabel="question"
          locale="en"
          items={mapFaqRows(englishFaqs)}
          fields={fields}
          saveAction={saveCollectionItemAction}
          deleteAction={deleteCollectionItemAction}
          moveAction={moveCollectionItemAction}
          titleField="question"
          subtitleField="answer"
        />
        <CollectionEditor
          entity="faqs"
          title="Arabic FAQs"
          description="Keep the Arabic questions direct and client-focused."
          itemLabel="FAQ"
          itemTypeLabel="question"
          locale="ar"
          items={mapFaqRows(arabicFaqs)}
          fields={fields}
          saveAction={saveCollectionItemAction}
          deleteAction={deleteCollectionItemAction}
          moveAction={moveCollectionItemAction}
          titleField="question"
          subtitleField="answer"
        />
      </div>
    </div>
  );
}
