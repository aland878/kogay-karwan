"use client";

import Link from "next/link";

import { AssetImage } from "@/components/ui/asset-image";
import { Container } from "@/components/ui/layout";
import type { Brand } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/**
 * TRUSTED BRANDS
 *
 * Desktop: a single elegant row, as in the reference.
 * Mobile: a slow marquee, duplicated once so the loop has no visible seam.
 *
 * The duplicate copy is `aria-hidden` and the marquee is wrapped in a list that
 * exposes each brand exactly once, so a screen reader hears eight brands rather
 * than sixteen. The animation pauses on hover and is removed outright under
 * `prefers-reduced-motion`, where it degrades to a normal horizontal scroller.
 */

export function TrustedBrands({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null;

  return (
    <section
      aria-labelledby="trusted-brands-heading"
      className="border-y border-line bg-surface/60 py-6 backdrop-blur-sm"
    >
      <Container size="wide">
        <div className="flex items-center gap-6 lg:gap-10">
          <h2
            id="trusted-brands-heading"
            className="hidden shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-ink-subtle sm:flex"
          >
            Trusted Brands
            <span aria-hidden="true" className="h-px w-5 bg-accent/45" />
          </h2>

          {/* Desktop row */}
          <ul className="hidden min-w-0 flex-1 items-center justify-between gap-6 lg:flex">
            {brands.map((brand) => (
              <li key={brand.id}>
                <BrandMark brand={brand} />
              </li>
            ))}
          </ul>

          {/* Mobile / tablet marquee */}
          <div className="relative min-w-0 flex-1 overflow-hidden lg:hidden">
            {/* Edge fades so logos dissolve rather than clip at the gutter. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 start-0 z-10 w-10 bg-gradient-to-e from-canvas to-transparent"
              style={{
                background:
                  "linear-gradient(to right, var(--canvas), transparent)",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 end-0 z-10 w-10"
              style={{
                background: "linear-gradient(to left, var(--canvas), transparent)",
              }}
            />

            <div className="group flex w-max items-center gap-8 motion-safe:animate-[brand-marquee_26s_linear_infinite] motion-safe:hover:[animation-play-state:paused]">
              <ul className="flex shrink-0 items-center gap-8">
                {brands.map((brand) => (
                  <li key={brand.id}>
                    <BrandMark brand={brand} />
                  </li>
                ))}
              </ul>
              {/* Seam filler — hidden from assistive tech. */}
              <ul aria-hidden="true" className="flex shrink-0 items-center gap-8">
                {brands.map((brand) => (
                  <li key={`dupe-${brand.id}`}>
                    <BrandMark brand={brand} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function BrandMark({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/brands/${brand.slug}`}
      className={cn(
        "relative block h-8 w-24 shrink-0 opacity-70 grayscale transition-all",
        "duration-[var(--duration-base)] ease-[var(--ease-out-quint)]",
        "hover:opacity-100 hover:grayscale-0 sm:h-9 sm:w-28",
      )}
    >
      <AssetImage
        asset={brand.logo}
        fallbackLabel={brand.name}
        sizes="120px"
        fallbackRatio={3 / 1}
      />
      <span className="sr-only">{brand.name}</span>
    </Link>
  );
}
