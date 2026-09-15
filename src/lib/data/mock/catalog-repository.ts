import {
  SEED_BRANDS,
  SEED_CATEGORIES,
  SEED_PRODUCTS,
} from "@/lib/data/seed/catalog";
import type { CatalogRepository } from "@/lib/data/repositories";
import type {
  Brand,
  Category,
  CategoryNode,
  Discount,
  Paginated,
  Product,
  ProductQuery,
  ProductSort,
  PublicProduct,
} from "@/lib/domain/types";
import {
  finalPrice,
  isDiscountLive,
  localize,
  toPublicProduct,
} from "@/lib/domain/types";

/**
 * IN-MEMORY CATALOG ADAPTER
 *
 * Stands in for Supabase until the database is connected. It implements the
 * same filtering, sorting and pagination semantics the SQL adapter will, so
 * swapping them cannot change what the UI renders.
 *
 * Module-scoped arrays are intentional: in dev this gives writes that survive
 * navigation, which is what makes the admin screens reviewable. It is not a
 * durability claim — a restart resets it, exactly as a mock should.
 */

const products: Product[] = [...SEED_PRODUCTS];
const categories: Category[] = [...SEED_CATEGORIES];
const brands: Brand[] = [...SEED_BRANDS];
const discounts: Discount[] = [];

const DEFAULT_PAGE_SIZE = 24;

