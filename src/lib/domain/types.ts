/**
 * KOGAY KARWAN — DOMAIN MODEL
 *
 * The single source of truth for every entity in the platform. These types are
 * storage-agnostic on purpose: the mock adapter and the future Supabase adapter
 * both satisfy the same shapes, so swapping the backend touches the adapter
 * only — never a component, never a page.
 *
 * Naming maps 1:1 to the planned Postgres tables (snake_case columns are
 * translated in the adapter boundary, not here).
 */

// ---------------------------------------------------------------------------
// Localisation
// ---------------------------------------------------------------------------

/** Kurdish (Sorani), Arabic, English. `ku` and `ar` both render RTL. */
export type Locale = "en" | "ar" | "ku";

export const LOCALES: readonly Locale[] = ["en", "ar", "ku"] as const;
export const DEFAULT_LOCALE: Locale = "en";
export const RTL_LOCALES: readonly Locale[] = ["ar", "ku"] as const;

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

/**
 * A translated string. `en` is required as the fallback so the UI can never
 * render an empty label; `ar`/`ku` are optional until content is filled in.
 */
export type Localized = {
  en: string;
  ar?: string;
  ku?: string;
};

export function localize(value: Localized, locale: Locale): string {
  return value[locale]?.trim() || value.en;
}

// ---------------------------------------------------------------------------
// Money
// ---------------------------------------------------------------------------

/**
 * Money is stored as an INTEGER count of minor units, never a float.
 * Wholesale totals multiply quantity by price thousands of times over; binary
 * floats drift and the invoice stops reconciling with the cash drawer.
 */
export type Money = {
  /** Minor units. USD -> cents. IQD has no minor unit, so `minor` is 1. */
  amount: number;
  currency: CurrencyCode;
};

export type CurrencyCode = "USD" | "IQD";

export const CURRENCY: Record<
  CurrencyCode,
  { code: CurrencyCode; symbol: string; minor: number; label: string }
> = {
  USD: { code: "USD", symbol: "$", minor: 100, label: "US Dollar" },
  IQD: { code: "IQD", symbol: "د.ع", minor: 1, label: "Iraqi Dinar" },
};

export function money(amount: number, currency: CurrencyCode = "USD"): Money {
  return { amount: Math.round(amount), currency };
}

export function addMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot add ${a.currency} to ${b.currency}`);
  }
  return { amount: a.amount + b.amount, currency: a.currency };
}

export function multiplyMoney(value: Money, factor: number): Money {
  return { amount: Math.round(value.amount * factor), currency: value.currency };
}

export function subtractMoney(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot subtract ${b.currency} from ${a.currency}`);
  }
  return { amount: a.amount - b.amount, currency: a.currency };
}

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

export type Brand = {
  id: string;
  slug: string;
  name: string;
  /** Wordmark used in the Trusted Brands strip. Transparent PNG or SVG. */
  logo: ImageRef | null;
  /** Surfaces the brand in the public Trusted Brands strip. */
  featured: boolean;
  sortOrder: number;
  active: boolean;
};

export type Category = {
  id: string;
  slug: string;
  name: Localized;
  description?: Localized;
  /** `null` marks a top-level category; otherwise the parent's id. */
  parentId: string | null;
  icon?: CategoryIcon;
  image?: ImageRef | null;
  sortOrder: number;
  active: boolean;
  /** Denormalised counter. The adapter keeps it fresh; the UI never computes it. */
  productCount?: number;
};

export type CategoryIcon =
  | "food"
  | "dairy"
  | "household"
  | "personal-care"
  | "grains"
  | "beverages"
  | "snacks"
  | "frozen"
  | "cleaning"
  | "more";

/** A category with its children resolved — what the mega-menu and tree render. */
export type CategoryNode = Category & { children: CategoryNode[] };

