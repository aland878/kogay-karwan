import type { Metadata } from "next";

import { PortalShell, ScaffoldNotice } from "@/components/portal/portal-shell";
import { requireEmployee } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Employee Portal",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/employee", label: "Overview" },
  { href: "/employee/cashier", label: "Cashier" },
  { href: "/employee/orders", label: "Orders" },
  { href: "/employee/products", label: "Products" },
  { href: "/employee/updates", label: "Admin Updates" },
];

export default async function EmployeePortalPage() {
  const session = await requireEmployee();
  const detail =
    session.audience === "employee" ? session.role : "administrator";

  return (
    <PortalShell
      audience="employee"
      portalName="Employee Portal"
      nav={NAV}
      user={{ name: session.fullName, detail }}
    >
      <ScaffoldNotice
        area="Staff workspace"
        planned={[
          "Cashier terminal (POS-style order building)",
          "Order queue filtered by role",
          "Product and stock lookup",
          "Admin Updates feed with unread badge",
          "Role-scoped status transitions",
          "Invoice and picking-sheet printing",
        ]}
      />
    </PortalShell>
  );
}
