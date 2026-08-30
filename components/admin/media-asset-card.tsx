"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  deleteMediaAssetAction,
  type MediaDeleteActionState,
} from "@/lib/actions/media";
import { defaultFormActionState } from "@/lib/actions/form-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { MediaAsset } from "@/lib/domain/media";

function localeLabel(locale: MediaAsset["locale"]) {
  if (locale === "ar") {
    return "Arabic";
  }

  if (locale === "en") {
    return "English";
  }

  return "All locales";
}

export function MediaAssetCard({ asset }: { asset: MediaAsset }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const deleteFormRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState<MediaDeleteActionState, FormData>(
    deleteMediaAssetAction,
    defaultFormActionState,
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error" && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  const usageDescription =
    asset.usages.length > 0
      ? `This media is currently used in: ${asset.usages.map((usage) => usage.label).join(", ")}. Deleting it will clear those references before removing the asset.`
      : "This media is not currently used. The storage object and media record will be permanently deleted.";

  return (
    <>
      <Card className="overflow-hidden p-0">
        <div className="relative aspect-[16/10] w-full bg-black/20">
          {asset.mime_type.startsWith("image/") && !previewError ? (
            <Image
              src={asset.publicUrl}
              alt={asset.alt_text ?? asset.file_name}
              fill
              unoptimized
              sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
              className="object-contain"
              onError={() => setPreviewError(true)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-5 text-center text-sm text-muted-foreground">
              <span>
                {previewError ? "Preview unavailable" : asset.mime_type}
              </span>
              {previewError ? (
                <a
                  href={asset.publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent underline-offset-4 hover:underline"
                >
                  Open original file
                </a>
              ) : null}
            </div>
          )}
        </div>
        <div className="space-y-4 p-5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {asset.file_name}
            </p>
            <p className="mt-2 text-xs text-muted">
              {asset.alt_text ?? "No alt text"}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted">
              {localeLabel(asset.locale)}
            </p>
          </div>
          {asset.usages.length > 0 ? (
            <p className="text-xs leading-6 text-accent">
              Used in: {asset.usages.map((usage) => usage.label).join(", ")}
            </p>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-danger hover:bg-danger/10 hover:text-danger"
            onClick={() => setIsDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete media
          </Button>
        </div>
      </Card>
      <form ref={deleteFormRef} action={formAction} className="hidden">
        <input type="hidden" name="assetId" value={asset.id} />
        <input type="hidden" name="confirmed" value="true" />
      </form>
      <ConfirmDialog
        open={isDialogOpen}
        title="Delete this media?"
        description={usageDescription}
        confirmLabel="Delete media"
        onClose={() => setIsDialogOpen(false)}
        onConfirm={() => {
          setIsDialogOpen(false);
          deleteFormRef.current?.requestSubmit();
        }}
      />
    </>
  );
}
