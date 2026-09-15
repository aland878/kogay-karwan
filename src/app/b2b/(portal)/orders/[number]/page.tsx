import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AssetImage } from "@/components/ui/asset-image";
import { Badge } from "@/components/ui/layout";
import { requireB2B } from "@/lib/auth/session";
import { STATUS_STYLE } from "@/lib/orders/status";
import { getOrders } from "@/lib/data";
import { ORDER_FLOW, isTerminal, localize } from "@/lib/domain/types";
import { cn, formatDateTime, formatMoney, pluralize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order",
  robots: { index: false, follow: false },
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const [session, { number }] = await Promise.all([requireB2B(), params]);

  const order = await getOrders().getOrderByNumber(number);

  // Existence and ownership collapse into one 404: a customer probing order
  // numbers must not be able to tell a real one from a stranger's.
  if (!order || order.customerId !== session.customerId) notFound();

  const currentStep = ORDER_FLOW.indexOf(order.status);
  const terminal = isTerminal(order.status);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/b2b/orders"
            className="text-sm text-ink-muted underline-offset-4 hover:underline"
          >
            ← All orders
          </Link>
          <h1 className="mt-2 font-mono text-2xl font-extrabold tracking-tight text-ink">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Placed {formatDateTime(order.createdAt)} ·{" "}
            {pluralize(order.lines.length, "line")}
          </p>
        </div>

        <Badge tone={STATUS_STYLE[order.status].tone} className="px-3 py-1.5 text-sm">
          {STATUS_STYLE[order.status].label}
        </Badge>
      </div>

      {/* --- Progress --- */}
      {!terminal ? (
        <ol className="flex flex-wrap gap-2 rounded-2xl border border-line bg-surface p-4">
          {ORDER_FLOW.map((step, index) => {
            const done = index <= currentStep;
            return (
              <li key={step} className="flex items-center gap-2">
                <span
                  className={cn(
                    "grid size-6 place-items-center rounded-full text-xs font-bold",
                    done ? "bg-accent text-white" : "bg-surface-muted text-ink-subtle",
                  )}
                >
                  {index + 1}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    done ? "text-ink" : "text-ink-subtle",
                  )}
                >
                  {STATUS_STYLE[step].label}
                </span>
                {index < ORDER_FLOW.length - 1 ? (
                  <span aria-hidden="true" className="mx-1 text-ink-subtle/40">
                    ›
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      ) : order.statusReason ? (
        <p className="rounded-2xl border border-line bg-surface-muted p-4 text-sm text-ink-muted">
          <span className="font-semibold text-ink">Reason: </span>
          {order.statusReason}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        {/* --- Lines --- */}
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <ul>
            {order.lines.map((line) => (
              <li
                key={line.productId}
                className="flex items-center gap-4 border-b border-line p-4 last:border-0"
              >
                <div className="relative size-14 shrink-0 rounded-lg bg-surface-muted p-1.5">
                  <AssetImage
                    asset={line.image}
                    fallbackLabel={localize(line.name, "ku")}
                    sizes="56px"
                    fallbackRatio={1}
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-bold text-ink">
                    {localize(line.name, "ku")}
                  </span>
                  <span className="font-mono text-xs text-ink-subtle">{line.sku}</span>
                  <span className="text-xs text-ink-muted">
                    {line.quantity} ×{" "}
                    {formatMoney(
                      line.unitDiscount
                        ? {
                            ...line.unitPrice,
                            amount: line.unitPrice.amount - line.unitDiscount.amount,
                          }
                        : line.unitPrice,
                    )}
                  </span>
                </div>

                <span className="shrink-0 text-sm font-extrabold tabular-nums text-ink">
                  {formatMoney(line.lineTotal)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* --- Summary --- */}
        <aside className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6">
          <h2 className="text-base font-bold text-ink">Summary</h2>

          <dl className="flex flex-col gap-2 text-sm">
            <Row label="Subtotal">{formatMoney(order.subtotal)}</Row>
            {order.discount.amount > 0 ? (
              <Row label="Discount" accent>
                −{formatMoney(order.discount)}
              </Row>
            ) : null}
            <div className="mt-2 border-t border-line pt-3">
              <Row label="Total" strong>
                {formatMoney(order.total)}
              </Row>
            </div>
          </dl>

          <dl className="mt-2 flex flex-col gap-2 border-t border-line pt-4 text-sm">
            <Row label="Phone">
              <span dir="ltr">{order.customerPhone}</span>
            </Row>
            <Row label="Payment">Cash on delivery</Row>
          </dl>

          {order.note ? (
            <p className="rounded-lg bg-surface-muted p-3 text-xs leading-relaxed text-ink-muted">
              <span className="font-semibold text-ink">Your note: </span>
              {order.note}
            </p>
          ) : null}

          <p className="text-xs leading-relaxed text-ink-subtle">
            Orders cannot be edited after submission. Call us if something needs
            to change.
          </p>
        </aside>
      </div>

      {/* --- History --- */}
      {order.history.length > 1 ? (
        <section className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="text-base font-bold text-ink">History</h2>
          <ol className="mt-4 flex flex-col gap-3">
            {order.history.map((event, index) => (
              <li key={`${event.status}-${index}`} className="flex items-baseline gap-3 text-sm">
                <span className="w-40 shrink-0 text-xs text-ink-subtle">
                  {formatDateTime(event.at)}
                </span>
                <span className="font-medium text-ink">
                  {STATUS_STYLE[event.status].label}
                </span>
                {event.byName ? (
                  <span className="text-xs text-ink-subtle">by {event.byName}</span>
                ) : null}
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </div>
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
          "font-semibold tabular-nums text-ink",
          strong && "text-lg font-extrabold",
          accent && "text-accent-strong",
        )}
      >
        {children}
      </dd>
    </div>
  );
}
