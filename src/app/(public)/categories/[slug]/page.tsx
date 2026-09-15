import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Pagination } from "@/components/site/catalog/pagination";
import { PageHeader } from "@/components/site/page-header";
import { ProductCard } from "@/components/site/product-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";
import { getCatalog } from "@/lib/data";
import { pluralize } from "@/lib/utils";
import { localize } from "@/lib/domain/types";

const PAGE_SIZE = 24;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCatalog().getCategoryBySlug(slug);

  if (!category) return { title: "Category not found" };

  const name = localize(category.name, "en");
  return {
    title: name,
    description: category.description
      ? localize(category.description, "en")
      : `${name} available wholesale from Kogay Karwan, Erbil.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const catalog = getCatalog();

  const category = await catalog.getCategoryBySlug(slug);
  if (!category) notFound();

  const page = Math.max(1, Number.parseInt(query.page ?? "1", 10) || 1);

  const [results, brands, tree] = await Promise.all([
    catalog.listPublicProducts({ categoryId: category.id, page, pageSize: PAGE_SIZE }),
    catalog.listBrands(),
    catalog.listCategoryTree(),
  ]);

  // Subcategories of this category, if it is a top-level one.
  const node = tree.find((entry) => entry.id === category.id);
  const parent = category.parentId
    ? tree.find((entry) => entry.id === category.parentId)
    : null;

  const name = localize(category.name, "en");

  return (
    <>
      <PageHeader
        eyebrow="Category"
        title={name}
        lead={category.description ? localize(category.description, "en") : undefined}
        crumbs={[
          { href: "/", label: "Home" },
          { href: "/categories", label: "Categories" },
          ...(parent
            ? [
                {
                  href: `/categories/${parent.slug}`,
                  label: localize(parent.name, "en"),
                },
              ]
            : []),
          { label: name },
        ]}
      >
        {node && node.children.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {node.children.map((child) => (
              <li key={child.id}>
                <Link
                  href={`/categories/${child.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:border-accent/40 hover:text-ink"
                >
                  {localize(child.name, "en")}
                  <span className="tabular-nums text-xs text-ink-subtle">
                    {child.productCount ?? 0}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </PageHeader>

      <Container size="wide" className="py-12 sm:py-16">
        <p className="text-sm text-ink-muted">{pluralize(results.total, "product")}</p>

        {results.items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
            <h2 className="text-lg font-bold text-ink">Nothing here yet</h2>
            <p className="mt-2 text-sm text-ink-muted">
              This category has no active products right now.
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
                  brandName={
                    brands.find((entry) => entry.id === product.brandId)?.name
                  }
                  priority={index < 4}
                />
              ))}
            </div>

            <Pagination
              page={results.page}
              pageCount={results.pageCount}
              baseHref={`/categories/${category.slug}`}
              searchParams={query}
            />
          </>
        )}
      </Container>
    </>
  );
}
