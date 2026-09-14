import type { Metadata } from "next";

import { PortalShell, ScaffoldNotice } from "@/components/portal/portal-shell";
import { requireB2B } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "B2B Dashboard",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/b2b", label: "Dashboard" },
  { href: "/b2b/products", label: "Products" },
  { href: "/b2b/categories", label: "Categories" },
  { href: "/b2b/brands", label: "Brands" },
  { href: "/b2b/cart", label: "Cart" },
  { href: "/b2b/orders", label: "Orders" },
  { href: "/b2b/account", label: "Account" },
];

export default async function B2BDashboardPage() {
  // The real authorisation check. Middleware only handled the redirect.
  const session = await requireB2B();

  return (
    <PortalShell
      audience="b2b"
      portalName="B2B Portal"
      nav={NAV}
      user={{ name: session.businessName || session.ownerName, detail: session.phone }}
    >
      <ScaffoldNotice
        area="Wholesale ordering"
        planned={[
          "Catalog with wholesale pricing",
          "Search by product, brand, category, SKU",
          "Cart with quantities and line totals",
          "Order review and submission",
          "Order history and live status",
          "Account details",
        ]}
      />
    </PortalShell>
  );
}
