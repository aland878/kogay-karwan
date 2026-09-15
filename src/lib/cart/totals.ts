import type {
  CartLine,
  CartTotals,
  Money,
  Product,
} from "@/lib/domain/types";
import {
  addMoney,
  finalPrice,
  money,
  multiplyMoney,
  subtractMoney,
} from "@/lib/domain/types";

/**
 * CART MATHS
 *
 * Pure functions, shared by the client cart (for display) and the server order
 * submission (for the figures actually written). Having one implementation is
 * what keeps the total a buyer sees identical to the total on their invoice.
 *
 * Rounding happens per line, never on the grand total: a wholesale invoice has
 * to reconcile line by line, and rounding only at the end produces a footer
 * that does not equal the sum of the rows above it.
 */

export function lineUnitPrice(line: CartLine): Money {
  return line.unitDiscount
    ? subtractMoney(line.unitPrice, line.unitDiscount)
    : line.unitPrice;
}

export function lineTotal(line: CartLine): Money {
  return multiplyMoney(lineUnitPrice(line), line.quantity);
}

export function computeTotals(lines: CartLine[]): CartTotals {
  const currency = lines[0]?.unitPrice.currency ?? "USD";

  let subtotal = money(0, currency);
  let discount = money(0, currency);
  let itemCount = 0;

  for (const line of lines) {
    subtotal = addMoney(subtotal, multiplyMoney(line.unitPrice, line.quantity));

    if (line.unitDiscount) {
      discount = addMoney(discount, multiplyMoney(line.unitDiscount, line.quantity));
    }

    itemCount += line.quantity;
  }

  return {
    subtotal,
    discount,
    total: subtractMoney(subtotal, discount),
    itemCount,
    lineCount: lines.length,
  };
}

/**
 * Builds an authoritative cart line from a product row.
 *
 * The client only ever sends `{ productId, quantity }`. Price and discount are
 * read from the catalog here, server-side, so a tampered request cannot set its
 * own price. This is the single place a line is allowed to acquire money.
 */
export function buildLine(product: Product, quantity: number): CartLine {
  return {
    productId: product.id,
    sku: product.sku,
    name: product.name,
    image: product.image,
    quantity: clampQuantity(quantity),
    unitPrice: product.wholesalePrice,
    unitDiscount: product.discount,
  };
}

/** Guards against zero, negatives, fractions and absurd bulk typos. */
export function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1;
  return Math.min(Math.max(Math.trunc(quantity), 1), 9999);
}

export { finalPrice };
