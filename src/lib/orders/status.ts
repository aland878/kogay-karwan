import type { OrderStatus } from "@/lib/domain/types";

/**
 * Status presentation, shared by every screen that renders an order —
 * customer list, customer detail, and later the employee and admin queues.
 * Kept out of any page file because a Next.js page may only export a fixed
 * set of fields.
 */
export const STATUS_STYLE: Record<
  OrderStatus,
  { label: string; tone: "neutral" | "gold" | "success" | "warning" | "danger" }
> = {
  pending: { label: "Pending", tone: "warning" },
  accepted: { label: "Accepted", tone: "gold" },
  preparing: { label: "Preparing", tone: "gold" },
  ready: { label: "Ready", tone: "gold" },
  "out-for-delivery": { label: "Out for delivery", tone: "gold" },
  completed: { label: "Completed", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};
