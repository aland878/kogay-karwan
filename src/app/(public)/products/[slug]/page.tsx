import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/site/page-header";
import { ProductCard } from "@/components/site/product-card";
import { AssetImage } from "@/components/ui/asset-image";
import { ArrowRight, ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Badge, Container, SectionHeading } from "@/components/ui/layout";
import { getCatalog, getSettings } from "@/lib/data";
import type { StockStatus } from "@/lib/domain/types";
import { localize } from "@/lib/domain/types";
import { toWhatsAppHref } from "@/lib/utils";

const AVAILABILITY: Record<
  StockStatus,
  { label: string; tone: "success" | "warning" | "danger" }
> = {
  "in-stock": { label: "In stock", tone: "success" },
  "low-stock": { label: "Limited stock", tone: "warning" },
  "out-of-stock": { label: "Out of stock", tone: "danger" },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalog().getPublicProductBySlug(slug);

  if (!product) return { title: "Product not found" };

  const name = localize(product.name, "en");
  const description = product.description
    ? localize(product.description, "en")
    : `${name} — available wholesale from Kogay Karwan, Erbil.`;

  return {
    title: name,
    description,
    openGraph: { title: name, description, type: "website" },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const catalog = getCatalog();

  const product = await catalog.getPublicProductBySlug(slug);
  if (!product) notFound();

  const [settings, brands, categories] = await Promise.all([
    getSettings().getSettings(),
    catalog.listBrands(),
    catalog.listCategories(),
  ]);

  const brand = brands.find((entry) => entry.id === product.brandId);
  const category = categories.find((entry) => entry.id === product.categoryId);
  const availability = AVAILABILITY[product.availability];

  // Same-subcategory siblings, with this product filtered out.
  const relatedPage = await catalog.listPublicProducts({
    categoryId: product.subcategoryId ?? product.categoryId,
    pageSize: 5,
  });
  const related = relatedPage.items
    .filter((entry) => entry.id !== product.id)
    .slice(0, 4);

  const name = localize(product.name, "en");

  return (
    <>
      <Container size="wide" className="pt-28 sm:pt-32">
        <Breadcrumbs
          crumbs={[
            { href: "/", label: "Home" },
            { href: "/products", label: "Products" },
            ...(category
              ? [
                  {
                    href: `/categories/${category.slug}`,
                    label: localize(category.name, "en"),
                  },
                ]
              : []),
            { label: name },
          ]}
        />
      </Container>

      <Container size="wide" className="py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* --- Image --- */}
          <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-surface-muted p-10">
            <div
              aria-hidden="true"
              className="absolute inset-x-12 bottom-8 h-8 rounded-[50%] bg-accent/20 blur-2xl"
            />
            <div className="relative size-full">
              <AssetImage
                asset={product.image}
                fallbackLabel={name}
                sizes="(max-width: 1024px) 90vw, 45vw"
                priority
                fallbackRatio={1}
              />
            </div>
          </div>

          {/* --- Detail --- */}
          <div className="flex flex-col">
            {brand ? (
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-accent-strong">
                {brand.name}
              </span>
            ) : null}

            <h1 className="mt-3 text-balance text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
              {name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge tone={availability.tone}>{availability.label}</Badge>
              {product.featured ? <Badge tone="gold">Featured</Badge> : null}
              <Badge>
                <span className="font-mono">{product.sku}</span>
              </Badge>
            </div>

            {product.description ? (
              <p className="mt-6 text-pretty text-base leading-relaxed text-ink-muted">
                {localize(product.description, "en")}
              </p>
            ) : null}

            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line">
              <Spec label="Product code" value={product.sku} mono />
              <Spec label="Unit" value={formatUnit(product.unit)} />
              {product.unitsPerCase ? (
                <Spec label="Per case" value={`${product.unitsPerCase} units`} />
              ) : null}
              {category ? (
                <Spec label="Category" value={localize(category.name, "en")} />
              ) : null}
            </dl>

            {/* Pricing is intentionally absent. `PublicProduct` carries no
                wholesale price, so this panel invites access instead. */}
            <div className="mt-8 rounded-2xl border border-accent/25 bg-accent-soft/40 p-6">
              <h2 className="text-base font-bold text-ink">
                Wholesale pricing for approved businesses
              </h2>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-ink-muted">
                Prices and case quantities are available once your business is
                verified. Approval is usually same-day during business hours.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <ButtonLink href="/b2b/register" className="group" trailing={<ArrowRight />}>
                  Request B2B access
                </ButtonLink>
                <ButtonLink
                  href={toWhatsAppHref(
                    settings.business.whatsapp,
                    `Hello Kogay Karwan, I'd like a wholesale price for ${name} (${product.sku}).`,
                  )}
                  variant="secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                  leading={<WhatsAppIcon className="size-4 text-leaf-600" />}
                >
                  Ask on WhatsApp
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-20">
            <SectionHeading eyebrow="Related" title="Others in this" highlight="category" />
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {related.map((entry) => (
                <ProductCard
                  key={entry.id}
                  product={entry}
                  brandName={
                    brands.find((brandEntry) => brandEntry.id === entry.brandId)?.name
                  }
                />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </>
  );
}

function Spec({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="bg-surface px-4 py-3">
      <dt className="text-xs font-medium text-ink-subtle">{label}</dt>
      <dd
        className={`mt-1 text-sm font-semibold text-ink ${mono ? "font-mono" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

function formatUnit(unit: string): string {
  const labels: Record<string, string> = {
    piece: "Piece",
    case: "Case",
    kg: "Kilogram",
    litre: "Litre",
    pack: "Pack",
    carton: "Carton",
  };
  return labels[unit] ?? unit;
}
