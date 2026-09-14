"use client";

import Image from "next/image";
import { useState } from "react";

import { placeholderImage } from "@/lib/assets";
import type { ImageRef } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/**
 * Renders an asset from the manifest, falling back to a labelled placeholder
 * when the file has not been dropped into /public yet.
 *
 * Two rules this component exists to enforce:
 *  1. Packaging art is NEVER distorted. Every variant uses object-contain, so a
 *     mismatched aspect ratio letterboxes instead of stretching the label.
 *  2. A missing file is visible as "pending", not as a broken-image glyph, and
 *     it reserves exactly the same box — so layout never shifts when the real
 *     asset lands (CLS stays at zero between the two states).
 */

type AssetImageProps = {
  asset: ImageRef | null;
  /** Label drawn on the placeholder when `asset` is missing or fails to load. */
  fallbackLabel: string;
  className?: string;
  /** `sizes` is required for fill images to avoid over-fetching on mobile. */
  sizes?: string;
  priority?: boolean;
  /** `fill` stretches to the positioned parent; `intrinsic` uses width/height. */
  layout?: "fill" | "intrinsic";
  width?: number;
  height?: number;
  fallbackRatio?: number;
};

export function AssetImage({
  asset,
  fallbackLabel,
  className,
  sizes = "(max-width: 768px) 50vw, 25vw",
  priority = false,
  layout = "fill",
  width,
  height,
  fallbackRatio = 3 / 4,
}: AssetImageProps) {
  const [failed, setFailed] = useState(false);

  const usePlaceholder = !asset || failed;
  const src = usePlaceholder
    ? placeholderImage(fallbackLabel, fallbackRatio)
    : asset.src;
  const alt = asset?.alt ?? fallbackLabel;

  // Data-URI placeholders must bypass the optimizer, which cannot process them.
  const unoptimized = usePlaceholder;

  if (layout === "intrinsic") {
    return (
      <Image
        src={src}
        alt={alt}
        width={width ?? asset?.width ?? 400}
        height={height ?? asset?.height ?? 400}
        priority={priority}
        unoptimized={unoptimized}
        onError={() => setFailed(true)}
        className={cn("object-contain", className)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={unoptimized}
      onError={() => setFailed(true)}
      className={cn("object-contain", className)}
    />
  );
}
