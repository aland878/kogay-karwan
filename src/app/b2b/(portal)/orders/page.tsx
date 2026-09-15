import type { Metadata } from "next";
import Link from "next/link";

import { Pagination } from "@/components/site/catalog/pagination";
import { ArrowRight, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/layout";
import { requireB2B } from "@/lib/auth/session";
import { STATUS_STYLE } from "@/lib/orders/status";
import { getOrders } from "@/lib/data";
import { cn, formatDateTime, formatMoney, pluralize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Orders",
  robots: { index: false, follow: false },
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const [session, query] = await Promise.all([requireB2B(), searchParams]);
  const page = Math.max(1, Number.parseInt(query.page ?? "1", 10) || 1);

  // Scoped to this customer. The repository filters by id rather than the UI
  // hiding rows — another customer's orders are never fetched in the first place.
  const orders = await getOrders().listOrders({
    customerId: session.customerId,
    page,
    pageSize: 20,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Your orders</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {pluralize(orders.total, "order")} · orders cannot be edited after
          submission
        </p>
      </div>

      {orders.items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
          <h2 className="text-lg font-bold text-ink">No orders yet</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Orders you submit will appear here with their live status.
          </p>
          <ButtonLink href="/b2b/products" className="group mt-6" trailing={<ArrowRight />}>
            Browse catalog
          </ButtonLink>
        </div>
      ) : (
        <>
          {/* Cards on phones, a table from md up: a wholesale order list is
              genuinely tabular, but a table at 390px is unreadable. */}
          <ul className="flex flex-col gap-3 md:hidden">
            {orders.items.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/b2b/orders/${order.orderNumber}`}
                  className="flex flex-col gap-2 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-accent/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm font-bold text-ink">
                      {order.orderNumber}
                    </span>
                    <Badge tone={STATUS_STYLE[order.status].tone}>
                      {STATUS_STYLE[order.status].label}
                    </Badge>
                  </div>
                  <span className="text-xs text-ink-subtle">
                    {formatDateTime(order.createdAt)}
                  </span>
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-ink-muted">
                      {pluralize(order.lines.length, "line")}
                    </span>
                    <span className="font-extrabold tabular-nums text-ink">
                      {formatMoney(order.total)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-hidden rounded-2xl border border-line bg-surface md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-line bg-surface-muted text-start">
                <tr>
                  <Th>Order</Th>
                  <Th>Date</Th>
                  <Th>Lines</Th>
                  <Th align="end">Total</Th>
                  <Th>Status</Th>
                  <Th><span className="sr-only">Actions</span></Th>
                </tr>
              </thead>
              <tbody>
                {orders.items.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-line last:border-0 transition-colors hover:bg-surface-muted/60"
                  >
                    <Td>
                      <span className="font-mono font-bold text-ink">
                        {order.orderNumber}
                      </span>
                    </Td>
                    <Td className="text-ink-muted">{formatDateTime(order.createdAt)}</Td>
                    <Td className="text-ink-muted">{order.lines.length}</Td>
                    <Td align="end">
                      <span className="font-extrabold tabular-nums text-ink">
                        {formatMoney(order.total)}
                      </span>
                    </Td>
                    <Td>
                      <Badge tone={STATUS_STYLE[order.status].tone}>
                        {STATUS_STYLE[order.status].label}
                      </Badge>
                    </Td>
                    <Td align="end">
                      <Link
                        href={`/b2b/orders/${order.orderNumber}`}
                        className="font-semibold text-accent-strong underline-offset-4 hover:underline"
                      >
                        View
                      </Link>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={orders.page}
            pageCount={orders.pageCount}
            baseHref="/b2b/orders"
            searchParams={query}
          />
        </>
      )}
    </div>
  );
}

function Th({
  children,
  align = "start",
}: {
  children: React.ReactNode;
  align?: "start" | "end";
}) {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-3 text-xs font-bold uppercase tracking-wide text-ink-subtle",
        align === "end" ? "text-end" : "text-start",
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "start",
  className,
}: {
  children: React.ReactNode;
  align?: "start" | "end";
  className?: string;
}) {
  return (
    <td className={cn("px-4 py-3", align === "end" ? "text-end" : "text-start", className)}>
      {children}
    </td>
  );
}
