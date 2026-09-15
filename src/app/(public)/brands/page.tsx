import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/site/page-header";
import { AssetImage } from "@/components/ui/asset-image";
import { Container } from "@/components/ui/layout";
import { getCatalog } from "@/lib/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Brands",
  description:
    "The brands Kogay Karwan supplies wholesale in Erbil — Pepsi, Coca-Cola, Ülker, Altunsa, Almarai, Mahmood Rice, ZER and more.",
};

export default async function BrandsPage() {
  const catalog = getCatalog();
  const [brands, products] = await Promise.all([
    catalog.listBrands(),
    catalog.listPublicProducts({ pageSize: 200 }),
  ]);

  // One pass to count per brand, rather than a query per brand.
  const counts = new Map<string, number>();
  for (const product of products.items) {
    if (!product.brandId) continue;
    counts.set(product.brandId, (counts.get(product.brandId) ?? 0) + 1);
  }

  return (
    <>
      <PageHeader
        eyebrow="Partners"
        title="Brands we"
        highlight="stock"
        lead="We buy direct from trusted regional and international brands. That is what keeps stock consistent and wholesale prices competitive."
        crumbs={[{ href: "/", label: "Home" }, { label: "Brands" }]}
      />

      <Container size="wide" className="py-12 sm:py-16">
        <ul className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand) => (
            <li key={brand.id}>
              <Link
                href={`/brands/${brand.slug}`}
                className={cn(
                  "group flex h-full flex-col items-center justify-center gap-4 rounded-2xl",
                  "border border-line bg-surface p-8 shadow-card",
                  "transition-[transform,box-shadow,border-color] duration-[var(--duration-base)]",
                  "ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:border-accent/35 hover:shadow-lift",
                )}
              >
                <div className="relative h-12 w-full opacity-75 grayscale transition-all duration-[var(--duration-base)] group-hover:opacity-100 group-hover:grayscale-0">
                  <AssetImage
                    asset={brand.logo}
                    fallbackLabel={brand.name}
                    sizes="180px"
                    fallbackRatio={3 / 1}
                  />
                </div>

                <span className="flex flex-col items-center gap-0.5 text-center">
                  <span className="text-sm font-bold text-ink">{brand.name}</span>
                  <span className="text-xs text-ink-subtle">
                    {counts.get(brand.id) ?? 0} products
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
