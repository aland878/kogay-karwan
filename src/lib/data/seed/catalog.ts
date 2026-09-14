import { BRAND_LOGOS, PRODUCT_IMAGES } from "@/lib/assets";
import type { Brand, Category, Product } from "@/lib/domain/types";
import { money } from "@/lib/domain/types";

/**
 * SEED CATALOG
 *
 * The seven real products are authored by hand from the supplied packaging
 * shots. Everything after them is clearly-labelled demo filler, generated so
 * pagination, filtering and search are exercised against a catalog of realistic
 * size rather than a handful of rows. Replace the whole module with a Supabase
 * query — nothing imports it except the mock adapter.
 */

const now = "2026-01-15T09:00:00.000Z";

// ---------------------------------------------------------------------------
// Brands
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Categories — top level, then subcategories
// ---------------------------------------------------------------------------

export const SEED_CATEGORIES: Category[] = [
  {
    id: "c-food",
    slug: "food-beverages",
    name: { en: "Food & Beverages", ar: "أغذية ومشروبات", ku: "خواردن و خواردنەوە" },
    description: {
      en: "Pantry staples, cooking essentials and drinks by the case.",
      ar: "أساسيات المؤن ومستلزمات الطبخ والمشروبات بالكرتون.",
      ku: "پێداویستی کلێر، کەرەستەی چێشتلێنان و خواردنەوە بە کارتۆن.",
    },
    parentId: null,
    icon: "food",
    sortOrder: 1,
    active: true,
  },
  {
    id: "c-dairy",
    slug: "dairy-frozen",
    name: { en: "Dairy & Frozen", ar: "ألبان ومجمدات", ku: "شیرەمەنی و بەستوو" },
    description: {
      en: "Chilled and frozen lines, delivered cold.",
      ar: "منتجات مبردة ومجمدة، تُوصل باردة.",
      ku: "بەرهەمی ساردکراوە و بەستوو، بە ساردی دەگەیەنرێت.",
    },
    parentId: null,
    icon: "dairy",
    sortOrder: 2,
    active: true,
  },
  {
    id: "c-household",
    slug: "household-essentials",
    name: { en: "Household Essentials", ar: "مستلزمات منزلية", ku: "پێداویستی ماڵ" },
    parentId: null,
    icon: "household",
    sortOrder: 3,
    active: true,
  },
  {
    id: "c-personal",
    slug: "personal-care-hygiene",
    name: { en: "Personal Care & Hygiene", ar: "عناية شخصية ونظافة", ku: "چاودێری کەسی و پاکوخاوێنی" },
    parentId: null,
    icon: "personal-care",
    sortOrder: 4,
    active: true,
  },
  {
    id: "c-more",
    slug: "more-categories",
    name: { en: "More Categories", ar: "فئات أخرى", ku: "پۆلی زیاتر" },
    parentId: null,
    icon: "more",
    sortOrder: 5,
    active: true,
  },

  // --- Subcategories -------------------------------------------------------
  { id: "c-beverages", slug: "soft-drinks", name: { en: "Soft Drinks", ar: "مشروبات غازية", ku: "خواردنەوەی گازی" }, parentId: "c-food", icon: "beverages", sortOrder: 1, active: true },
  { id: "c-grains", slug: "rice-grains", name: { en: "Rice & Grains", ar: "أرز وحبوب", ku: "برنج و دانەوێڵە" }, parentId: "c-food", icon: "grains", sortOrder: 2, active: true },
  { id: "c-oils", slug: "cooking-oils", name: { en: "Cooking Oils", ar: "زيوت الطبخ", ku: "ڕۆنی چێشتلێنان" }, parentId: "c-food", icon: "food", sortOrder: 3, active: true },
  { id: "c-canned", slug: "canned-preserves", name: { en: "Canned & Preserves", ar: "معلبات", ku: "قوتوو و پاراستراو" }, parentId: "c-food", icon: "food", sortOrder: 4, active: true },
  { id: "c-snacks", slug: "snacks-confectionery", name: { en: "Snacks & Confectionery", ar: "وجبات خفيفة وحلويات", ku: "خواردنی سووک و شیرینی" }, parentId: "c-food", icon: "snacks", sortOrder: 5, active: true },
  { id: "c-milk", slug: "milk-cream", name: { en: "Milk & Cream", ar: "حليب وقشطة", ku: "شیر و کرێم" }, parentId: "c-dairy", icon: "dairy", sortOrder: 1, active: true },
  { id: "c-cheese", slug: "cheese-yoghurt", name: { en: "Cheese & Yoghurt", ar: "أجبان وألبان", ku: "پەنیر و مۆست" }, parentId: "c-dairy", icon: "dairy", sortOrder: 2, active: true },
  { id: "c-frozen", slug: "frozen-foods", name: { en: "Frozen Foods", ar: "أطعمة مجمدة", ku: "خواردنی بەستوو" }, parentId: "c-dairy", icon: "frozen", sortOrder: 3, active: true },
  { id: "c-cleaning", slug: "cleaning-supplies", name: { en: "Cleaning Supplies", ar: "مواد تنظيف", ku: "کەرەستەی پاککردنەوە" }, parentId: "c-household", icon: "cleaning", sortOrder: 1, active: true },
  { id: "c-paper", slug: "paper-disposables", name: { en: "Paper & Disposables", ar: "ورقيات ومستهلكات", ku: "کاغەز و بەکارهێنراو" }, parentId: "c-household", icon: "household", sortOrder: 2, active: true },
];

