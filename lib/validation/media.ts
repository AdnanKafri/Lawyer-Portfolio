export const MAX_MEDIA_UPLOAD_BYTES = 50 * 1024 * 1024;

const ALLOWED_MEDIA_TYPES: Record<string, readonly string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "image/avif": ["avif"],
  "image/gif": ["gif"],
} as const;

export function validateMediaFile(file: File) {
  if (file.size === 0) {
    return "Please select a file to upload.";
  }

  if (file.size > MAX_MEDIA_UPLOAD_BYTES) {
    return "The image must be 50 MB or smaller.";
  }

  const extensions = ALLOWED_MEDIA_TYPES[file.type];
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extensions || !extension || !extensions.includes(extension)) {
    return "Upload a JPG, PNG, WebP, AVIF, or GIF image.";
  }

  return null;
}
