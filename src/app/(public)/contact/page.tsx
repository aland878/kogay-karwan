import type { Metadata } from "next";

import { ContactSection } from "@/components/site/home-sections";
import { PageHeader } from "@/components/site/page-header";
import { getSettings } from "@/lib/data";
import { localize } from "@/lib/domain/types";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Kogay Karwan in Erbil by WhatsApp or phone for wholesale supply, pricing and delivery.",
};

export default async function ContactPage() {
  const settings = await getSettings().getSettings();

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to us"
        highlight="directly"
        lead={`${localize(settings.business.address, "en")} — reach the team that handles your order, on WhatsApp or by phone.`}
        crumbs={[{ href: "/", label: "Home" }, { label: "Contact" }]}
      />

      <ContactSection settings={settings} />
    </>
  );
}
