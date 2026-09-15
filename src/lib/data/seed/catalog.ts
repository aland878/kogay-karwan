import { BRAND_LOGOS } from "@/lib/assets";
import type { Brand, Category, Product } from "@/lib/domain/types";

import catalogJson from "./catalog.json";

/**
 * SEED CATALOG
 *
 * Products and categories are generated from the business's own price list by
 * `scripts/import-catalog.py` into `catalog.json`. Re-run that script to refresh
 * them; nothing here is hand-maintained.
 *
 * Kurdish is the authoritative language: `name.ku` holds the normalised Sorani
 * spelling and `name.en` keeps the original as-typed text, so a search works
 * whichever way a product is spelled.
 *
 * Prices are IQD. Money is stored in minor units and the dinar has none, so the
 * integer in the sheet is the integer stored.
 */

type CatalogJson = {
  source: string;
  productCount: number;
  categoryCount: number;
  currency: string;
  categories: Category[];
  products: Product[];
};

const catalog = catalogJson as unknown as CatalogJson;

/** Timestamps are not in the source; one import date stands for the whole load. */
const IMPORTED_AT = "2026-09-15T00:00:00.000Z";

export const SEED_CATEGORIES: Category[] = catalog.categories;

export const SEED_PRODUCTS: Product[] = catalog.products.map((product) => ({
  ...product,
  createdAt: IMPORTED_AT,
  updatedAt: IMPORTED_AT,
}));

export const CATALOG_SOURCE = {
  file: catalog.source,
  productCount: catalog.productCount,
  categoryCount: catalog.categoryCount,
  currency: catalog.currency,
};

/**
 * Brands shown in the Trusted Brands strip.
 *
 * The price list has no brand column, so no product is attributed to a brand:
 * guessing from a product name would mis-credit stock on a commercial site.
 * Add a brand column to the sheet and the importer can link them.
 */
export const SEED_BRANDS: Brand[] = [
  { id: "b-pepsi", slug: "pepsi", name: "Pepsi", logo: BRAND_LOGOS.pepsi, featured: true, sortOrder: 1, active: true },
  { id: "b-coca-cola", slug: "coca-cola", name: "Coca-Cola", logo: BRAND_LOGOS.cocaCola, featured: true, sortOrder: 2, active: true },
  { id: "b-ulker", slug: "ulker", name: "Ülker", logo: BRAND_LOGOS.ulker, featured: true, sortOrder: 3, active: true },
  { id: "b-altunsa", slug: "altunsa", name: "Altunsa", logo: BRAND_LOGOS.altunsa, featured: true, sortOrder: 4, active: true },
  { id: "b-almarai", slug: "almarai", name: "Almarai", logo: BRAND_LOGOS.almarai, featured: true, sortOrder: 5, active: true },
  { id: "b-mahmood", slug: "mahmood-rice", name: "Mahmood Rice", logo: BRAND_LOGOS.mahmoodRice, featured: true, sortOrder: 6, active: true },
  { id: "b-zer", slug: "zer", name: "ZER", logo: BRAND_LOGOS.zer, featured: true, sortOrder: 7, active: true },
  { id: "b-metro", slug: "metro", name: "Ülker Metro", logo: BRAND_LOGOS.metro, featured: true, sortOrder: 8, active: true },
];
