import type { SiteSettings } from "@/lib/domain/types";

/**
 * DEFAULT SITE SETTINGS
 *
 * Every string here is Admin-editable at runtime via the Website Content /
 * Hero Settings / Business Information screens. This file is the seed the
 * settings table is created from — it is NOT a hard-coded content source.
 * Components read `getSiteSettings()`, never this object directly.
 */
export const DEFAULT_SETTINGS: SiteSettings = {
  // Global, admin-controlled. Visitors get no toggle.
  theme: "light",

  business: {
    name: {
      en: "Kogay Karwan",
      ar: "كوكاي كاروان",
      ku: "کۆگای کاروان",
    },
    tagline: {
      en: "Wholesale Trade & Logistics",
      ar: "تجارة الجملة والخدمات اللوجستية",
      ku: "بازرگانی کۆمەڵ و گەیاندن",
    },
    address: {
      en: "Erbil, Kurdistan Region",
      ar: "أربيل، إقليم كوردستان",
      ku: "هەولێر، هەرێمی کوردستان",
    },
    city: { en: "Erbil", ar: "أربيل", ku: "هەولێر" },

    // Placeholders — replace in Admin → Business Information before launch.
    phone: "+964 750 000 0000",
    whatsapp: "+964 750 000 0000",

    hoursLabel: {
      en: "Open Into the Evening",
      ar: "مفتوح حتى المساء",
      ku: "کراوەیە تا ئێوارە",
    },
    hoursNote: {
      en: "Flexible closing: 8 PM – 10 PM",
      ar: "إغلاق مرن: ٨ مساءً – ١٠ مساءً",
      ku: "داخستنی نەرم: ٨ ـ ١٠ ئێوارە",
    },
    deliveryLabel: {
      en: "Delivery to All Erbil",
      ar: "توصيل إلى جميع أنحاء أربيل",
      ku: "گەیاندن بۆ هەموو هەولێر",
    },
    deliveryNote: {
      en: "Fast & reliable",
      ar: "سريع وموثوق",
      ku: "خێرا و متمانەپێکراو",
    },
    cashOnlyNote: {
      en: "Cash only — no online payment",
      ar: "نقداً فقط — لا يوجد دفع إلكتروني",
      ku: "تەنها نەقد — پارەدانی ئۆنلاین نییە",
    },
  },

  hero: {
    headlinePrefix: { en: "Your Trusted", ar: "شريككم", ku: "هاوبەشی" },
    headlineHighlight: {
      en: "Wholesale Partner",
      ar: "الموثوق للجملة",
      ku: "متمانەپێکراوی کۆمەڵ",
    },
    headlineSuffix: { en: "in Erbil", ar: "في أربيل", ku: "لە هەولێر" },
    subcopy: {
      en: "We supply high-quality food and everyday essentials for shops, supermarkets and businesses. Reliable stock, competitive wholesale prices, and fast local delivery across Erbil.",
      ar: "نوفر مواد غذائية عالية الجودة ومستلزمات يومية للمحلات والأسواق والشركات. مخزون موثوق، أسعار جملة تنافسية، وتوصيل سريع في أنحاء أربيل.",
      ku: "خواردن و پێداویستی ڕۆژانەی کوالێتی بەرز بۆ دوکان و سوپەرمارکێت و کاروبارەکان دابین دەکەین. کۆگای متمانەپێکراو، نرخی کۆمەڵی ڕکابەرانە، و گەیاندنی خێرا بە هەموو هەولێر.",
    },
    primaryCta: { en: "Explore Products", ar: "تصفح المنتجات", ku: "بەرهەمەکان ببینە" },
    secondaryCta: { en: "Watch Video", ar: "شاهد الفيديو", ku: "ڤیدیۆ ببینە" },

    widgets: [
      {
        id: "w-items",
        icon: "box",
        title: { en: "5000+ Items", ar: "أكثر من ٥٠٠٠ صنف", ku: "٥٠٠٠+ کاڵا" },
        subtitle: {
          en: "Wide range of products",
          ar: "تشكيلة واسعة من المنتجات",
          ku: "جۆراوجۆری بەرهەم",
        },
        active: true,
        sortOrder: 1,
      },
      {
        id: "w-hours",
        icon: "clock",
        title: { en: "Open 8 PM – 10 PM", ar: "مفتوح ٨ – ١٠ مساءً", ku: "کراوە ٨ ـ ١٠ ئێوارە" },
        subtitle: { en: "Flexible closing time", ar: "وقت إغلاق مرن", ku: "کاتی داخستنی نەرم" },
        active: true,
        sortOrder: 2,
      },
      {
        id: "w-delivery",
        icon: "pin",
        title: {
          en: "Delivery to All Erbil",
          ar: "توصيل لكل أربيل",
          ku: "گەیاندن بۆ هەموو هەولێر",
        },
        subtitle: { en: "Fast & reliable", ar: "سريع وموثوق", ku: "خێرا و متمانەپێکراو" },
        active: true,
        sortOrder: 3,
      },
      {
        id: "w-brands",
        icon: "star",
        title: { en: "Trusted Brands", ar: "علامات موثوقة", ku: "براندە متمانەپێکراوەکان" },
        subtitle: {
          en: "Competitive wholesale prices",
          ar: "أسعار جملة تنافسية",
          ku: "نرخی کۆمەڵی ڕکابەرانە",
        },
        active: false, // Seeded but off — Admin can switch it on.
        sortOrder: 4,
      },
    ],
  },

  about: {
    heading: {
      en: "Supplying Erbil's businesses, one reliable delivery at a time",
      ar: "نُموّن أعمال أربيل، بتوصيل موثوق في كل مرة",
      ku: "دابینکردنی کاروباری هەولێر، بە گەیاندنێکی متمانەپێکراو",
    },
    body: [
      {
        en: "Kogay Karwan is a wholesale supplier based in Erbil, Kurdistan Region. We stock food, beverages, dairy and everyday essentials for shops, supermarkets, restaurants and businesses across the city.",
        ar: "كوكاي كاروان مورّد جملة مقره أربيل، إقليم كوردستان. نوفر المواد الغذائية والمشروبات والألبان والمستلزمات اليومية للمحلات والأسواق والمطاعم والشركات في أنحاء المدينة.",
        ku: "کۆگای کاروان دابینکەرێکی کۆمەڵە لە هەولێر، هەرێمی کوردستان. خواردن، خواردنەوە، شیرەمەنی و پێداویستی ڕۆژانە بۆ دوکان، سوپەرمارکێت، چێشتخانە و کاروبارەکانی شار دابین دەکەین.",
      },
      {
        en: "Our buyers work directly with trusted regional and international brands, which keeps our stock consistent and our prices competitive. When you order, you get what you ordered — in full, on time.",
        ar: "يعمل مشترونا مباشرة مع علامات إقليمية ودولية موثوقة، ما يحافظ على ثبات مخزوننا وتنافسية أسعارنا. عندما تطلب، تحصل على ما طلبته — كاملاً وفي وقته.",
        ku: "کڕیارەکانمان ڕاستەوخۆ لەگەڵ براندە ناوچەیی و نێودەوڵەتییە متمانەپێکراوەکان کار دەکەن، کە کۆگاکەمان جێگیر و نرخەکانمان ڕکابەرانە دەهێڵێتەوە. کاتێک داوا دەکەیت، ئەوەی داوات کردووە وەردەگریت — تەواو و لە کاتی خۆیدا.",
      },
    ],
  },

  services: [
    {
      id: "s-supply",
      icon: "supply",
      title: { en: "Wholesale Supply", ar: "توريد بالجملة", ku: "دابینکردنی کۆمەڵ" },
      description: {
        en: "Bulk supply for shops, supermarkets, restaurants and businesses, with case and pallet quantities.",
        ar: "توريد بالجملة للمحلات والأسواق والمطاعم والشركات، بكميات كراتين ومنصات.",
        ku: "دابینکردنی کۆمەڵ بۆ دوکان، سوپەرمارکێت، چێشتخانە و کاروبارەکان، بە بڕی کارتۆن و پاڵێت.",
      },
      sortOrder: 1,
      active: true,
    },
    {
      id: "s-stock",
      icon: "stock",
      title: { en: "Reliable Stock", ar: "مخزون موثوق", ku: "کۆگای متمانەپێکراو" },
      description: {
        en: "Consistent availability on core lines, so your shelves stay full through the week.",
        ar: "توفر ثابت للأصناف الأساسية، لتبقى رفوفك ممتلئة طوال الأسبوع.",
        ku: "بەردەستبوونی جێگیر بۆ کاڵا سەرەکییەکان، تا ڕەفەکانت بە درێژایی هەفتە پڕ بمێننەوە.",
      },
      sortOrder: 2,
      active: true,
    },
    {
      id: "s-pricing",
      icon: "pricing",
      title: { en: "Competitive Pricing", ar: "أسعار تنافسية", ku: "نرخی ڕکابەرانە" },
      description: {
        en: "Direct brand relationships and volume buying keep wholesale prices sharp.",
        ar: "علاقات مباشرة مع العلامات والشراء بالحجم يبقيان أسعار الجملة تنافسية.",
        ku: "پەیوەندی ڕاستەوخۆ لەگەڵ براندەکان و کڕینی بە بڕی زۆر نرخی کۆمەڵ کەم ڕادەگرێت.",
      },
      sortOrder: 3,
      active: true,
    },
    {
      id: "s-delivery",
      icon: "delivery",
      title: { en: "Erbil Delivery", ar: "توصيل أربيل", ku: "گەیاندنی هەولێر" },
      description: {
        en: "Fast, reliable delivery across all of Erbil, scheduled around your business hours.",
        ar: "توصيل سريع وموثوق لكل أربيل، مجدول حول ساعات عملك.",
        ku: "گەیاندنی خێرا و متمانەپێکراو بۆ هەموو هەولێر، بەپێی کاتی کارەکەت.",
      },
      sortOrder: 4,
      active: true,
    },
    {
      id: "s-support",
      icon: "support",
      title: { en: "Business Support", ar: "دعم الأعمال", ku: "پاڵپشتی کاروبار" },
      description: {
        en: "A direct line to our team on WhatsApp or phone — no ticket queues, no call centre.",
        ar: "خط مباشر مع فريقنا عبر واتساب أو الهاتف — بلا طوابير تذاكر ولا مركز اتصال.",
        ku: "هێڵێکی ڕاستەوخۆ بۆ تیمەکەمان لە واتساپ یان تەلەفۆن — بێ ڕیزی تیکێت و بێ سەنتەری پەیوەندی.",
      },
      sortOrder: 5,
      active: true,
    },
    {
      id: "s-range",
      icon: "range",
      title: {
        en: "Large Product Selection",
        ar: "تشكيلة منتجات كبيرة",
        ku: "هەڵبژاردەی فراوانی بەرهەم",
      },
      description: {
        en: "Over 5,000 items across food, beverages, dairy, household and personal care.",
        ar: "أكثر من ٥٠٠٠ صنف في الأغذية والمشروبات والألبان والمنزل والعناية الشخصية.",
        ku: "زیاتر لە ٥٠٠٠ کاڵا لە خواردن، خواردنەوە، شیرەمەنی، ماڵ و چاودێری کەسی.",
      },
      sortOrder: 6,
      active: true,
    },
  ],

  social: [],

  stats: [
    { label: { en: "Products in stock", ar: "منتج في المخزون", ku: "بەرهەم لە کۆگا" }, value: "5,000+" },
    { label: { en: "Trusted brands", ar: "علامة موثوقة", ku: "براندی متمانەپێکراو" }, value: "80+" },
    { label: { en: "Businesses served", ar: "شركة نخدمها", ku: "کاروباری خزمەتکراو" }, value: "1,200+" },
    { label: { en: "Delivery coverage", ar: "تغطية التوصيل", ku: "پۆشینی گەیاندن" }, value: "All Erbil" },
  ],
};
