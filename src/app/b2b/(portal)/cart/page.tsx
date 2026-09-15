import type { Metadata } from "next";

import { CartView } from "@/components/portal/cart-view";
import { requireB2B } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false, follow: false },
};

export default async function CartPage() {
  const session = await requireB2B();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">
          Review your order
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Check quantities and totals, then submit. Nothing is ordered until you
          press submit.
        </p>
      </div>

      <CartView defaultPhone={session.phone} />
    </div>
  );
}
