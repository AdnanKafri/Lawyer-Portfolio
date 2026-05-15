import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CollectionEditor } from "@/components/admin/collection-editor";
import type { ContentField } from "@/components/admin/content-form";
import { requireAdminContext } from "@/lib/domain/admin";
import { getCollectionItems, mapTestimonialRows } from "@/lib/domain/content";
import {
  deleteCollectionItemAction,
  moveCollectionItemAction,
  saveCollectionItemAction,
} from "@/lib/actions/content";

export default async function TestimonialsAdminPage() {
  await requireAdminContext();
  const [englishTestimonials, arabicTestimonials] = await Promise.all([
    getCollectionItems("testimonials", "en"),
    getCollectionItems("testimonials", "ar"),
  ]);

  const fields: ContentField[] = [
    { name: "quote", label: "Quote", span: 2, type: "textarea", rows: 6 },
    { name: "author", label: "Author" },
    { name: "role", label: "Role" },
    { name: "rating", label: "Rating", type: "number", helperText: "Optional, between 1 and 5." },
    { name: "isActive", label: "Active", type: "checkbox", span: 2 },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Testimonials"
        title="Client review management"
        description="Manage the testimonial cards that reinforce credibility and calm reassurance."
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <CollectionEditor
          entity="testimonials"
          title="English testimonials"
          description="Curate the English testimonials and keep the order intentional."
          itemLabel="testimonial"
          itemTypeLabel="testimonial"
          locale="en"
          items={mapTestimonialRows(englishTestimonials)}
          fields={fields}
          saveAction={saveCollectionItemAction}
          deleteAction={deleteCollectionItemAction}
          moveAction={moveCollectionItemAction}
          titleField="author"
          subtitleField="quote"
        />
        <CollectionEditor
          entity="testimonials"
          title="Arabic testimonials"
          description="Curate the Arabic testimonials and keep the order intentional."
          itemLabel="testimonial"
          itemTypeLabel="testimonial"
          locale="ar"
          items={mapTestimonialRows(arabicTestimonials)}
          fields={fields}
          saveAction={saveCollectionItemAction}
          deleteAction={deleteCollectionItemAction}
          moveAction={moveCollectionItemAction}
          titleField="author"
          subtitleField="quote"
        />
      </div>
    </div>
  );
}
