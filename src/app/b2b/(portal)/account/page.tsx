import type { Metadata } from "next";

import { Card } from "@/components/ui/layout";
import { requireB2B } from "@/lib/auth/session";
import { getOrders, getSettings } from "@/lib/data";
import { localize } from "@/lib/domain/types";
import { toTelHref, toWhatsAppHref } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const session = await requireB2B();
  const [settings, orders] = await Promise.all([
    getSettings().getSettings(),
    getOrders().listOrders({ customerId: session.customerId, pageSize: 1 }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">Account</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-sm font-bold text-ink">Business details</h2>
          <dl className="mt-4 flex flex-col gap-3 text-sm">
            <Row label="Business">{session.businessName || "—"}</Row>
            <Row label="Owner">{session.ownerName || "—"}</Row>
            <Row label="Phone"><span dir="ltr">{session.phone}</span></Row>
            <Row label="Total orders">{orders.total}</Row>
          </dl>
          <p className="mt-5 text-xs leading-relaxed text-ink-subtle">
            Account details are maintained by our team. Contact us to change the
            phone number or business name on your account.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-sm font-bold text-ink">Need help?</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Reach the team that handles your orders directly.
          </p>
          <div className="mt-5 flex flex-col gap-2 text-sm">
            <a
              href={toWhatsAppHref(settings.business.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-line px-4 py-3 font-semibold text-ink transition-colors hover:border-accent/45"
            >
              WhatsApp <span dir="ltr" className="font-normal text-ink-muted">{settings.business.whatsapp}</span>
            </a>
            <a
              href={toTelHref(settings.business.phone)}
              className="rounded-lg border border-line px-4 py-3 font-semibold text-ink transition-colors hover:border-accent/45"
            >
              Call <span dir="ltr" className="font-normal text-ink-muted">{settings.business.phone}</span>
            </a>
          </div>
          <p className="mt-5 text-xs text-ink-subtle">
            {localize(settings.business.hoursLabel, "en")} · {localize(settings.business.hoursNote, "en")}
          </p>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-semibold text-ink">{children}</dd>
    </div>
  );
}
