import type { Locale } from "@/lib/domain/types";

/**
 * UI STRINGS
 *
 * Interface chrome only — product and category names come from the catalog,
 * which is authored in Kurdish and needs no dictionary.
 *
 * Kurdish (Sorani) is the reference column and is filled in first, because it
 * is the language this business and its customers actually use. Where an Arabic
 * or English string is missing, `t()` falls back to Kurdish rather than to a
 * blank, so a half-translated key degrades to something readable.
 */

export type MessageKey = keyof typeof MESSAGES;

export const MESSAGES = {
  // --- Navigation ---------------------------------------------------------
  "nav.home": { ku: "سەرەکی", ar: "الرئيسية", en: "Home" },
  "nav.products": { ku: "بەرهەمەکان", ar: "المنتجات", en: "Products" },
  "nav.categories": { ku: "پۆلەکان", ar: "الفئات", en: "Categories" },
  "nav.brands": { ku: "براندەکان", ar: "العلامات", en: "Brands" },
  "nav.about": { ku: "دەربارەمان", ar: "من نحن", en: "About" },
  "nav.services": { ku: "خزمەتگوزارییەکان", ar: "الخدمات", en: "Services" },
  "nav.gallery": { ku: "گەلەری", ar: "المعرض", en: "Gallery" },
  "nav.contact": { ku: "پەیوەندی", ar: "اتصل بنا", en: "Contact" },

  // --- Actions ------------------------------------------------------------
  "action.login": { ku: "چوونەژوورەوە", ar: "تسجيل الدخول", en: "Login" },
  "action.getStarted": { ku: "دەستپێبکە", ar: "ابدأ الآن", en: "Get Started" },
  "action.signIn": { ku: "چوونەژوورەوە", ar: "تسجيل الدخول", en: "Sign in" },
  "action.signOut": { ku: "چوونەدەرەوە", ar: "تسجيل الخروج", en: "Sign out" },
  "action.addToCart": { ku: "زیادکردن بۆ سەبەتە", ar: "أضف إلى السلة", en: "Add to cart" },
  "action.added": { ku: "زیادکرا", ar: "تمت الإضافة", en: "Added" },
  "action.viewAll": { ku: "هەموویان ببینە", ar: "عرض الكل", en: "View all" },
  "action.clearFilters": { ku: "پاککردنەوەی پاڵاوتن", ar: "مسح عوامل التصفية", en: "Clear filters" },
  "action.browseCatalog": { ku: "کاتالۆگ ببینە", ar: "تصفح الكتالوج", en: "Browse catalog" },
  "action.remove": { ku: "لابردن", ar: "إزالة", en: "Remove" },
  "action.submitOrder": { ku: "ناردنی داواکاری", ar: "إرسال الطلب", en: "Submit order" },

  // --- Catalog ------------------------------------------------------------
  "catalog.search": {
    ku: "گەڕان بە ناو، براند یان کۆدی بەرهەم…",
    ar: "ابحث بالاسم أو العلامة أو الرمز…",
    en: "Search name, brand or product code…",
  },
  "catalog.searching": { ku: "گەڕان…", ar: "جارٍ البحث…", en: "Searching…" },
  "catalog.products": { ku: "بەرهەم", ar: "منتج", en: "products" },
  "catalog.noResults": { ku: "هیچ بەرهەمێک نەدۆزرایەوە", ar: "لم يتم العثور على منتجات", en: "No products found" },
  "catalog.allCategories": { ku: "هەموو پۆلەکان", ar: "كل الفئات", en: "All categories" },
  "catalog.allBrands": { ku: "هەموو براندەکان", ar: "كل العلامات", en: "All brands" },
  "catalog.inStockOnly": { ku: "تەنها بەردەست", ar: "المتوفر فقط", en: "In stock only" },
  "catalog.sortBy": { ku: "ڕیزکردن", ar: "ترتيب حسب", en: "Sort" },

  // --- Stock --------------------------------------------------------------
  "stock.in": { ku: "بەردەستە", ar: "متوفر", en: "In stock" },
  "stock.low": { ku: "کەم ماوە", ar: "كمية محدودة", en: "Low stock" },
  "stock.out": { ku: "نەماوە", ar: "غير متوفر", en: "Out of stock" },
  "stock.unavailable": { ku: "بەردەست نییە", ar: "غير متاح", en: "Unavailable" },

  // --- Pricing ------------------------------------------------------------
  "price.b2bOnly": { ku: "نرخی کۆمەڵ", ar: "سعر الجملة", en: "B2B pricing" },
  "price.perUnit": { ku: "بۆ هەر یەکە", ar: "للوحدة", en: "per unit" },
  "price.save": { ku: "پاشەکەوت", ar: "وفّر", en: "Save" },

  // --- Cart and orders ----------------------------------------------------
  "cart.title": { ku: "سەبەتە", ar: "السلة", en: "Cart" },
  "cart.empty": { ku: "سەبەتەکەت بەتاڵە", ar: "سلتك فارغة", en: "Your cart is empty" },
  "cart.subtotal": { ku: "کۆی گشتی", ar: "المجموع الفرعي", en: "Subtotal" },
  "cart.discount": { ku: "داشکاندن", ar: "الخصم", en: "Discount" },
  "cart.total": { ku: "کۆی کۆتایی", ar: "الإجمالي", en: "Total" },
  "cart.quantity": { ku: "بڕ", ar: "الكمية", en: "Quantity" },
  "order.number": { ku: "ژمارەی داواکاری", ar: "رقم الطلب", en: "Order number" },
  "order.status": { ku: "دۆخ", ar: "الحالة", en: "Status" },
  "order.date": { ku: "بەروار", ar: "التاريخ", en: "Date" },
  "order.none": { ku: "هێشتا هیچ داواکارییەک نییە", ar: "لا توجد طلبات بعد", en: "No orders yet" },
  "order.cashOnly": {
    ku: "تەنها نەقد — پارەدانی ئۆنلاین نییە",
    ar: "نقداً فقط — لا يوجد دفع إلكتروني",
    en: "Cash only — no online payment",
  },
  "order.noEdit": {
    ku: "دوای ناردن ناتوانرێت داواکاری بگۆڕدرێت",
    ar: "لا يمكن تعديل الطلب بعد إرساله",
    en: "Orders cannot be edited after submission",
  },

  // --- Order statuses -----------------------------------------------------
  "status.pending": { ku: "چاوەڕوان", ar: "قيد الانتظار", en: "Pending" },
  "status.accepted": { ku: "پەسەندکرا", ar: "مقبول", en: "Accepted" },
  "status.preparing": { ku: "ئامادەکردن", ar: "قيد التحضير", en: "Preparing" },
  "status.ready": { ku: "ئامادەیە", ar: "جاهز", en: "Ready" },
  "status.out-for-delivery": { ku: "لە ڕێگای گەیاندن", ar: "قيد التوصيل", en: "Out for delivery" },
  "status.completed": { ku: "تەواوبوو", ar: "مكتمل", en: "Completed" },
  "status.rejected": { ku: "ڕەتکرایەوە", ar: "مرفوض", en: "Rejected" },
  "status.cancelled": { ku: "هەڵوەشێندرایەوە", ar: "ملغى", en: "Cancelled" },

  // --- Portals ------------------------------------------------------------
  "b2b.portal": { ku: "پۆرتاڵی کۆمەڵ", ar: "بوابة الجملة", en: "B2B Portal" },
  "b2b.dashboard": { ku: "داشبۆرد", ar: "لوحة التحكم", en: "Dashboard" },
  "b2b.account": { ku: "هەژمار", ar: "الحساب", en: "Account" },
  "b2b.orders": { ku: "داواکارییەکان", ar: "الطلبات", en: "Orders" },
  "b2b.requestAccess": { ku: "داواکردنی دەستگەیشتن", ar: "طلب حساب جملة", en: "Request B2B Access" },
} as const satisfies Record<string, { ku: string; ar?: string; en?: string }>;

/**
 * Looks up a UI string.
 *
 * Falls back to Kurdish, not to English: Kurdish is the reference translation
 * here, so a key missing an English value still renders something a Kurdish
 * reader understands rather than an empty span.
 */
export function t(key: MessageKey, locale: Locale): string {
  const entry = MESSAGES[key] as { ku: string; ar?: string; en?: string };
  return entry[locale]?.trim() || entry.ku;
}

/** Bound lookup, so a component reads `tr("nav.home")` once it has a locale. */
export function translator(locale: Locale) {
  return (key: MessageKey) => t(key, locale);
}
