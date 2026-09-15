import type { Metadata } from "next";

import { B2BCallout, ContactSection, ServicesSection } from "@/components/site/home-sections";
import { PageHeader } from "@/components/site/page-header";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Wholesale supply, reliable stock, competitive pricing, Erbil delivery and business support from Kogay Karwan.",
};

export default async function ServicesPage() {
  const settings = await getSettings().getSettings();

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="What we"
        highlight="handle"
        lead="Supply, stock, pricing and delivery — the operational side of keeping a shop full, run by people you can reach directly."
        crumbs={[{ href: "/", label: "Home" }, { label: "Services" }]}
      />

      <ServicesSection settings={settings} />
      <B2BCallout settings={settings} />
      <ContactSection settings={settings} />
    </>
  );
}
