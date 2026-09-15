"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireB2B } from "@/lib/auth/session";
import { buildLine, computeTotals, lineTotal } from "@/lib/cart/totals";
import { getCatalog, getOrders } from "@/lib/data";
import type { CartLine, OrderLine } from "@/lib/domain/types";

/**
 * ORDER SUBMISSION
 *
 * The security-critical path of the whole platform. The client sends product
 * ids and quantities; everything with money attached is resolved here from the
 * catalog. A request that claims its own prices is simply ignored, because
 * prices are never read from the request.
 */

const submissionSchema = z.object({
  entries: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(9999),
      }),
    )
    .min(1, "Your cart is empty")
    .max(500, "Too many lines in one order"),
  phone: z
    .string()
    .trim()
    .min(7, "Confirm your phone number")
    .transform((value) => value.replace(/[\s\-()]/g, ""))
    .refine((value) => /^\+?\d{7,15}$/.test(value), "Enter a valid phone number"),
  note: z.string().trim().max(500).optional(),
});

export type SubmitOrderState = {
  status: "idle" | "error" | "success";
  error?: string;
  orderNumber?: string;
  /** Lines dropped because they went inactive or out of stock mid-session. */
  removed?: string[];
};

export async function submitOrder(
  _prev: SubmitOrderState,
  formData: FormData,
): Promise<SubmitOrderState> {
  let session;
  try {
    session = await requireB2B();
  } catch {
    return { status: "error", error: "Your session expired. Please sign in again." };
  }

  let payload: unknown;
  try {
    payload = {
      entries: JSON.parse(String(formData.get("entries") ?? "[]")),
      phone: formData.get("phone"),
      note: formData.get("note") || undefined,
    };
  } catch {
    return { status: "error", error: "Could not read the cart. Please try again." };
  }

  const parsed = submissionSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      status: "error",
      error: parsed.error.issues[0]?.message ?? "Check your order details",
    };
  }

  const catalog = getCatalog();
  const lines: CartLine[] = [];
  const removed: string[] = [];

  // Re-read every product. A cart can sit open for hours, so anything hidden,
  // deactivated or sold out since it was added must not reach the warehouse.
  for (const entry of parsed.data.entries) {
    const product = await catalog.getProductById(entry.productId);

    if (!product || !product.active) {
      removed.push(product?.sku ?? entry.productId);
      continue;
    }
    if (product.stockQuantity <= 0) {
      removed.push(product.sku);
      continue;
    }

    lines.push(buildLine(product, entry.quantity));
  }

  if (lines.length === 0) {
    return {
      status: "error",
      error: "None of the items in your cart are available any more.",
      removed,
    };
  }

  const totals = computeTotals(lines);
  const orderLines: OrderLine[] = lines.map((line) => ({
    ...line,
    lineTotal: lineTotal(line),
  }));

  const order = await getOrders().createOrder({
    customerId: session.customerId,
    customerName: session.ownerName,
    customerPhone: parsed.data.phone,
    businessName: session.businessName,
    lines: orderLines,
    subtotal: totals.subtotal,
    discount: totals.discount,
    total: totals.total,
    status: "pending",
    note: parsed.data.note,
    paymentMethod: "cash",
  });

  revalidatePath("/b2b/orders");

  return {
    status: "success",
    orderNumber: order.orderNumber,
    removed: removed.length > 0 ? removed : undefined,
  };
}
