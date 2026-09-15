"use client";

import Link from "next/link";
import { useState } from "react";

import { AssetImage } from "@/components/ui/asset-image";
import { Badge } from "@/components/ui/layout";
import { useCart } from "@/lib/cart/cart-context";
import type { Locale, Money, Product, StockStatus } from "@/lib/domain/types";
import { localize, maxOrderableQuantity, stockStatus } from "@/lib/domain/types";
import { t } from "@/lib/i18n/dictionary";
import { cn, formatMoney } from "@/lib/utils";

/**
 * B2B PRODUCT CARD
 *
 * Unlike the public card this one takes a full `Product` and shows wholesale
 * pricing — it only ever renders inside the authenticated portal.
 *
 * The quantity stepper is the primary interaction for a wholesale buyer, so it
 * is on the card itself: reaching a product detail page to order 12 cases is
 * friction on every single line.
 */

const AVAILABILITY = {
  "in-stock": { key: "stock.in", tone: "success" },
  "low-stock": { key: "stock.low", tone: "warning" },
  "out-of-stock": { key: "stock.out", tone: "danger" },
} as const satisfies Record<
  StockStatus,
  { key: "stock.in" | "stock.low" | "stock.out"; tone: "success" | "warning" | "danger" }
>;

export function B2BProductCard({
  product,
  brandName,
  locale = "ku",
}: {
  product: Product;
  brandName?: string;
  locale?: Locale;
}) {
  const { quantityOf, add, setQuantity, hydrated } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const availability = AVAILABILITY[stockStatus(product)];
  const soldOut = product.stockQuantity <= 0;
  const inCart = hydrated ? quantityOf(product.id) : 0;
  const orderCeiling = maxOrderableQuantity(product);

  const unitPrice: Money = product.discount
    ? { ...product.wholesalePrice, amount: product.wholesalePrice.amount - product.discount.amount }
    : product.wholesalePrice;

  const onAdd = () => {
    add(product.id, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="relative aspect-square w-full bg-surface-muted p-5">
        <div className="relative size-full">
          <AssetImage
            asset={product.image}
            fallbackLabel={localize(product.name, locale)}
            sizes="(max-width: 640px) 45vw, 22vw"
            fallbackRatio={1}
          />
        </div>

        {product.discount ? (
          <Badge tone="gold" className="absolute start-3 top-3">
            {t("price.save", locale)} {formatMoney(product.discount)}
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
          <Link
            href={`/b2b/products/${product.slug}`}
            className="underline-offset-4 hover:underline"
          >
            {localize(product.name, locale)}
          </Link>
        </h3>

        <p className="font-mono text-xs text-ink-subtle">{product.sku}</p>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-ink">
            {formatMoney(unitPrice)}
          </span>
          {product.discount ? (
            <span className="text-sm text-ink-subtle line-through">
              {formatMoney(product.wholesalePrice)}
            </span>
          ) : null}
          <span className="text-xs text-ink-subtle">
            / {product.unit}
            {product.unitsPerCase ? ` of ${product.unitsPerCase}` : ""}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Badge tone={availability.tone}>{t(availability.key, locale)}</Badge>
          {/* A count is shown only where one is actually tracked. The
              imported price list records availability, not quantities. */}
          {!soldOut && product.stockTracked ? (
            <span className="text-xs tabular-nums text-ink-subtle">
              {product.stockQuantity} available
            </span>
          ) : null}
        </div>

        <div className="mt-auto pt-3">
          {soldOut ? (
            <p className="rounded-lg bg-surface-muted px-3 py-2.5 text-center text-sm font-medium text-ink-subtle">
              {t("stock.unavailable", locale)}
            </p>
          ) : inCart > 0 ? (
            <QuantityStepper
              value={inCart}
              max={orderCeiling}
              onChange={(next) => setQuantity(product.id, next)}
              label={`Quantity of ${localize(product.name, locale)}`}
            />
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className={cn(
                "w-full rounded-lg px-3 py-2.5 text-sm font-bold text-white",
                "bg-[linear-gradient(135deg,var(--color-gold-400),var(--color-gold-600))]",
                "transition-transform duration-[var(--duration-quick)] hover:-translate-y-px",
                justAdded && "opacity-80",
              )}
            >
              {justAdded ? t("action.added", locale) : t("action.addToCart", locale)}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Quantity stepper.
 *
 * A real number input sits between the buttons so a buyer ordering 240 cases
 * can type it rather than press "+" 240 times. Value is clamped to stock on
 * commit, not on each keystroke — clamping mid-typing makes "12" impossible to
 * enter when the max is 20.
 */
export function QuantityStepper({
  value,
  max,
  onChange,
  label,
}: {
  value: number;
  max: number;
  onChange: (next: number) => void;
  label: string;
}) {
  const [draft, setDraft] = useState(String(value));

  const commit = (raw: string) => {
    const parsed = Number.parseInt(raw, 10);
    const next = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), max) : value;
    onChange(next);
    setDraft(String(next || 0));
  };

  return (
    <div className="flex items-center gap-1 rounded-lg border border-line p-1">
      <StepButton
        label="Decrease quantity"
        onClick={() => {
          const next = Math.max(value - 1, 0);
          onChange(next);
          setDraft(String(next));
        }}
      >
        −
      </StepButton>

      <label className="sr-only" htmlFor={`qty-${label}`}>
        {label}
      </label>
      <input
        id={`qty-${label}`}
        type="text"
        inputMode="numeric"
        value={draft}
        onChange={(event) => setDraft(event.target.value.replace(/[^\d]/g, ""))}
        onBlur={(event) => commit(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
        className="min-w-0 flex-1 bg-transparent text-center text-sm font-bold tabular-nums text-ink focus:outline-none"
      />

      <StepButton
        label="Increase quantity"
        disabled={value >= max}
        onClick={() => {
          const next = Math.min(value + 1, max);
          onChange(next);
          setDraft(String(next));
        }}
      >
        +
      </StepButton>
    </div>
  );
}

function StepButton({
  children,
  onClick,
  label,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-md text-base font-bold",
        "text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink",
        "disabled:cursor-not-allowed disabled:opacity-40",
      )}
    >
      {children}
    </button>
  );
}
