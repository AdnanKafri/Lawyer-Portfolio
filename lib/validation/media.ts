export const MAX_MEDIA_UPLOAD_BYTES = 50 * 1024 * 1024;

const ALLOWED_MEDIA_TYPES: Record<string, readonly string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/avif": ["avif"],
  "image/gif": ["gif"],
} as const;

export type MediaFileMetadata = {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
};

export function validateMediaMetadata({
  fileName,
  mimeType,
  sizeBytes,
}: MediaFileMetadata) {
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) {
    return "Please select a file to upload.";
  }

  if (sizeBytes > MAX_MEDIA_UPLOAD_BYTES) {
    return "The image must be 50 MB or smaller.";
  }

  const extensions = ALLOWED_MEDIA_TYPES[mimeType];
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (!extensions || !extension || !extensions.includes(extension)) {
    return "Upload a JPG, PNG, WebP, AVIF, or GIF image.";
  }

  return null;
}

export function validateMediaFile(file: File) {
  return validateMediaMetadata({
    fileName: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
  });
}
