import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { B2BProductCard } from "@/components/portal/b2b-product-card";
import { AssetImage } from "@/components/ui/asset-image";
import { Badge } from "@/components/ui/layout";
import { requireB2B } from "@/lib/auth/session";
import { getCatalog } from "@/lib/data";
import { localize, stockStatus } from "@/lib/domain/types";
import { formatMoney } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Product",
  robots: { index: false, follow: false },
};

export default async function B2BProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireB2B();
  const { slug } = await params;
  const catalog = getCatalog();

  const product = await catalog.getProductBySlug(slug);
  if (!product || !product.active) notFound();

  const [categories, related] = await Promise.all([
    catalog.listCategories(),
    catalog.listProducts({ categoryId: product.categoryId, pageSize: 5 }),
  ]);

  const category = categories.find((entry) => entry.id === product.categoryId);
  const status = stockStatus(product);
  const name = localize(product.name, "ku");

  const unitPrice = product.discount
    ? {
        ...product.wholesalePrice,
        amount: product.wholesalePrice.amount - product.discount.amount,
      }
    : product.wholesalePrice;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <Link
          href="/b2b/products"
          className="text-sm text-ink-muted underline-offset-4 hover:underline"
        >
          ← Catalog
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-surface-muted p-10">
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

        <div className="flex flex-col">
          {category ? (
            <Link
              href={`/b2b/products?category=${category.slug}`}
              className="text-xs font-bold uppercase tracking-[0.14em] text-accent-strong underline-offset-4 hover:underline"
            >
              {localize(category.name, "ku")}
            </Link>
          ) : null}

          <h1 className="mt-3 text-balance text-3xl font-extrabold leading-tight tracking-tight">
            {name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge
              tone={
                status === "in-stock"
                  ? "success"
                  : status === "low-stock"
                    ? "warning"
                    : "danger"
              }
            >
              {status === "in-stock"
                ? "In stock"
                : status === "low-stock"
                  ? "Low stock"
                  : "Out of stock"}
            </Badge>
            <Badge><span className="font-mono">{product.sku}</span></Badge>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-ink">
              {formatMoney(unitPrice)}
            </span>
            {product.discount ? (
              <span className="text-lg text-ink-subtle line-through">
                {formatMoney(product.wholesalePrice)}
              </span>
            ) : null}
            <span className="text-sm text-ink-subtle">/ {product.unit}</span>
          </div>

          {product.unitsPerCase ? (
            <p className="mt-1 text-sm text-ink-muted">
              {product.unitsPerCase} units per carton
            </p>
          ) : null}

          {product.discount ? (
            <p className="mt-4 rounded-xl border border-accent/25 bg-accent-soft/40 p-4 text-sm text-ink-muted">
              Carton price saves{" "}
              <span className="font-bold text-accent-strong">
                {formatMoney(product.discount)}
              </span>{" "}
              per unit against the single-unit price.
            </p>
          ) : null}

          <div className="mt-8 max-w-xs">
            <B2BProductCard product={product} />
          </div>
        </div>
      </div>

      {related.items.length > 1 ? (
        <section>
          <h2 className="text-lg font-bold text-ink">More in this category</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {related.items
              .filter((entry) => entry.id !== product.id)
              .slice(0, 5)
              .map((entry) => (
                <B2BProductCard key={entry.id} product={entry} />
              ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
