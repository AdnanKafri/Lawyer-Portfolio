"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export function PublicMedia({
  src,
  alt,
  sizes,
  priority = false,
  className,
  containerClassName,
  fallbackClassName,
  aspectRatio = 4 / 3,
  minAspectRatio = 0.8,
  maxAspectRatio = 1.65,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
  fallbackClassName?: string;
  aspectRatio?: number;
  minAspectRatio?: number;
  maxAspectRatio?: number;
}) {
  const [hasError, setHasError] = useState(false);
  const [displayAspectRatio, setDisplayAspectRatio] = useState(aspectRatio);

  const updateAspectRatio = (naturalWidth: number, naturalHeight: number) => {
    if (!naturalWidth || !naturalHeight) {
      return;
    }

    setDisplayAspectRatio(
      Math.min(
        maxAspectRatio,
        Math.max(minAspectRatio, naturalWidth / naturalHeight),
      ),
    );
  };

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("relative w-full overflow-hidden", containerClassName)}
        style={{ aspectRatio: displayAspectRatio }}
      >
        <div className={cn("absolute inset-0", fallbackClassName)} />
      </div>
    );
  }

  return (
    <div
      className={cn("relative w-full overflow-hidden", containerClassName)}
      style={{ aspectRatio: displayAspectRatio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        unoptimized
        sizes={sizes}
        className={className}
        onLoad={(event) =>
          updateAspectRatio(
            event.currentTarget.naturalWidth,
            event.currentTarget.naturalHeight,
          )
        }
        onError={() => setHasError(true)}
      />
    </div>
  );
}
