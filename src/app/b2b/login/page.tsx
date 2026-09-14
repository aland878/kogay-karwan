import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/portal/auth-shell";
import { LoginForm } from "@/components/portal/login-form";
import { b2bLogin } from "@/lib/auth/actions";

export const metadata: Metadata = {
  title: "B2B Login",
  description: "Sign in to the Kogay Karwan wholesale ordering portal.",
  robots: { index: false, follow: false },
};

export default async function B2BLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <AuthShell
      eyebrow="Wholesale Portal"
      title="Sign in to order"
      subtitle="Enter the phone number your account was approved on. Only verified businesses can access wholesale pricing."
      aside={{
        heading: "The full catalog, at your wholesale price.",
        points: [
          "Over 5,000 lines with live stock and wholesale pricing",
          "Search by product, brand, category or SKU",
          "Submit orders and follow them through to delivery",
          "Cash on delivery across Erbil",
        ],
      }}
      footer={
        <div className="flex flex-col gap-3 text-sm">
          <p className="text-ink-muted">
            No account yet?{" "}
            <Link
              href="/b2b/register"
              className="font-semibold text-accent-strong underline-offset-4 hover:underline"
            >
              Request B2B access
            </Link>
          </p>
          <p className="text-ink-subtle">
            Accounts are verified by phone or WhatsApp before approval.
          </p>
        </div>
      }
    >
      <LoginForm
        action={b2bLogin}
        mode="phone"
        next={next}
        demoHint="Demo build: any valid phone number with the password demo1234."
      />
    </AuthShell>
  );
}
