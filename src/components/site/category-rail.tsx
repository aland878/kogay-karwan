import Link from "next/link";

import { CATEGORY_ICONS } from "@/components/ui/icons";
import { Container } from "@/components/ui/layout";
import type { CategoryNode, Locale } from "@/lib/domain/types";
import { localize } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/**
 * CATEGORY RAIL — the icon row beneath the brands strip in the reference.
 *
 * Renders top-level categories only. It is driven by the category tree, so
 * adding categories in Admin extends the rail; nothing here assumes five.
 */

export function CategoryRail({
  categories,
  locale = "en",
}: {
  categories: CategoryNode[];
  locale?: Locale;
}) {
  if (categories.length === 0) return null;

  return (
    <section aria-labelledby="category-rail-heading" className="py-8 sm:py-10">
      <Container size="wide">
        <h2 id="category-rail-heading" className="sr-only">
          Product categories
        </h2>

        <ul
          className={cn(
            "flex gap-3 overflow-x-auto pb-2 sm:gap-4",
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            "lg:grid lg:grid-cols-5 lg:overflow-visible",
          )}
        >
          {categories.slice(0, 5).map((category) => {
            const Icon = CATEGORY_ICONS[category.icon ?? "more"];

            return (
              <li key={category.id} className="min-w-[13rem] flex-1 lg:min-w-0">
                <Link
                  href={`/categories/${category.slug}`}
                  className={cn(
                    "group flex h-full items-center gap-3 rounded-2xl border border-line",
                    "bg-surface px-4 py-4 shadow-card transition-[transform,box-shadow,border-color]",
                    "duration-[var(--duration-base)] ease-[var(--ease-out-quint)]",
                    "hover:-translate-y-1 hover:border-accent/35 hover:shadow-lift",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-11 shrink-0 place-items-center rounded-xl",
                      "bg-accent-soft text-accent-strong transition-colors",
                      "duration-[var(--duration-base)] group-hover:bg-accent group-hover:text-white",
                    )}
                  >
                    <Icon className="size-[1.375rem]" />
                  </span>

                  <span className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate text-sm font-bold text-ink">
                      {localize(category.name, locale)}
                    </span>
                    {category.productCount !== undefined ? (
                      <span className="text-xs text-ink-subtle">
                        {category.productCount} products
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
