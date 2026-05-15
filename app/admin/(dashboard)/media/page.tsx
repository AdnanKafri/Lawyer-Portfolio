import Image from "next/image";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
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
          <Card key={asset.id} className="overflow-hidden p-0">
            <div className="relative h-48 w-full bg-black/20">
              {asset.mime_type.startsWith("image/") ? (
                <Image
                  src={asset.publicUrl}
                  alt={asset.alt_text ?? asset.file_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  {asset.mime_type}
                </div>
              )}
            </div>
            <div className="p-5">
              <p className="truncate text-sm font-medium text-foreground">{asset.file_name}</p>
              <p className="mt-2 text-xs text-muted">{asset.alt_text ?? "No alt text"}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
