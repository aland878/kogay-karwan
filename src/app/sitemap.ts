import type { MetadataRoute } from "next";

import { getCatalog } from "@/lib/data";

const BASE = "https://kogaykarwan.com";

/**
 * Sitemap built from the live catalog, so new products, categories and brands
 * are discoverable without anyone maintaining a list by hand.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = getCatalog();

  const [products, categories, brands] = await Promise.all([
    // Cap the product sweep: a sitemap file may hold at most 50,000 URLs, and
    // splitting into an index is the right move well before that becomes a risk.
    catalog.listPublicProducts({ pageSize: 200 }),
    catalog.listCategories(),
    catalog.listBrands(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/categories`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/brands`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/services`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/gallery`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/b2b/register`, changeFrequency: "monthly", priority: 0.7 },
  ];

  return [
    ...staticRoutes,
    ...categories.map((category) => ({
      url: `${BASE}/categories/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...brands.map((brand) => ({
      url: `${BASE}/brands/${brand.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...products.items.map((product) => ({
      url: `${BASE}/products/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
