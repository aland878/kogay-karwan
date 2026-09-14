import type { Metadata } from "next";

import { PortalShell, ScaffoldNotice } from "@/components/portal/portal-shell";
import { requireAdmin } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/brands", label: "Brands" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/discounts", label: "Discounts" },
  { href: "/admin/customers", label: "B2B Customers" },
  { href: "/admin/employees", label: "Employees" },
  { href: "/admin/updates", label: "Admin Updates" },
  { href: "/admin/content", label: "Website Content" },
  { href: "/admin/appearance", label: "Appearance" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/audit", label: "Audit Log" },
];

export default async function AdminOverviewPage() {
  const session = await requireAdmin();

  return (
    <PortalShell
      audience="admin"
      portalName="Administration"
      nav={NAV}
      user={{ name: session.fullName, detail: "Full access" }}
    >
      <ScaffoldNotice
        area="Business administration"
        planned={[
          "Product CRUD with image management",
          "Excel/CSV bulk import with validation",
          "Category and brand management",
          "Inventory and low-stock views",
          "Monetary discount management",
          "B2B customer approval workflow",
          "Employee accounts and permissions",
          "Admin Updates publishing",
          "Website content CMS",
          "Global light/dark theme control",
          "Analytics dashboards",
          "Audit log",
        ]}
      />
    </PortalShell>
  );
}
