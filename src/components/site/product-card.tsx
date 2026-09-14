import Link from "next/link";

import { AssetImage } from "@/components/ui/asset-image";
import { Badge } from "@/components/ui/layout";
import type { Locale, PublicProduct, StockStatus } from "@/lib/domain/types";
import { localize } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/**
 * PUBLIC PRODUCT CARD
 *
 * Takes `PublicProduct` by type, not `Product`. That is the guarantee: this
 * component cannot render a wholesale price because it is never handed one.
 * Pricing is replaced by a B2B access prompt, per the public-pricing policy.
 */

const AVAILABILITY: Record<StockStatus, { label: string; tone: "success" | "warning" | "danger" }> =
  {
    "in-stock": { label: "In stock", tone: "success" },
    "low-stock": { label: "Limited stock", tone: "warning" },
    "out-of-stock": { label: "Out of stock", tone: "danger" },
  };

export function ProductCard({
  product,
  brandName,
  locale = "en",
  priority = false,
}: {
  product: PublicProduct;
  brandName?: string;
  locale?: Locale;
  priority?: boolean;
}) {
  const availability = AVAILABILITY[product.availability];

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-line",
        "bg-surface shadow-card transition-[transform,box-shadow,border-color]",
        "duration-[var(--duration-base)] ease-[var(--ease-out-quint)]",
        "hover:-translate-y-1 hover:border-accent/35 hover:shadow-lift",
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-surface-muted p-5">
        {/* Soft pedestal glow, echoing the hero's lighting. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-6 bottom-4 h-6 rounded-[50%] bg-accent/20 blur-xl"
        />
        <div className="relative size-full transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-quint)] group-hover:scale-[1.04]">
          <AssetImage
            asset={product.image}
            fallbackLabel={localize(product.name, locale)}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
            priority={priority}
            fallbackRatio={1}
          />
        </div>

        {product.featured ? (
          <Badge tone="gold" className="absolute start-3 top-3">
            Featured
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 border-t border-line p-4">
        {brandName ? (
          <span className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-ink-subtle">
            {brandName}
          </span>
        ) : null}

        <h3 className="text-pretty text-sm font-bold leading-snug text-ink">
          {/* Stretched link keeps the whole card clickable with one tab stop. */}
          <Link href={`/products/${product.slug}`} className="before:absolute before:inset-0">
            {localize(product.name, locale)}
          </Link>
        </h3>

        <p className="font-mono text-xs text-ink-subtle">{product.sku}</p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <Badge tone={availability.tone}>{availability.label}</Badge>
          {/* Deliberately not a price. Public visitors do not see wholesale rates. */}
          <span className="text-xs font-semibold text-accent-strong">
            B2B pricing
          </span>
        </div>
      </div>
    </article>
  );
}
