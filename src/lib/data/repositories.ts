import type {
  Brand,
  Category,
  CategoryNode,
  Discount,
  GalleryItem,
  Order,
  OrderStatus,
  Paginated,
  Product,
  ProductQuery,
  PublicProduct,
  SiteSettings,
} from "@/lib/domain/types";

/**
 * REPOSITORY CONTRACTS
 *
 * The seam between the application and its storage. Pages and components depend
 * on these interfaces only; they never import an adapter directly. Connecting
 * Supabase means writing a second set of classes that satisfy these same
 * signatures and flipping one factory in `./index.ts`.
 *
 * Every method is async even where the mock is synchronous — otherwise every
 * call site would need rewriting the day a network hop appears.
 */

export interface CatalogRepository {
  // --- Products ----------------------------------------------------------
  /** Full rows including wholesale pricing. B2B, employee and admin only. */
  listProducts(query?: ProductQuery): Promise<Paginated<Product>>;
  /** Pricing-stripped rows. The only product reader the public site may call. */
  listPublicProducts(query?: ProductQuery): Promise<Paginated<PublicProduct>>;

  getProductById(id: string): Promise<Product | null>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getProductBySku(sku: string): Promise<Product | null>;
  getPublicProductBySlug(slug: string): Promise<PublicProduct | null>;

  listFeaturedProducts(limit?: number): Promise<Product[]>;
  listPublicFeaturedProducts(limit?: number): Promise<PublicProduct[]>;
  /**
   * Products to lead the homepage: the featured ones when Admin has picked
   * any, otherwise a spread across categories so the rail is never empty on a
   * freshly imported catalog.
   */
  listPublicShowcaseProducts(limit?: number): Promise<PublicProduct[]>;

  createProduct(input: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product>;
  updateProduct(id: string, patch: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  /** Bulk path used by the Excel/CSV importer. Validated before it is called. */
  bulkUpsertProducts(rows: Product[]): Promise<{ inserted: number; updated: number }>;

  // --- Categories --------------------------------------------------------
  listCategories(): Promise<Category[]>;
  /** Top-level categories with children resolved, for menus and the tree. */
  listCategoryTree(): Promise<CategoryNode[]>;
  getCategoryBySlug(slug: string): Promise<Category | null>;
  createCategory(input: Omit<Category, "id">): Promise<Category>;
  updateCategory(id: string, patch: Partial<Category>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  // --- Brands ------------------------------------------------------------
  listBrands(options?: { featuredOnly?: boolean }): Promise<Brand[]>;
  getBrandBySlug(slug: string): Promise<Brand | null>;
  createBrand(input: Omit<Brand, "id">): Promise<Brand>;
  updateBrand(id: string, patch: Partial<Brand>): Promise<Brand>;
  deleteBrand(id: string): Promise<void>;

  // --- Discounts ---------------------------------------------------------
  listDiscounts(options?: { liveOnly?: boolean }): Promise<Discount[]>;
  createDiscount(input: Omit<Discount, "id" | "createdAt">): Promise<Discount>;
  updateDiscount(id: string, patch: Partial<Discount>): Promise<Discount>;
  deleteDiscount(id: string): Promise<void>;
}

export interface OrderRepository {
  listOrders(options?: {
    customerId?: string;
    status?: OrderStatus;
    assignedEmployeeId?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<Paginated<Order>>;
  getOrderById(id: string): Promise<Order | null>;
  getOrderByNumber(orderNumber: string): Promise<Order | null>;
  createOrder(input: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt" | "history">): Promise<Order>;
  /** Validates the transition server-side before writing. */
  updateOrderStatus(
    id: string,
    status: OrderStatus,
    actor: { id: string; name: string },
    reason?: string,
  ): Promise<Order>;
  assignOrder(id: string, employeeId: string): Promise<Order>;
}

export interface SettingsRepository {
  getSettings(): Promise<SiteSettings>;
  updateSettings(patch: Partial<SiteSettings>): Promise<SiteSettings>;
  /** Narrow writer for the Website Appearance screen. */
  setTheme(theme: SiteSettings["theme"]): Promise<SiteSettings>;

  /** Gallery is site content, managed alongside the rest of the CMS copy. */
  listGallery(options?: { group?: GalleryItem["group"] }): Promise<GalleryItem[]>;
  createGalleryItem(input: Omit<GalleryItem, "id">): Promise<GalleryItem>;
  updateGalleryItem(id: string, patch: Partial<GalleryItem>): Promise<GalleryItem>;
  deleteGalleryItem(id: string): Promise<void>;
}

/** The full set of repositories, resolved once per request. */
export type DataContext = {
  catalog: CatalogRepository;
  orders: OrderRepository;
  settings: SettingsRepository;
};
