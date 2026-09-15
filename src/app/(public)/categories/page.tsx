import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/site/page-header";
import { CATEGORY_ICONS } from "@/components/ui/icons";
import { Card, Container } from "@/components/ui/layout";
import { getCatalog } from "@/lib/data";
import { localize } from "@/lib/domain/types";

export const metadata: Metadata = {
  title: "Categories",
  description:
    "Browse Kogay Karwan wholesale categories — food and beverages, dairy and frozen, household essentials, personal care and more.",
};

export default async function CategoriesPage() {
  const categories = await getCatalog().listCategoryTree();

  return (
    <>
      <PageHeader
        eyebrow="Browse"
        title="Shop by"
        highlight="category"
        lead="Every line we stock, organised. Categories and subcategories are managed in Admin, so the list grows with the catalog."
        crumbs={[{ href: "/", label: "Home" }, { label: "Categories" }]}
      />

      <Container size="wide" className="py-12 sm:py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category.icon ?? "more"];

            return (
              <Card key={category.id} className="p-6">
                <div className="flex items-start gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong">
                    <Icon className="size-6" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-ink">
                      <Link
                        href={`/categories/${category.slug}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {localize(category.name, "en")}
                      </Link>
                    </h2>

                    {category.description ? (
                      <p className="mt-1 text-pretty text-sm leading-relaxed text-ink-muted">
                        {localize(category.description, "en")}
                      </p>
                    ) : null}

                    <p className="mt-1 text-xs text-ink-subtle">
                      {category.productCount ?? 0} products
                    </p>

                    {category.children.length > 0 ? (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {category.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={`/categories/${child.slug}`}
                              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-muted px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-accent/40 hover:text-ink"
                            >
                              {localize(child.name, "en")}
                              <span className="tabular-nums text-ink-subtle">
                                {child.productCount ?? 0}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </>
  );
}