function paginate<T>(items: T[], page = 1, pageSize = DEFAULT_PAGE_SIZE): Paginated<T> {
  const safeSize = Math.max(1, Math.min(pageSize, 200));
  const pageCount = Math.max(1, Math.ceil(items.length / safeSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * safeSize;

  return {
    items: items.slice(start, start + safeSize),
    total: items.length,
    page: safePage,
    pageSize: safeSize,
    pageCount,
  };
}

/**
 * Scored match so `sort: "relevance"` is meaningful. An exact SKU hit must
 * outrank a description mention — a cashier typing a product code wants that
 * row first, not buried under fuzzy text matches.
 */
function scoreProduct(product: Product, term: string): number {
  const needle = term.trim().toLowerCase();
  if (!needle) return 0;

  const sku = product.sku.toLowerCase();
  const name = localize(product.name, "en").toLowerCase();
  const description = product.description
    ? localize(product.description, "en").toLowerCase()
    : "";

  if (sku === needle) return 1000;
  if (sku.includes(needle)) return 500;
  if (name === needle) return 400;
  if (name.startsWith(needle)) return 300;
  if (name.includes(needle)) return 200;

  // Localised names are searchable too — a Kurdish or Arabic query must hit.
  const localizedNames = [product.name.ar, product.name.ku]
    .filter(Boolean)
    .map((value) => value!.toLowerCase());
  if (localizedNames.some((value) => value.includes(needle))) return 180;

  if (description.includes(needle)) return 60;
  return 0;
}

function sortProducts(items: Product[], sort: ProductSort, term: string): Product[] {
  const sorted = [...items];

  switch (sort) {
    case "name-asc":
      return sorted.sort((a, b) =>
        localize(a.name, "en").localeCompare(localize(b.name, "en")),
      );
    case "name-desc":
      return sorted.sort((a, b) =>
        localize(b.name, "en").localeCompare(localize(a.name, "en")),
      );
    case "price-asc":
      return sorted.sort((a, b) => finalPrice(a).amount - finalPrice(b).amount);
    case "price-desc":
      return sorted.sort((a, b) => finalPrice(b).amount - finalPrice(a).amount);
    case "newest":
      return sorted.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    case "relevance":
    default:
      if (!term) {
        // No query: featured first, then stable id order.
        return sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
      }
      return sorted.sort((a, b) => scoreProduct(b, term) - scoreProduct(a, term));
  }
}

function applyQuery(query: ProductQuery = {}): Product[] {
  const term = query.search?.trim() ?? "";
  let result = products;

  if (!query.includeInactive) {
    result = result.filter((product) => product.active);
  }
  if (query.categoryId) {
    result = result.filter(
      (product) =>
        product.categoryId === query.categoryId ||
        product.subcategoryId === query.categoryId,
    );
  }
  if (query.subcategoryId) {
    result = result.filter((product) => product.subcategoryId === query.subcategoryId);
  }
  if (query.brandId) {
    result = result.filter((product) => product.brandId === query.brandId);
  }
  if (query.featured !== undefined) {
    result = result.filter((product) => product.featured === query.featured);
  }
  if (query.inStockOnly) {
    result = result.filter((product) => product.stockQuantity > 0);
  }
  if (term) {
    result = result.filter((product) => scoreProduct(product, term) > 0);
  }

  return sortProducts(result, query.sort ?? "relevance", term);
}

function nextId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export class MockCatalogRepository implements CatalogRepository {
  // --- Products ----------------------------------------------------------

  async listProducts(query: ProductQuery = {}): Promise<Paginated<Product>> {
    return paginate(applyQuery(query), query.page, query.pageSize);
  }

  async listPublicProducts(query: ProductQuery = {}): Promise<Paginated<PublicProduct>> {
    // `includeInactive` is stripped: the public reader must never see hidden rows.
    const page = paginate(
      applyQuery({ ...query, includeInactive: false }),
      query.page,
      query.pageSize,
    );
    return { ...page, items: page.items.map(toPublicProduct) };
  }

  async getProductById(id: string): Promise<Product | null> {
    return products.find((product) => product.id === id) ?? null;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    return products.find((product) => product.slug === slug) ?? null;
  }

  async getProductBySku(sku: string): Promise<Product | null> {
    const needle = sku.trim().toLowerCase();
    return products.find((product) => product.sku.toLowerCase() === needle) ?? null;
  }

  async getPublicProductBySlug(slug: string): Promise<PublicProduct | null> {
    const product = products.find((item) => item.slug === slug && item.active);
    return product ? toPublicProduct(product) : null;
  }

  async listFeaturedProducts(limit = 8): Promise<Product[]> {
    return products.filter((product) => product.featured && product.active).slice(0, limit);
  }

  async listPublicFeaturedProducts(limit = 8): Promise<PublicProduct[]> {
    return (await this.listFeaturedProducts(limit)).map(toPublicProduct);
  }

  async listPublicShowcaseProducts(limit = 8): Promise<PublicProduct[]> {
    const featured = await this.listFeaturedProducts(limit);
    if (featured.length >= limit) return featured.map(toPublicProduct);

    // Nothing curated yet: take one product from each of the largest
    // categories so the rail shows the breadth of the catalog rather than
    // whichever rows happen to sort first.
    const seen = new Set(featured.map((product) => product.id));
    const picked = [...featured];

    for (const category of categories) {
      if (picked.length >= limit) break;

      const candidate = products.find(
        (product) =>
          product.active &&
          product.stockQuantity > 0 &&
          product.categoryId === category.id &&
          !seen.has(product.id),
      );

      if (candidate) {
        picked.push(candidate);
        seen.add(candidate.id);
      }
    }

    return picked.slice(0, limit).map(toPublicProduct);
  }

  async createProduct(
    input: Omit<Product, "id" | "createdAt" | "updatedAt">,
  ): Promise<Product> {
    const timestamp = new Date().toISOString();
    const product: Product = {
      ...input,
      id: nextId("p"),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    products.unshift(product);
    return product;
  }

  async updateProduct(id: string, patch: Partial<Product>): Promise<Product> {
    const index = products.findIndex((product) => product.id === id);
    if (index === -1) throw new Error(`Product ${id} not found`);

    const updated: Product = {
      ...products[index],
      ...patch,
      id: products[index].id, // id is never patchable
      updatedAt: new Date().toISOString(),
    };
    products[index] = updated;
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    const index = products.findIndex((product) => product.id === id);
    if (index !== -1) products.splice(index, 1);
  }

  async bulkUpsertProducts(rows: Product[]): Promise<{ inserted: number; updated: number }> {
    let inserted = 0;
    let updated = 0;

    for (const row of rows) {
      const index = products.findIndex((product) => product.sku === row.sku);
      if (index === -1) {
        products.push(row);
        inserted += 1;
      } else {
        products[index] = { ...row, id: products[index].id };
        updated += 1;
      }
    }

    return { inserted, updated };
  }

  // --- Categories --------------------------------------------------------

  async listCategories(): Promise<Category[]> {
    return categories.filter((category) => category.active);
  }

  async listCategoryTree(): Promise<CategoryNode[]> {
    const active = categories.filter((category) => category.active);
    const byParent = new Map<string | null, Category[]>();

    for (const category of active) {
      const bucket = byParent.get(category.parentId) ?? [];
      bucket.push(category);
      byParent.set(category.parentId, bucket);
    }

    const countFor = (categoryId: string) =>
      products.filter(
        (product) =>
          product.active &&
          (product.categoryId === categoryId || product.subcategoryId === categoryId),
      ).length;

    const build = (parentId: string | null): CategoryNode[] =>
      (byParent.get(parentId) ?? [])
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((category) => ({
          ...category,
          productCount: countFor(category.id),
          children: build(category.id),
        }));

    return build(null);
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return categories.find((category) => category.slug === slug) ?? null;
  }

  async createCategory(input: Omit<Category, "id">): Promise<Category> {
    const category: Category = { ...input, id: nextId("c") };
    categories.push(category);
    return category;
  }

  async updateCategory(id: string, patch: Partial<Category>): Promise<Category> {
    const index = categories.findIndex((category) => category.id === id);
    if (index === -1) throw new Error(`Category ${id} not found`);
    categories[index] = { ...categories[index], ...patch, id };
    return categories[index];
  }

  async deleteCategory(id: string): Promise<void> {
    const index = categories.findIndex((category) => category.id === id);
    if (index !== -1) categories.splice(index, 1);
  }

  // --- Brands ------------------------------------------------------------

  async listBrands(options: { featuredOnly?: boolean } = {}): Promise<Brand[]> {
    return brands
      .filter((brand) => brand.active && (!options.featuredOnly || brand.featured))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async getBrandBySlug(slug: string): Promise<Brand | null> {
    return brands.find((brand) => brand.slug === slug) ?? null;
  }

  async createBrand(input: Omit<Brand, "id">): Promise<Brand> {
    const brand: Brand = { ...input, id: nextId("b") };
    brands.push(brand);
    return brand;
  }

  async updateBrand(id: string, patch: Partial<Brand>): Promise<Brand> {
    const index = brands.findIndex((brand) => brand.id === id);
    if (index === -1) throw new Error(`Brand ${id} not found`);
    brands[index] = { ...brands[index], ...patch, id };
    return brands[index];
  }

  async deleteBrand(id: string): Promise<void> {
    const index = brands.findIndex((brand) => brand.id === id);
    if (index !== -1) brands.splice(index, 1);
  }

  // --- Discounts ---------------------------------------------------------

  async listDiscounts(options: { liveOnly?: boolean } = {}): Promise<Discount[]> {
    const list = options.liveOnly
      ? discounts.filter((discount) => isDiscountLive(discount))
      : discounts;
    return [...list].sort((a, b) => a.displayPosition - b.displayPosition);
  }

  async createDiscount(input: Omit<Discount, "id" | "createdAt">): Promise<Discount> {
    const discount: Discount = {
      ...input,
      id: nextId("d"),
      createdAt: new Date().toISOString(),
    };
    discounts.push(discount);
    return discount;
  }

  async updateDiscount(id: string, patch: Partial<Discount>): Promise<Discount> {
    const index = discounts.findIndex((discount) => discount.id === id);
    if (index === -1) throw new Error(`Discount ${id} not found`);
    discounts[index] = { ...discounts[index], ...patch, id };
    return discounts[index];
  }

  async deleteDiscount(id: string): Promise<void> {
    const index = discounts.findIndex((discount) => discount.id === id);
    if (index !== -1) discounts.splice(index, 1);
  }
}
