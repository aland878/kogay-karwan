import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Pagination } from "@/components/site/catalog/pagination";
import { PageHeader } from "@/components/site/page-header";
import { ProductCard } from "@/components/site/product-card";
import { AssetImage } from "@/components/ui/asset-image";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import { getCatalog } from "@/lib/data";
import { pluralize } from "@/lib/utils";

const PAGE_SIZE = 24;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getCatalog().getBrandBySlug(slug);

  if (!brand) return { title: "Brand not found" };

  return {
    title: brand.name,
    description: `${brand.name} products available wholesale from Kogay Karwan, Erbil.`,
  };
}

export default async function BrandPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const catalog = getCatalog();

  const brand = await catalog.getBrandBySlug(slug);
  if (!brand) notFound();

  const page = Math.max(1, Number.parseInt(query.page ?? "1", 10) || 1);
  const results = await catalog.listPublicProducts({
    brandId: brand.id,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <>
      <PageHeader
        eyebrow="Brand"
        title={brand.name}
        lead={`Every ${brand.name} line we currently stock for wholesale supply across Erbil.`}
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/brands", label: "Brands" },
          { label: brand.name },
        ]}
      >
        <div className="relative h-14 w-44">
          <AssetImage
            asset={brand.logo}
            fallbackLabel={brand.name}
            sizes="180px"
            fallbackRatio={3 / 1}
            priority
          />
        </div>
      </PageHeader>

      <Container size="wide" className="py-12 sm:py-16">
        <p className="text-sm text-ink-muted">{pluralize(results.total, "product")}</p>

        {results.items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
            <h2 className="text-lg font-bold text-ink">No products listed</h2>
            <p className="mt-2 text-sm text-ink-muted">
              We stock this brand, but no lines are published right now.
            </p>
            <ButtonLink href="/products" variant="secondary" className="mt-6">
              Browse all products
            </ButtonLink>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {results.items.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  brandName={brand.name}
                  priority={index < 4}
                />
              ))}
            </div>

            <Pagination
              page={results.page}
              pageCount={results.pageCount}
              baseHref={`/brands/${brand.slug}`}
              searchParams={query}
            />
          </>
        )}
      </Container>
    </>
  );
}
