import type { Metadata } from "next";
import Link from "next/link";

import { ArrowRight, ButtonLink } from "@/components/ui/button";
import { CATEGORY_ICONS } from "@/components/ui/icons";
import { Badge, Card } from "@/components/ui/layout";
import { requireB2B } from "@/lib/auth/session";
import { STATUS_STYLE } from "@/lib/orders/status";
import { getCatalog, getOrders, getSettings } from "@/lib/data";
import { localize } from "@/lib/domain/types";
import { formatDateTime, formatMoney, pluralize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "B2B Dashboard",
  robots: { index: false, follow: false },
};

export default async function B2BDashboardPage() {
  const session = await requireB2B();
  const catalog = getCatalog();

  const [orders, categories, settings, allProducts] = await Promise.all([
    getOrders().listOrders({ customerId: session.customerId, pageSize: 5 }),
    catalog.listCategoryTree(),
    getSettings().getSettings(),
    catalog.listProducts({ pageSize: 1 }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          Welcome back, {session.ownerName || session.businessName}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {localize(settings.business.hoursLabel, "en")} ·{" "}
          {localize(settings.business.deliveryLabel, "en")} ·{" "}
          {localize(settings.business.cashOnlyNote, "en")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Products available" value={allProducts.total.toLocaleString()} />
        <Stat label="Categories" value={String(categories.length)} />
        <Stat label="Your orders" value={String(orders.total)} />
      </div>

      <ButtonLink href="/b2b/products" size="lg" className="group self-start" trailing={<ArrowRight />}>
        Browse the wholesale catalog
      </ButtonLink>

      {/* --- Recent orders --- */}
      <section>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-lg font-bold text-ink">Recent orders</h2>
          {orders.total > 0 ? (
            <Link
              href="/b2b/orders"
              className="text-sm font-semibold text-accent-strong underline-offset-4 hover:underline"
            >
              View all
            </Link>
          ) : null}
        </div>

        {orders.items.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-line bg-surface p-8 text-center text-sm text-ink-muted">
            You have not placed an order yet.
          </p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {orders.items.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/b2b/orders/${order.orderNumber}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 transition-colors hover:border-accent/40"
                >
                  <span className="font-mono text-sm font-bold text-ink">
                    {order.orderNumber}
                  </span>
                  <span className="text-xs text-ink-subtle">
                    {formatDateTime(order.createdAt)}
                  </span>
                  <span className="text-sm text-ink-muted">
                    {pluralize(order.lines.length, "line")}
                  </span>
                  <span className="text-sm font-extrabold tabular-nums text-ink">
                    {formatMoney(order.total)}
                  </span>
                  <Badge tone={STATUS_STYLE[order.status].tone}>
                    {STATUS_STYLE[order.status].label}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* --- Shortcut into the biggest categories --- */}
      <section>
        <h2 className="text-lg font-bold text-ink">Shop by category</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.slice(0, 12).map((category) => {
            const Icon = CATEGORY_ICONS[category.icon ?? "more"];
            return (
              <li key={category.id}>
                <Link
                  href={`/b2b/products?category=${category.slug}`}
                  className="flex h-full items-center gap-3 rounded-xl border border-line bg-surface p-3 transition-colors hover:border-accent/40"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-strong">
                    <Icon className="size-4.5" />
                  </span>
                  <span className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate text-sm font-semibold text-ink">
                      {localize(category.name, "ku")}
                    </span>
                    <span className="text-xs text-ink-subtle">
                      {category.productCount ?? 0}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5">
      <p className="text-2xl font-extrabold tabular-nums text-ink">{value}</p>
      <p className="mt-1 text-sm text-ink-muted">{label}</p>
    </Card>
  );
}
