import type { Metadata } from "next";

import { AuthShell } from "@/components/portal/auth-shell";
import { LoginForm } from "@/components/portal/login-form";
import { employeeLogin } from "@/lib/auth/actions";

export const metadata: Metadata = {
  title: "Employee Login",
  robots: { index: false, follow: false },
};

export default async function EmployeeLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <AuthShell
      eyebrow="Staff Portal"
      title="Employee sign in"
      subtitle="Use the credentials issued to you. Each employee has their own account — accounts are never shared."
      aside={{
        heading: "Your shift, your tools, your permissions.",
        points: [
          "Cashier terminal built for speed and keyboard entry",
          "Order queue filtered to what your role handles",
          "Admin updates on prices, stock and announcements",
          "Access limited to exactly what your role allows",
        ],
      }}
    >
      <LoginForm
        action={employeeLogin}
        mode="username"
        next={next}
        demoHint="Demo build: username cashier, sales, warehouse, delivery, support or manager — password demo1234."
      />
    </AuthShell>
  );
}
