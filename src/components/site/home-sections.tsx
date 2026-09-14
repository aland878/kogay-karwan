import Link from "next/link";

import { ProductCard } from "@/components/site/product-card";
import { ArrowRight, ButtonLink } from "@/components/ui/button";
import {
  BoxIcon,
  PhoneIcon,
  SERVICE_ICONS,
  StarIcon,
  TruckIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";
import { Card, Container, Section, SectionHeading } from "@/components/ui/layout";
import type {
  Brand,
  Locale,
  PublicProduct,
  SiteSettings,
} from "@/lib/domain/types";
import { localize } from "@/lib/domain/types";
import { cn, toTelHref, toWhatsAppHref } from "@/lib/utils";

/**
 * Homepage content sections below the hero. All copy is settings-driven so the
 * Admin CMS can edit it without a deploy.
 */

// ---------------------------------------------------------------------------
// Why us
// ---------------------------------------------------------------------------

export function WhyUs({
  settings,
  locale = "en",
}: {
  settings: SiteSettings;
  locale?: Locale;
}) {
  return (
    <Section tone="raised" data-reveal>
      <Container size="wide">
        <SectionHeading
          eyebrow="Why Kogay Karwan"
          title="Built for businesses that cannot afford"
          highlight="an empty shelf"
          lead="Consistent stock, direct brand relationships and same-city delivery — the three things a wholesale supplier is actually judged on."
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {settings.stats.map((stat) => (
            <li key={stat.value} data-reveal-item>
              <Card className="h-full p-6">
                <p className="text-3xl font-extrabold text-gold-gradient sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm font-medium text-ink-muted">
                  {localize(stat.label, locale)}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Featured products
// ---------------------------------------------------------------------------

export function FeaturedProducts({
  products,
  brands,
  locale = "en",
}: {
  products: PublicProduct[];
  brands: Brand[];
  locale?: Locale;
}) {
  if (products.length === 0) return null;

  const brandName = (id: string | null) =>
    id ? brands.find((brand) => brand.id === id)?.name : undefined;

  return (
    <Section data-reveal>
      <Container size="wide">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Our Range"
            title="Stocked and ready for"
            highlight="wholesale orders"
            lead="A selection from over 5,000 lines across food, beverages, dairy, household and personal care."
            className="max-w-xl"
          />
          <ButtonLink
            href="/products"
            variant="secondary"
            className="group"
            trailing={<ArrowRight />}
          >
            View all products
          </ButtonLink>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {products.map((product, index) => (
            <div key={product.id} data-reveal-item>
              <ProductCard
                product={product}
                brandName={brandName(product.brandId)}
                locale={locale}
                priority={index < 4}
              />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------

export function AboutSection({
  settings,
  locale = "en",
}: {
  settings: SiteSettings;
  locale?: Locale;
}) {
  return (
    <Section id="about" tone="raised" data-reveal>
      <Container size="wide">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div data-reveal-item>
            <SectionHeading
              eyebrow="Know Us"
              title={localize(settings.about.heading, locale)}
            />
          </div>

          <div data-reveal-item className="flex flex-col gap-5">
            {settings.about.body.map((paragraph, index) => (
              <p
                key={index}
                className="text-pretty text-base leading-relaxed text-ink-muted sm:text-lg"
              >
                {localize(paragraph, locale)}
              </p>
            ))}

            <ButtonLink
              href="/about"
              variant="outline"
              className="group mt-2 self-start"
              trailing={<ArrowRight />}
            >
              More about us
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export function ServicesSection({
  settings,
  locale = "en",
}: {
  settings: SiteSettings;
  locale?: Locale;
}) {
  const services = settings.services
    .filter((service) => service.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (services.length === 0) return null;

  return (
    <Section id="services" data-reveal>
      <Container size="wide">
        <SectionHeading
          eyebrow="Services"
          title="What we handle so"
          highlight="you don't have to"
          align="center"
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = SERVICE_ICONS[service.icon];

            return (
              <li key={service.id} data-reveal-item>
                <Card interactive className="h-full p-6">
                  <span className="grid size-12 place-items-center rounded-xl bg-accent-soft text-accent-strong">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-ink">
                    {localize(service.title, locale)}
                  </h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-ink-muted">
                    {localize(service.description, locale)}
                  </p>
                </Card>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// B2B call to action
// ---------------------------------------------------------------------------

export function B2BCallout({
  settings,
  locale = "en",
}: {
  settings: SiteSettings;
  locale?: Locale;
}) {
  return (
    <Section data-reveal>
      <Container size="wide">
        <div
          data-reveal-item
          className={cn(
            "relative overflow-hidden rounded-3xl border border-accent/25",
            "bg-navy-900 px-6 py-14 text-center sm:px-12 lg:py-20",
          )}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 90% at 50% 0%, rgba(201,147,42,0.28) 0%, transparent 62%)",
            }}
          />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-gold-200">
              <StarIcon className="size-3.5" />
              B2B Wholesale Access
            </span>

            <h2 className="text-balance text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Wholesale prices are for{" "}
              <span className="text-gold-gradient">approved businesses</span>
            </h2>

            <p className="text-pretty text-base leading-relaxed text-white/70">
              Request an account and our team will verify your business by phone
              or WhatsApp. Once approved, you get the full catalog with wholesale
              pricing and can place orders directly.
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink
                href="/b2b/register"
                size="lg"
                className="group"
                trailing={<ArrowRight />}
              >
                Request B2B Access
              </ButtonLink>
              <ButtonLink
                href="/b2b/login"
                size="lg"
                variant="secondary"
                className="border-white/20 bg-white/10 text-white hover:bg-white/15"
              >
                B2B Login
              </ButtonLink>
            </div>

            <p className="text-sm text-white/45">
              {localize(settings.business.cashOnlyNote, locale)}
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Contact — WhatsApp and phone only, per the brief
// ---------------------------------------------------------------------------

export function ContactSection({
  settings,
  locale = "en",
}: {
  settings: SiteSettings;
  locale?: Locale;
}) {
  const { business } = settings;

  return (
    <Section id="contact" tone="raised" data-reveal>
      <Container size="wide">
        <SectionHeading
          eyebrow="Contact"
          title="Talk to us"
          highlight="directly"
          lead="No forms and no ticket queues. Message us on WhatsApp or call — you reach the team that handles your order."
          align="center"
        />

        <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
          <a
            data-reveal-item
            href={toWhatsAppHref(
              business.whatsapp,
              "Hello Kogay Karwan, I would like to ask about wholesale supply.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group flex items-center gap-4 rounded-2xl border border-line bg-surface p-6",
              "shadow-card transition-[transform,box-shadow,border-color]",
              "duration-[var(--duration-base)] ease-[var(--ease-out-quint)]",
              "hover:-translate-y-1 hover:border-leaf-500/40 hover:shadow-lift",
            )}
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-leaf-500/12 text-leaf-600 dark:text-leaf-400">
              <WhatsAppIcon className="size-6" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-sm font-bold text-ink">WhatsApp</span>
              <span dir="ltr" className="truncate text-sm text-ink-muted">
                {business.whatsapp}
              </span>
            </span>
          </a>

          <a
            data-reveal-item
            href={toTelHref(business.phone)}
            className={cn(
              "group flex items-center gap-4 rounded-2xl border border-line bg-surface p-6",
              "shadow-card transition-[transform,box-shadow,border-color]",
              "duration-[var(--duration-base)] ease-[var(--ease-out-quint)]",
              "hover:-translate-y-1 hover:border-accent/40 hover:shadow-lift",
            )}
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong">
              <PhoneIcon className="size-6" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="text-sm font-bold text-ink">Call us</span>
              <span dir="ltr" className="truncate text-sm text-ink-muted">
                {business.phone}
              </span>
            </span>
          </a>
        </div>

        <ul className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-2">
          <InfoLine
            icon={<BoxIcon className="size-4" />}
            title={localize(business.hoursLabel, locale)}
            detail={localize(business.hoursNote, locale)}
          />
          <InfoLine
            icon={<TruckIcon className="size-4" />}
            title={localize(business.deliveryLabel, locale)}
            detail={localize(business.deliveryNote, locale)}
          />
        </ul>
      </Container>
    </Section>
  );
}

function InfoLine({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-line bg-surface-muted px-4 py-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent-strong">
        {icon}
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-sm font-semibold text-ink">{title}</span>
        <span className="truncate text-xs text-ink-subtle">{detail}</span>
      </span>
    </li>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

const FOOTER_LINKS = [
  {
    heading: "Shop",
    links: [
      { href: "/products", label: "All Products" },
      { href: "/categories", label: "Categories" },
      { href: "/brands", label: "Brands" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/services", label: "Services" },
      { href: "/gallery", label: "Gallery" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Business",
    links: [
      { href: "/b2b/login", label: "B2B Login" },
      { href: "/b2b/register", label: "Request Access" },
      { href: "/employee/login", label: "Employee Portal" },
    ],
  },
] as const;

export function SiteFooter({
  settings,
  locale = "en",
}: {
  settings: SiteSettings;
  locale?: Locale;
}) {
  const { business } = settings;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-navy-950 text-white/70">
      <Container size="wide">
        <div className="grid gap-10 py-16 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm">
            <p className="text-xl font-extrabold text-white">
              {localize(business.name, locale)}
            </p>
            <p className="mt-1 text-sm text-gold-300">
              {localize(business.tagline, locale)}
            </p>
            <p className="mt-5 text-sm leading-relaxed text-white/55">
              {localize(business.address, locale)}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={toWhatsAppHref(business.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-white/35 hover:bg-white/5"
              >
                <WhatsAppIcon className="size-4" />
                WhatsApp
              </a>
              <a
                href={toTelHref(business.phone)}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-white/35 hover:bg-white/5"
              >
                <PhoneIcon className="size-4" />
                Call
              </a>
            </div>
          </div>

          {FOOTER_LINKS.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/40">
                {group.heading}
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/65 transition-colors hover:text-gold-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {localize(business.name, locale)}. All rights reserved.
          </p>
          <p>{localize(business.cashOnlyNote, locale)}</p>
        </div>
      </Container>
    </footer>
  );
}