// ---------------------------------------------------------------------------
// The seven real products
// ---------------------------------------------------------------------------

export const REAL_PRODUCTS: Product[] = [
  {
    id: "p-pepsi-330",
    sku: "KG-BEV-0101",
    slug: "pepsi-330ml-can",
    name: { en: "Pepsi 330 ml Can", ar: "بيبسي ٣٣٠ مل", ku: "پێپسی ٣٣٠ مل" },
    description: {
      en: "Classic Pepsi cola in 330 ml cans. Sold by the case of 24.",
      ar: "بيبسي كولا الكلاسيكية في علب ٣٣٠ مل. تُباع بالكرتون، ٢٤ علبة.",
      ku: "پێپسی کۆلای کلاسیک لە قوتووی ٣٣٠ مل. بە کارتۆنی ٢٤ دانە دەفرۆشرێت.",
    },
    brandId: "b-pepsi",
    categoryId: "c-food",
    subcategoryId: "c-beverages",
    image: PRODUCT_IMAGES.pepsi,
    gallery: [],
    wholesalePrice: money(960),
    discount: money(80),
    stockQuantity: 420,
    lowStockThreshold: 60,
    unit: "case",
    unitsPerCase: 24,
    featured: true,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p-coca-cola-330",
    sku: "KG-BEV-0102",
    slug: "coca-cola-330ml-can",
    name: { en: "Coca-Cola 330 ml Can", ar: "كوكا كولا ٣٣٠ مل", ku: "کۆکا کۆلا ٣٣٠ مل" },
    description: {
      en: "Coca-Cola original taste in 330 ml cans. Sold by the case of 24.",
      ar: "كوكا كولا بالطعم الأصلي في علب ٣٣٠ مل. تُباع بالكرتون، ٢٤ علبة.",
      ku: "کۆکا کۆلای تامی ئەسڵی لە قوتووی ٣٣٠ مل. بە کارتۆنی ٢٤ دانە دەفرۆشرێت.",
    },
    brandId: "b-coca-cola",
    categoryId: "c-food",
    subcategoryId: "c-beverages",
    image: PRODUCT_IMAGES.cocaCola,
    gallery: [],
    wholesalePrice: money(980),
    discount: null,
    stockQuantity: 380,
    lowStockThreshold: 60,
    unit: "case",
    unitsPerCase: 24,
    featured: true,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p-mahmood-rice-45",
    sku: "KG-GRN-0201",
    slug: "mahmood-sella-basmati-rice-4-5kg",
    name: {
      en: "Mahmood Sella Basmati Rice 4.5 kg",
      ar: "أرز محمود سيلا بسمتي ٤.٥ كغ",
      ku: "برنجی مەحمود سێلا باسمەتی ٤.٥ کگم",
    },
    description: {
      en: "Premium sella basmati, long grain, 4.5 kg bag with carry handle.",
      ar: "بسمتي سيلا فاخر، حبة طويلة، كيس ٤.٥ كغ بمقبض حمل.",
      ku: "سێلا باسمەتی پرێمیۆم، دەنکە درێژ، کیسەی ٤.٥ کگم بە دەستک.",
    },
    brandId: "b-mahmood",
    categoryId: "c-food",
    subcategoryId: "c-grains",
    image: PRODUCT_IMAGES.mahmoodRice,
    gallery: [],
    wholesalePrice: money(1150),
    discount: money(150),
    stockQuantity: 240,
    lowStockThreshold: 40,
    unit: "pack",
    featured: true,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p-altunsa-oil-1l",
    sku: "KG-OIL-0301",
    slug: "altunsa-sunflower-oil-1l",
    name: {
      en: "Altunsa Sunflower Oil 1 L",
      ar: "زيت عباد الشمس التونسا ١ لتر",
      ku: "ڕۆنی گوڵەبەڕۆژەی ئالتونسا ١ لیتر",
    },
    description: {
      en: "Pure refined sunflower oil, 1 L bottle. Case of 12.",
      ar: "زيت عباد شمس مكرر نقي، عبوة ١ لتر. كرتون ١٢ عبوة.",
      ku: "ڕۆنی گوڵەبەڕۆژەی پاککراوەی خاوێن، بوتڵی ١ لیتر. کارتۆنی ١٢ دانە.",
    },
    brandId: "b-altunsa",
    categoryId: "c-food",
    subcategoryId: "c-oils",
    image: PRODUCT_IMAGES.altunsaOil,
    gallery: [],
    wholesalePrice: money(1680),
    discount: money(120),
    stockQuantity: 310,
    lowStockThreshold: 50,
    unit: "case",
    unitsPerCase: 12,
    featured: true,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p-zer-paste",
    sku: "KG-CAN-0401",
    slug: "zer-tomato-paste-830g",
    name: {
      en: "ZER Tomato Paste 830 g",
      ar: "معجون طماطم زر ٨٣٠ غ",
      ku: "دۆشاوی تەماتەی زێر ٨٣٠ گم",
    },
    description: {
      en: "Double-concentrated tomato paste, no added salt, brix at least 28%.",
      ar: "معجون طماطم مركز مضاعف، بدون ملح مضاف، بريكس لا يقل عن ٢٨٪.",
      ku: "دۆشاوی تەماتەی دووجار چڕکراو، بێ خوێی زیادکراو، بریکس بەلایەنی کەم ٢٨٪.",
    },
    brandId: "b-zer",
    categoryId: "c-food",
    subcategoryId: "c-canned",
    image: PRODUCT_IMAGES.zerTomatoPaste,
    gallery: [],
    wholesalePrice: money(1420),
    discount: null,
    stockQuantity: 46,
    lowStockThreshold: 50, // deliberately low — exercises the low-stock state
    unit: "case",
    unitsPerCase: 12,
    featured: true,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p-ulker-metro",
    sku: "KG-SNK-0501",
    slug: "ulker-metro-klasik-bar",
    name: {
      en: "Ülker Metro Klasik Bar",
      ar: "لوح ميترو كلاسيك أولكر",
      ku: "شەکۆلاتەی مێترۆ کلاسیک ئولکەر",
    },
    description: {
      en: "Chocolate-coated caramel and nougat bar, 40% more. Box of 24.",
      ar: "لوح كراميل ونوجا مغطى بالشوكولاتة، أكبر بنسبة ٤٠٪. علبة ٢٤ قطعة.",
      ku: "شەکۆلاتەی کارامێل و نوگا، ٤٠٪ زیاتر. سندوقی ٢٤ دانە.",
    },
    brandId: "b-metro",
    categoryId: "c-food",
    subcategoryId: "c-snacks",
    image: PRODUCT_IMAGES.ulkerMetro,
    gallery: [],
    wholesalePrice: money(720),
    discount: money(60),
    stockQuantity: 0, // exercises the out-of-stock state
    lowStockThreshold: 30,
    unit: "carton",
    unitsPerCase: 24,
    featured: true,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "p-almarai-milk",
    sku: "KG-DRY-0601",
    slug: "almarai-barista-milk-1l",
    name: {
      en: "Almarai Barista Milk 1 L",
      ar: "حليب المراعي باريستا ١ لتر",
      ku: "شیری باریستای ئەلمەڕاعی ١ لیتر",
    },
    description: {
      en: "Full-fat barista milk for coffee. More foam, stable microfoam. Case of 12.",
      ar: "حليب باريستا كامل الدسم للقهوة. رغوة أكثر وثابتة. كرتون ١٢ عبوة.",
      ku: "شیری باریستای بە چەوری تەواو بۆ قاوە. کەفی زیاتر و جێگیر. کارتۆنی ١٢ دانە.",
    },
    brandId: "b-almarai",
    categoryId: "c-dairy",
    subcategoryId: "c-milk",
    image: PRODUCT_IMAGES.almaraiMilk,
    gallery: [],
    wholesalePrice: money(1540),
    discount: money(100),
    stockQuantity: 190,
    lowStockThreshold: 40,
    unit: "case",
    unitsPerCase: 12,
    featured: true,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
];

// ---------------------------------------------------------------------------
// Demo filler — proves the catalog UI at realistic scale
// ---------------------------------------------------------------------------

const FILLER_LINES: { label: string; category: string; sub: string; unit: Product["unit"] }[] = [
  { label: "Sparkling Water", category: "c-food", sub: "c-beverages", unit: "case" },
  { label: "Orange Juice", category: "c-food", sub: "c-beverages", unit: "case" },
  { label: "Energy Drink", category: "c-food", sub: "c-beverages", unit: "case" },
  { label: "Long Grain Rice", category: "c-food", sub: "c-grains", unit: "pack" },
  { label: "Bulgur Wheat", category: "c-food", sub: "c-grains", unit: "pack" },
  { label: "Red Lentils", category: "c-food", sub: "c-grains", unit: "pack" },
  { label: "Olive Oil", category: "c-food", sub: "c-oils", unit: "case" },
  { label: "Corn Oil", category: "c-food", sub: "c-oils", unit: "case" },
  { label: "Chickpeas Tin", category: "c-food", sub: "c-canned", unit: "case" },
  { label: "Tuna Tin", category: "c-food", sub: "c-canned", unit: "case" },
  { label: "Wafer Biscuits", category: "c-food", sub: "c-snacks", unit: "carton" },
  { label: "Salted Crackers", category: "c-food", sub: "c-snacks", unit: "carton" },
  { label: "UHT Milk", category: "c-dairy", sub: "c-milk", unit: "case" },
  { label: "Cooking Cream", category: "c-dairy", sub: "c-milk", unit: "case" },
  { label: "White Cheese", category: "c-dairy", sub: "c-cheese", unit: "pack" },
  { label: "Plain Yoghurt", category: "c-dairy", sub: "c-cheese", unit: "pack" },
  { label: "Frozen Vegetables", category: "c-dairy", sub: "c-frozen", unit: "pack" },
  { label: "Frozen Fries", category: "c-dairy", sub: "c-frozen", unit: "pack" },
  { label: "Dish Soap", category: "c-household", sub: "c-cleaning", unit: "case" },
  { label: "Laundry Powder", category: "c-household", sub: "c-cleaning", unit: "pack" },
  { label: "Bleach", category: "c-household", sub: "c-cleaning", unit: "case" },
  { label: "Kitchen Towel", category: "c-household", sub: "c-paper", unit: "pack" },
  { label: "Facial Tissue", category: "c-household", sub: "c-paper", unit: "carton" },
  { label: "Hand Soap", category: "c-personal", sub: null as never, unit: "case" },
  { label: "Shampoo", category: "c-personal", sub: null as never, unit: "case" },
  { label: "Toothpaste", category: "c-personal", sub: null as never, unit: "carton" },
];

const SIZES = ["Small", "Standard", "Family", "Catering", "Economy"];

/**
 * Deterministic pseudo-random so the demo catalog is stable across reloads —
 * a catalog that reshuffles every render makes pagination impossible to review.
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function buildFillerProducts(count: number): Product[] {
  const random = seededRandom(20260115);
  const products: Product[] = [];

  for (let i = 0; i < count; i += 1) {
    const line = FILLER_LINES[i % FILLER_LINES.length];
    const size = SIZES[Math.floor(random() * SIZES.length)];
    const variant = Math.floor(i / FILLER_LINES.length) + 1;
    const label = `${line.label} — ${size} ${variant}`;
    const price = 400 + Math.floor(random() * 2200);
    const discounted = random() > 0.78;
    const stock = Math.floor(random() * 300);

    products.push({
      id: `p-demo-${i + 1}`,
      sku: `KG-DEM-${String(i + 1).padStart(5, "0")}`,
      slug: `demo-product-${i + 1}`,
      name: { en: label },
      description: {
        en: "Demo catalog entry. Replace with real product data on import.",
      },
      brandId: null,
      categoryId: line.category,
      subcategoryId: line.sub ?? null,
      image: null,
      gallery: [],
      wholesalePrice: money(price),
      discount: discounted ? money(Math.floor(price * 0.1)) : null,
      stockQuantity: stock,
      lowStockThreshold: 40,
      unit: line.unit,
      unitsPerCase: line.unit === "case" ? 12 : undefined,
      featured: false,
      active: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  return products;
}

/** Real products first so they lead every unsorted listing. */
export const SEED_PRODUCTS: Product[] = [
  ...REAL_PRODUCTS,
  ...buildFillerProducts(493),
];
