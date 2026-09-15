"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";

import { QuantityStepper } from "@/components/portal/b2b-product-card";
import { AssetImage } from "@/components/ui/asset-image";
import { ArrowRight, Button, ButtonLink } from "@/components/ui/button";
import { Field, Input, Notice } from "@/components/ui/field";
import { PhoneIcon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/layout";
import { useCart } from "@/lib/cart/cart-context";
import { resolveCart, type ResolvedCart } from "@/lib/cart/resolve";
import { localize } from "@/lib/domain/types";
import { submitOrder, type SubmitOrderState } from "@/lib/orders/actions";
import { cn, formatMoney, pluralize } from "@/lib/utils";

/**
 * CART + ORDER REVIEW
 *
 * Two deliberate behaviours from the brief:
 *  - No online payment. Cash on delivery is stated on the screen, not buried.
 *  - Submission is an explicit, separate act after review. Changing a quantity
 *    never submits anything.
 */

/** The catalog trades in Iraqi dinar. */
const ZERO = { amount: 0, currency: "IQD" } as const;

export function CartView({ defaultPhone }: { defaultPhone: string }) {
  const { entries, hydrated, setQuantity, remove, clear } = useCart();
  const [resolved, setResolved] = useState<ResolvedCart | null>(null);
  const [isPending, startTransition] = useTransition();

  const [state, formAction] = useActionState<SubmitOrderState, FormData>(
    submitOrder,
    { status: "idle" },
  );

  // Re-price whenever the cart changes. Prices come from the server every time
  // rather than being cached client-side, so an admin price change lands here.
  useEffect(() => {
    if (!hydrated) return;

    if (entries.length === 0) {
      setResolved({
        lines: [],
        totals: {
          subtotal: ZERO,
          discount: ZERO,
          total: ZERO,
          itemCount: 0,
          lineCount: 0,
        },
        unavailable: [],
      });
      return;
    }

    startTransition(async () => {
      setResolved(await resolveCart(entries));
    });
  }, [entries, hydrated]);

  // Clear the local cart once the order is safely recorded server-side.
  useEffect(() => {
    if (state.status === "success") clear();
  }, [state.status, clear]);

  if (state.status === "success" && state.orderNumber) {
    return <OrderConfirmation orderNumber={state.orderNumber} removed={state.removed} />;
  }

  if (!hydrated || !resolved) {
    return <p className="py-16 text-center text-sm text-ink-muted">Loading your cart…</p>;
  }

  if (resolved.lines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
        <h2 className="text-lg font-bold text-ink">Your cart is empty</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Add products from the catalog to build an order.
        </p>
        <ButtonLink href="/b2b/products" className="group mt-6" trailing={<ArrowRight />}>
          Browse catalog
        </ButtonLink>
      </div>
    );
  }

  const orderable = resolved.lines.filter((line) => line.available);
  const hasBlockedLines = orderable.length !== resolved.lines.length;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      {/* --- Lines --- */}
      <div className="flex flex-col gap-3">
        {state.status === "error" ? (
          <Notice tone="error">{state.error}</Notice>
        ) : null}

        {resolved.unavailable.length > 0 ? (
          <Notice tone="warning">
            {pluralize(resolved.unavailable.length, "item")} in your cart{" "}
            {resolved.unavailable.length === 1 ? "is" : "are"} no longer
            available and {resolved.unavailable.length === 1 ? "has" : "have"}{" "}
            been left out of the total.
          </Notice>
        ) : null}

        {resolved.lines.map((line) => (
          <article
            key={line.productId}
            className={cn(
              "flex gap-4 rounded-2xl border border-line bg-surface p-4",
              !line.available && "opacity-60",
            )}
          >
            <div className="relative size-20 shrink-0 rounded-xl bg-surface-muted p-2">
              <AssetImage
                asset={line.image}
                fallbackLabel={localize(line.name, "ku")}
                sizes="80px"
                fallbackRatio={1}
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h3 className="text-pretty text-sm font-bold leading-snug text-ink">
                <Link
                  href={`/b2b/products/${line.slug}`}
                  className="underline-offset-4 hover:underline"
                >
                  {localize(line.name, "ku")}
                </Link>
              </h3>

              <p className="font-mono text-xs text-ink-subtle">{line.sku}</p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                <span>
                  {formatMoney(line.unitPrice)} / {line.unit}
                </span>
                {line.unitDiscount ? (
                  <Badge tone="gold">−{formatMoney(line.unitDiscount)} each</Badge>
                ) : null}
                {!line.available ? <Badge tone="danger">Out of stock</Badge> : null}
                {line.available &&
                line.stockTracked &&
                line.quantity > line.stockQuantity ? (
                  <Badge tone="warning">Only {line.stockQuantity} in stock</Badge>
                ) : null}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <div className="w-32">
                  <QuantityStepper
                    value={line.quantity}
                    max={Math.max(line.maxQuantity, 1)}
                    onChange={(next) => setQuantity(line.productId, next)}
                    label={`Quantity of ${localize(line.name, "ku")}`}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => remove(line.productId)}
                  className="text-xs font-semibold text-ink-subtle underline-offset-4 transition-colors hover:text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end justify-between">
              <span className="text-base font-extrabold tabular-nums text-ink">
                {formatMoney(line.lineTotal)}
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* --- Summary + submission --- */}
      <aside className="sticky top-24 flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6">
        <h2 className="text-base font-bold text-ink">Order summary</h2>

        <dl className="flex flex-col gap-2 text-sm">
          <Row label={`Subtotal (${pluralize(resolved.totals.itemCount, "unit")})`}>
            {formatMoney(resolved.totals.subtotal)}
          </Row>

          {resolved.totals.discount.amount > 0 ? (
            <Row label="Discount" accent>
              −{formatMoney(resolved.totals.discount)}
            </Row>
          ) : null}

          <div className="mt-2 border-t border-line pt-3">
            <Row label="Total" strong>
              {formatMoney(resolved.totals.total)}
            </Row>
          </div>
        </dl>

        {isPending ? (
          <p className="text-xs text-ink-subtle">Updating prices…</p>
        ) : null}

        <form action={formAction} className="flex flex-col gap-4">
          {/* Only ids and quantities cross the wire — never prices. */}
          <input
            type="hidden"
            name="entries"
            value={JSON.stringify(
              orderable.map((line) => ({
                productId: line.productId,
                quantity: Math.min(line.quantity, line.maxQuantity),
              })),
            )}
          />

          <Field
            id="order-phone"
            label="Confirm phone number"
            hint="We call this number to confirm delivery."
          >
            <Input
              id="order-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              dir="ltr"
              required
              defaultValue={defaultPhone}
              leading={<PhoneIcon className="size-4" />}
            />
          </Field>

          <Field id="order-note" label="Note for our team" hint="Optional.">
            <Input id="order-note" name="note" placeholder="Delivery timing, access…" />
          </Field>

          <SubmitOrderButton disabled={orderable.length === 0} />
        </form>

        <p className="text-center text-xs text-ink-subtle">
          Cash on delivery — no online payment.
        </p>

        {hasBlockedLines ? (
          <p className="text-xs text-ink-subtle">
            Out-of-stock lines are excluded from this order.
          </p>
        ) : null}
      </aside>
    </div>
  );
}

function SubmitOrderButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending || disabled} className="w-full">
      {pending ? "Submitting…" : "Submit order"}
    </Button>
  );
}

function Row({
  label,
  children,
  strong,
  accent,
}: {
  label: string;
  children: React.ReactNode;
  strong?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className={cn("text-ink-muted", strong && "font-bold text-ink")}>{label}</dt>
      <dd
        className={cn(
          "tabular-nums font-semibold text-ink",
          strong && "text-lg font-extrabold",
          accent && "text-accent-strong",
        )}
      >
        {children}
      </dd>
    </div>
  );
}

function OrderConfirmation({
  orderNumber,
  removed,
}: {
  orderNumber: string;
  removed?: string[];
}) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-line bg-surface p-10 text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-leaf-500/12 text-leaf-600 dark:text-leaf-400">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="size-7"
        >
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      </span>

      <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-ink">
        Order submitted
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        Your order number is{" "}
        <span className="font-mono font-bold text-ink">{orderNumber}</span>. Our
        team will confirm it by phone shortly.
      </p>

      {removed && removed.length > 0 ? (
        <p className="mt-4 rounded-lg bg-amber-500/10 px-4 py-3 text-xs text-amber-800 dark:text-amber-300">
          {pluralize(removed.length, "item")} became unavailable and{" "}
          {removed.length === 1 ? "was" : "were"} not included.
        </p>
      ) : null}

      <p className="mt-4 text-xs text-ink-subtle">
        Cash on delivery. Orders cannot be edited after submission — call us if
        something needs to change.
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <ButtonLink href={`/b2b/orders/${orderNumber}`} className="group" trailing={<ArrowRight />}>
          View order
        </ButtonLink>
        <ButtonLink href="/b2b/products" variant="secondary">
          Continue shopping
        </ButtonLink>
      </div>
    </div>
  );
}
