import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MediaAssetCard } from "@/components/admin/media-asset-card";
import { MediaUploadForm } from "@/components/admin/media-upload-form";
import { Card } from "@/components/ui/card";
import { requireAdminContext } from "@/lib/domain/admin";
import { listMediaAssets } from "@/lib/domain/media";

export default async function AdminMediaPage() {
  const adminContext = await requireAdminContext();
  const assets = await listMediaAssets(adminContext.adminUser.organization_id);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Media"
        title="Image library"
        description="Upload and inspect the images used across the hero, about section, SEO previews, and brand settings."
      />
      <Card className="p-7">
        <div className="mt-6">
          <MediaUploadForm />
        </div>
      </Card>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {assets.map((asset) => (
          <MediaAssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
}
