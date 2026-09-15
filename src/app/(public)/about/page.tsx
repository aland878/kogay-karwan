import type { Metadata } from "next";

import {
  B2BCallout,
  ServicesSection,
  WhyUs,
} from "@/components/site/home-sections";
import { PageHeader } from "@/components/site/page-header";
import { Container } from "@/components/ui/layout";
import { getSettings } from "@/lib/data";
import { localize } from "@/lib/domain/types";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Kogay Karwan is a wholesale supplier in Erbil, Kurdistan Region — food, beverages, dairy and everyday essentials for shops, supermarkets and businesses.",
};

export default async function AboutPage() {
  const settings = await getSettings().getSettings();
  const { business, about } = settings;

  return (
    <>
      <PageHeader
        eyebrow="Know Us"
        title="About"
        highlight={localize(business.name, "en")}
        lead={localize(business.tagline, "en")}
        crumbs={[{ href: "/", label: "Home" }, { label: "About" }]}
      />

      <Container size="wide" className="py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <h2 className="text-balance text-2xl font-bold leading-tight sm:text-3xl">
            {localize(about.heading, "en")}
          </h2>

          <div className="flex flex-col gap-5">
            {about.body.map((paragraph, index) => (
              <p
                key={index}
                className="text-pretty text-base leading-relaxed text-ink-muted sm:text-lg"
              >
                {localize(paragraph, "en")}
              </p>
            ))}

            <dl className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
              <Fact label="Based in" value={localize(business.address, "en")} />
              <Fact label="Hours" value={localize(business.hoursNote, "en")} />
              <Fact label="Delivery" value={localize(business.deliveryLabel, "en")} />
              <Fact label="Payment" value={localize(business.cashOnlyNote, "en")} />
            </dl>
          </div>
        </div>
      </Container>

      {/* The video anchor the hero's secondary CTA points at. */}
      <div id="video" className="sr-only" aria-hidden="true" />

      <WhyUs settings={settings} />
      <ServicesSection settings={settings} />
      <B2BCallout settings={settings} />
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface px-5 py-4">
      <dt className="text-xs font-medium text-ink-subtle">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}