export type ImageRef = {
  /** Path under /public today; a Supabase Storage public URL later. */
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export type Product = {
  id: string;
  /** Stable, human-facing product code. Cashier and B2B both search on it. */
  sku: string;
  slug: string;

  name: Localized;
  description?: Localized;

  brandId: string | null;
  categoryId: string;
  subcategoryId: string | null;

  image: ImageRef | null;
  /** Additional angles / packaging shots. Order is display order. */
  gallery: ImageRef[];

  /**
   * Wholesale unit price. NEVER serialise this to a public (unauthenticated)
   * response — `toPublicProduct()` strips it. Pricing is B2B-only by policy.
   */
  wholesalePrice: Money;
  /** Flat monetary discount, not a percentage. `null` when not discounted. */
  discount: Money | null;

  /**
   * `false` means the business knows whether an item is available but does not
   * count units — which is how the imported price list works. When untracked,
   * `stockQuantity` is a flag (0 = unavailable, >0 = available) and no count is
   * ever shown, because inventing one would be fabricating inventory data.
   */
  stockTracked: boolean;
  stockQuantity: number;
  /** Below this, `stockStatus` reports "low-stock". Per-product, admin-set. */
  lowStockThreshold: number;

  unit: ProductUnit;
  /** e.g. 24 cans per case — what a wholesale buyer actually orders. */
  unitsPerCase?: number;

  featured: boolean;
  active: boolean;

  createdAt: string;
  updatedAt: string;
};

export type ProductUnit = "piece" | "case" | "kg" | "litre" | "pack" | "carton";

/** Derived, never stored: keeps price maths in one place. */
export function finalPrice(product: Product): Money {
  if (!product.discount) return product.wholesalePrice;
  return subtractMoney(product.wholesalePrice, product.discount);
}

export function stockStatus(product: Product): StockStatus {
  if (product.stockQuantity <= 0) return "out-of-stock";
  // Untracked lines have no count, so "low stock" is not a state they can reach.
  if (!product.stockTracked) return "in-stock";
  if (product.stockQuantity <= product.lowStockThreshold) return "low-stock";
  return "in-stock";
}

/**
 * How many units a buyer may order.
 *
 * Untracked products are not capped at their availability flag — a flag of 1
 * means "we have it", not "we have one", and clamping an order to a single
 * carton would be wrong. Tracked products cap at the real count.
 */
export const UNTRACKED_ORDER_CEILING = 9999;

export function maxOrderableQuantity(product: Product): number {
  if (product.stockQuantity <= 0) return 0;
  return product.stockTracked ? product.stockQuantity : UNTRACKED_ORDER_CEILING;
}

/**
 * The public projection of a product.
 *
 * Wholesale price, discount and exact stock count are removed here rather than
 * hidden in the UI. Public visitors browse the catalog; they do not get pricing.
 */
export type PublicProduct = Omit<
  Product,
  "wholesalePrice" | "discount" | "stockQuantity" | "lowStockThreshold"
> & {
  /** Coarse availability only — no exact count leaks publicly. */
  availability: StockStatus;
};

export function toPublicProduct(product: Product): PublicProduct {
  const {
    wholesalePrice: _wholesalePrice,
    discount: _discount,
    stockQuantity: _stockQuantity,
    lowStockThreshold: _lowStockThreshold,
    ...rest
  } = product;
  return { ...rest, availability: stockStatus(product) };
}

// ---------------------------------------------------------------------------
// Catalog querying — built for 5,000+ products and 200+ categories
// ---------------------------------------------------------------------------

export type ProductSort =
  | "relevance"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "newest";

export type ProductQuery = {
  /** Free text across name, SKU and description. */
  search?: string;
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
  featured?: boolean;
  /** Admin-only: include deactivated rows. Public/B2B callers never set this. */
  includeInactive?: boolean;
  inStockOnly?: boolean;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

export function emptyPage<T>(pageSize = 24): Paginated<T> {
  return { items: [], total: 0, page: 1, pageSize, pageCount: 0 };
}

// ---------------------------------------------------------------------------
// Identity, roles and permissions
// ---------------------------------------------------------------------------

/** The four audiences. Each has its own login; none is a superset by default. */
export type Audience = "public" | "b2b" | "employee" | "admin";

export type EmployeeRole =
  | "cashier"
  | "sales"
  | "warehouse"
  | "delivery"
  | "support"
  | "manager";

/**
 * Permissions are granular and data-driven so Admin can recompose roles later
 * without a deploy. `ROLE_PERMISSIONS` is the seed, not a hard-coded ceiling.
 */
export type Permission =
  | "orders.view"
  | "orders.create"
  | "orders.update-status"
  | "orders.reject"
  | "orders.print"
  | "orders.assign"
  | "products.view"
  | "products.create"
  | "products.update"
  | "products.delete"
  | "products.import"
  | "inventory.view"
  | "inventory.update"
  | "discounts.view"
  | "discounts.manage"
  | "customers.view"
  | "customers.manage"
  | "customers.approve"
  | "employees.view"
  | "employees.manage"
  | "updates.view"
  | "updates.publish"
  | "content.view"
  | "content.manage"
  | "appearance.manage"
  | "analytics.view"
  | "audit.view"
  | "cashier.operate";

export const ROLE_PERMISSIONS: Record<EmployeeRole, readonly Permission[]> = {
  cashier: [
    "cashier.operate",
    "orders.view",
    "orders.create",
    "orders.print",
    "products.view",
    "inventory.view",
    "updates.view",
  ],
  sales: [
    "orders.view",
    "orders.create",
    "orders.update-status",
    "orders.print",
    "products.view",
    "inventory.view",
    "customers.view",
    "discounts.view",
    "updates.view",
  ],
  warehouse: [
    "orders.view",
    "orders.update-status",
    "orders.print",
    "products.view",
    "inventory.view",
    "inventory.update",
    "updates.view",
  ],
  delivery: ["orders.view", "orders.update-status", "updates.view"],
  support: [
    "orders.view",
    "products.view",
    "customers.view",
    "inventory.view",
    "updates.view",
  ],
  manager: [
    "orders.view",
    "orders.create",
    "orders.update-status",
    "orders.reject",
    "orders.print",
    "orders.assign",
    "products.view",
    "products.update",
    "inventory.view",
    "inventory.update",
    "discounts.view",
    "discounts.manage",
    "customers.view",
    "customers.manage",
    "employees.view",
    "updates.view",
    "updates.publish",
    "analytics.view",
  ],
};

/** Admin holds every permission. Kept derived so new permissions auto-apply. */
export const ALL_PERMISSIONS: readonly Permission[] = Array.from(
  new Set(Object.values(ROLE_PERMISSIONS).flat()),
).concat([
  "products.create",
  "products.delete",
  "products.import",
  "customers.approve",
  "employees.manage",
  "content.view",
  "content.manage",
  "appearance.manage",
  "audit.view",
]) as Permission[];

export type EmployeeAccount = {
  id: string;
  employeeCode: string;
  fullName: string;
  phone: string;
  email?: string;
  role: EmployeeRole;
  /** Effective set. Seeded from the role, then individually adjustable. */
  permissions: Permission[];
  active: boolean;
  lastLoginAt?: string;
  createdAt: string;
};

export type B2BCustomerStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "disabled";

export type B2BCustomer = {
  id: string;
  /** Primary credential. Verification happens over phone/WhatsApp. */
  phone: string;
  ownerName: string;
  businessName: string;
  businessType?: string;
  address?: string;
  status: B2BCustomerStatus;
  /** Set by Admin on rejection; surfaced to the applicant. */
  statusReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  lastOrderAt?: string;
  totalOrders: number;
};

/** What a signed-in principal looks like to the app, regardless of audience. */
export type Session =
  | { audience: "public" }
  | {
      audience: "b2b";
      customerId: string;
      phone: string;
      ownerName: string;
      businessName: string;
    }
  | {
      audience: "employee";
      employeeId: string;
      fullName: string;
      role: EmployeeRole;
      permissions: Permission[];
    }
  | {
      audience: "admin";
      adminId: string;
      fullName: string;
      permissions: Permission[];
    };

export function can(session: Session, permission: Permission): boolean {
  if (session.audience === "admin") return true;
  if (session.audience === "employee") {
    return session.permissions.includes(permission);
  }
  return false;
}

// ---------------------------------------------------------------------------
// Cart and orders
// ---------------------------------------------------------------------------

export type CartLine = {
  productId: string;
  sku: string;
  name: Localized;
  image: ImageRef | null;
  quantity: number;
  unitPrice: Money;
  /** Per-unit monetary discount captured at add-to-cart time. */
  unitDiscount: Money | null;
};

export type CartTotals = {
  subtotal: Money;
  discount: Money;
  total: Money;
  itemCount: number;
  lineCount: number;
};

export type OrderStatus =
  | "pending"
  | "accepted"
  | "preparing"
  | "ready"
  | "out-for-delivery"
  | "completed"
  | "rejected"
  | "cancelled";

/** The happy path, in order. Terminal states sit outside it. */
export const ORDER_FLOW: readonly OrderStatus[] = [
  "pending",
  "accepted",
  "preparing",
  "ready",
  "out-for-delivery",
  "completed",
] as const;

export const TERMINAL_STATUSES: readonly OrderStatus[] = [
  "completed",
  "rejected",
  "cancelled",
] as const;

export function isTerminal(status: OrderStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}

/**
 * Legal next states. Status changes are validated against this server-side —
 * an order must not skip from "pending" to "out-for-delivery".
 */
export function allowedTransitions(status: OrderStatus): OrderStatus[] {
  if (isTerminal(status)) return [];
  const index = ORDER_FLOW.indexOf(status);
  const next = index >= 0 && index < ORDER_FLOW.length - 1 ? [ORDER_FLOW[index + 1]] : [];
  return [...next, "cancelled", ...(status === "pending" ? (["rejected"] as const) : [])];
}

export type OrderLine = CartLine & {
  /** quantity x (unitPrice - unitDiscount), frozen at submission. */
  lineTotal: Money;
};

export type Order = {
  id: string;
  /** Human-facing, e.g. "KG-10482". Generated once, never reused. */
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  businessName?: string;

  lines: OrderLine[];
  subtotal: Money;
  discount: Money;
  total: Money;

  status: OrderStatus;
  statusReason?: string;
  assignedEmployeeId?: string;
  note?: string;

  /** Cash on delivery is the only method today; the field keeps the door open. */
  paymentMethod: "cash";

  createdAt: string;
  updatedAt: string;
  history: OrderStatusEvent[];
};

export type OrderStatusEvent = {
  status: OrderStatus;
  at: string;
  byId?: string;
  byName?: string;
  reason?: string;
};

export const ORDER_NUMBER_PREFIX = "KG-";

// ---------------------------------------------------------------------------
// Discounts
// ---------------------------------------------------------------------------

export type Discount = {
  id: string;
  name: Localized;
  /** Monetary, per unit. Percentage discounts are deliberately not supported. */
  amount: Money;
  productIds: string[];
  startsAt: string | null;
  endsAt: string | null;
  active: boolean;
  /** Ordering within the public "Featured Deals" rail. */
  displayPosition: number;
  createdAt: string;
};

export function isDiscountLive(discount: Discount, now = new Date()): boolean {
  if (!discount.active) return false;
  const time = now.getTime();
  if (discount.startsAt && time < Date.parse(discount.startsAt)) return false;
  if (discount.endsAt && time > Date.parse(discount.endsAt)) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Admin updates — the feed employees read
// ---------------------------------------------------------------------------

export type UpdateCategory =
  | "products"
  | "prices"
  | "stock"
  | "discounts"
  | "orders"
  | "announcements";

export type AdminUpdate = {
  id: string;
  category: UpdateCategory;
  title: string;
  body?: string;
  /** Present on change events; absent on plain announcements. */
  oldValue?: string;
  newValue?: string;
  relatedProductId?: string;
  relatedOrderId?: string;
  changedById: string;
  changedByName: string;
  /** Empty arrays mean "everyone". */
  targetRoles: EmployeeRole[];
  targetEmployeeIds: string[];
  createdAt: string;
};

export type UpdateReadReceipt = {
  updateId: string;
  employeeId: string;
  readAt: string;
};

// ---------------------------------------------------------------------------
// Audit log
// ---------------------------------------------------------------------------

export type AuditEntry = {
  id: string;
  actorId: string;
  actorName: string;
  actorAudience: Audience;
  action: string;
  entity: string;
  entityId: string;
  oldValue?: string;
  newValue?: string;
  at: string;
};

// ---------------------------------------------------------------------------
// Site settings — everything Admin can edit without a deploy
// ---------------------------------------------------------------------------

export type ThemeMode = "light" | "dark";

export type HeroWidget = {
  id: string;
  icon: "box" | "clock" | "pin" | "star" | "truck" | "tag";
  title: Localized;
  subtitle: Localized;
  active: boolean;
  sortOrder: number;
};

export type SiteSettings = {
  /** GLOBAL, admin-controlled. Not a visitor preference. */
  theme: ThemeMode;

  business: {
    name: Localized;
    tagline: Localized;
    address: Localized;
    city: Localized;
    phone: string;
    whatsapp: string;
    email?: string;
    /** Free-form so "Flexible Closing: 8 PM – 10 PM" stays expressible. */
    hoursLabel: Localized;
    hoursNote: Localized;
    deliveryLabel: Localized;
    deliveryNote: Localized;
    cashOnlyNote: Localized;
  };

  hero: {
    headlinePrefix: Localized;
    headlineHighlight: Localized;
    headlineSuffix: Localized;
    subcopy: Localized;
    primaryCta: Localized;
    secondaryCta: Localized;
    videoUrl?: string;
    widgets: HeroWidget[];
  };

  about: { heading: Localized; body: Localized[] };
  services: ServiceItem[];
  social: { label: string; href: string }[];
  stats: { label: Localized; value: string }[];
};

export type ServiceItem = {
  id: string;
  icon: "supply" | "stock" | "pricing" | "delivery" | "support" | "range";
  title: Localized;
  description: Localized;
  sortOrder: number;
  active: boolean;
};

export type GalleryItem = {
  id: string;
  image: ImageRef;
  caption?: Localized;
  group: "business" | "products" | "store" | "services" | "other";
  sortOrder: number;
  active: boolean;
};
