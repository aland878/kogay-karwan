"use server";

import { requireB2B } from "@/lib/auth/session";
import { buildLine, computeTotals, lineTotal } from "@/lib/cart/totals";
import { getCatalog } from "@/lib/data";
import type { CartTotals, Money, OrderLine } from "@/lib/domain/types";
import { maxOrderableQuantity } from "@/lib/domain/types";

/**
 * Resolves `{ productId, quantity }` entries into priced lines.
 *
 * Display goes through the same server-side price lookup that submission does,
 * so the figures on the cart screen are the figures on the order. There is no
 * second, client-side pricing path that could drift from it.
 */

export type ResolvedLine = OrderLine & {
  /** Current stock, so the cart can flag a line that outruns availability. */
  stockQuantity: number;
  stockTracked: boolean;
  /** Ceiling the stepper clamps to — the real count, or an open ceiling. */
  maxQuantity: number;
  available: boolean;
  slug: string;
  unit: string;
  unitsPerCase?: number;
};

export type ResolvedCart = {
  lines: ResolvedLine[];
  totals: CartTotals;
  /** SKUs that vanished or sold out since being added. */
  unavailable: string[];
};

export async function resolveCart(
  entries: { productId: string; quantity: number }[],
): Promise<ResolvedCart> {
  await requireB2B();

  const catalog = getCatalog();
  const lines: ResolvedLine[] = [];
  const unavailable: string[] = [];

  for (const entry of entries) {
    const product = await catalog.getProductById(entry.productId);

    // A product deleted or hidden since it was added leaves no trace to show,
    // so it is reported by id and the cart offers to drop it.
    if (!product || !product.active) {
      unavailable.push(product?.sku ?? entry.productId);
      continue;
    }

    const line = buildLine(product, entry.quantity);

    lines.push({
      ...line,
      lineTotal: lineTotal(line),
      stockQuantity: product.stockQuantity,
      stockTracked: product.stockTracked,
      maxQuantity: maxOrderableQuantity(product),
      available: product.stockQuantity > 0,
      slug: product.slug,
      unit: product.unit,
      unitsPerCase: product.unitsPerCase,
    });
  }

  // Only orderable lines contribute to the total — an out-of-stock row is shown
  // but must not inflate what the buyer thinks they are committing to.
  const totals = computeTotals(lines.filter((line) => line.available));

  return { lines, totals, unavailable };
}

export type { Money };
