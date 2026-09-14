import type { Metadata } from "next";

import { AuthShell } from "@/components/portal/auth-shell";
import { LoginForm } from "@/components/portal/login-form";
import { adminLogin } from "@/lib/auth/actions";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <AuthShell
      eyebrow="Administration"
      title="Admin sign in"
      subtitle="Full control of the catalog, orders, customers, employees and the public website."
      aside={{
        heading: "Run the whole business from one place.",
        points: [
          "Products, categories, brands, stock and discounts",
          "Bulk import 5,000+ products from Excel or CSV",
          "Approve B2B customers and manage employee permissions",
          "Edit the public website and control its global theme",
        ],
      }}
    >
      <LoginForm
        action={adminLogin}
        mode="username"
        next={next}
        demoHint="Demo build: username admin, password demo1234."
      />
    </AuthShell>
  );
}
