"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { LOGO } from "@/lib/assets";
import { cn } from "@/lib/utils";

/**
 * The Kogay Karwan lockup.
 *
 * Renders the supplied logo file from the asset manifest. If that file is not
 * in place yet it falls back to a plain TYPOGRAPHIC wordmark — deliberately not
 * an invented monogram. A stand-in logo would quietly become the brand; a text
 * wordmark reads as "artwork pending" and can never be mistaken for the mark.
 */

export function Logo({
  variant = "dark",
  className,
  showTagline = true,
  tagline = "Wholesale Trade & Logistics",
  businessName = "Kogay Karwan",
  priority = false,
}: {
  /** `dark` = navy wordmark for light surfaces. `light` = reversed. */
  variant?: "dark" | "light";
  className?: string;
  showTagline?: boolean;
  tagline?: string;
  businessName?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const asset = variant === "light" ? LOGO.lockupLight : LOGO.lockup;

  if (failed) {
    return (
      <span className={cn("flex flex-col justify-center leading-none", className)}>
        <span
          className={cn(
            "text-lg font-extrabold tracking-tight sm:text-xl",
            variant === "light" ? "text-white" : "text-ink",
          )}
        >
          {businessName}
        </span>
        {showTagline ? (
          <span
            className={cn(
              "mt-1 text-[0.6875rem] font-medium tracking-wide",
              variant === "light" ? "text-white/65" : "text-ink-subtle",
            )}
          >
            {tagline}
          </span>
        ) : null}
      </span>
    );
  }

  return (
    <Image
      src={asset.src}
      alt={`${businessName} — ${tagline}`}
      width={asset.width}
      height={asset.height}
      priority={priority}
      onError={() => setFailed(true)}
      className={cn("h-11 w-auto object-contain", className)}
    />
  );
}

/** The logo as the site's home link — header and footer both use this. */
export function LogoLink({
  variant = "dark",
  className,
  businessName,
  tagline,
  priority,
}: {
  variant?: "dark" | "light";
  className?: string;
  businessName?: string;
  tagline?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={`${businessName ?? "Kogay Karwan"} — home`}
      className={cn(
        "inline-flex shrink-0 items-center rounded-lg transition-opacity",
        "duration-[var(--duration-quick)] hover:opacity-80",
        className,
      )}
    >
      <Logo
        variant={variant}
        businessName={businessName}
        tagline={tagline}
        priority={priority}
      />
    </Link>
  );
}
