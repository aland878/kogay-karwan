import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/portal/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, Input, Notice } from "@/components/ui/field";
import { PhoneIcon, UserIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Request B2B Access",
  description:
    "Request a Kogay Karwan wholesale account. Businesses are verified by phone or WhatsApp before approval.",
  robots: { index: true, follow: true },
};

/**
 * B2B access request.
 *
 * This creates a PENDING customer record only. Approval is manual: the team
 * verifies the business over phone/WhatsApp, then Admin approves the account.
 * No wholesale pricing is exposed at any point in this flow.
 */
export default function B2BRegisterPage() {
  return (
    <AuthShell
      eyebrow="Wholesale Access"
      title="Request a B2B account"
      subtitle="Tell us about your business and we will call or message you on WhatsApp to verify. Once approved, you get the full catalog with wholesale pricing."
      aside={{
        heading: "Verified businesses only.",
        points: [
          "We confirm every account by phone or WhatsApp",
          "Approval is usually same-day during business hours",
          "Wholesale pricing stays private to approved accounts",
          "No online payment — cash on delivery across Erbil",
        ],
      }}
      footer={
        <p className="text-sm text-ink-muted">
          Already approved?{" "}
          <Link
            href="/b2b/login"
            className="font-semibold text-accent-strong underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form className="flex flex-col gap-5">
        <Field id="businessName" label="Business name">
          <Input
            id="businessName"
            name="businessName"
            required
            placeholder="Your shop or company name"
          />
        </Field>

        <Field id="ownerName" label="Owner name">
          <Input
            id="ownerName"
            name="ownerName"
            required
            placeholder="Full name"
            leading={<UserIcon className="size-4" />}
          />
        </Field>

        <Field
          id="phone"
          label="Phone number"
          hint="We verify this number on WhatsApp or by call."
        >
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            dir="ltr"
            required
            placeholder="0750 000 0000"
            leading={<PhoneIcon className="size-4" />}
          />
        </Field>

        <Field id="address" label="Business address" hint="Optional.">
          <Input id="address" name="address" placeholder="District, street" />
        </Field>

        <Button type="submit" size="lg" className="mt-1 w-full" disabled>
          Submit request
        </Button>

        <Notice tone="warning">
          Submission is disabled in this build: it writes a pending customer
          record, which lands with the Supabase connection. The form, validation
          rules and approval workflow are already modelled.
        </Notice>
      </form>
    </AuthShell>
  );
}
