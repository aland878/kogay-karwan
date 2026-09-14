/**
 * ASSET MANIFEST — the single place real artwork is wired in.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  DROP YOUR FILES AT THESE EXACT PATHS UNDER /public AND EVERYTHING RESOLVES.
 *  Nothing else in the codebase hard-codes an image path.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Product cut-outs: transparent PNG or WebP, upright, roughly 1200px tall,
 * packaging centred with a little breathing room. Every consumer uses
 * `object-fit: contain`, so art is never stretched or cropped — a wrong aspect
 * ratio letterboxes rather than distorting the packaging.
 *
 * When assets move to Supabase Storage, swap `src` for the public bucket URL.
 * No component changes.
 */

import type { ImageRef } from "@/lib/domain/types";

const PRODUCTS = "/assets/products";
const BRANDS = "/assets/brands";
const LOGOS = "/assets/logo";

/** Real packaging shots, one per supplied product. */
export const PRODUCT_IMAGES = {
  pepsi: {
    src: `${PRODUCTS}/pepsi-can.png`,
    alt: "Pepsi 330 ml can",
    width: 600,
    height: 1000,
  },
  cocaCola: {
    src: `${PRODUCTS}/coca-cola-can.png`,
    alt: "Coca-Cola 330 ml can",
    width: 600,
    height: 1000,
  },
  mahmoodRice: {
    src: `${PRODUCTS}/mahmood-rice.png`,
    alt: "Mahmood Rice Sella Basmati 4.5 kg bag",
    width: 900,
    height: 1100,
  },
  zerTomatoPaste: {
    src: `${PRODUCTS}/zer-tomato-paste.png`,
    alt: "ZER tomato paste tin",
    width: 800,
    height: 1000,
  },
  altunsaOil: {
    src: `${PRODUCTS}/altunsa-sunflower-oil.png`,
    alt: "Altunsa sunflower oil 1 L bottle",
    width: 600,
    height: 1200,
  },
  ulkerMetro: {
    src: `${PRODUCTS}/ulker-metro.png`,
    alt: "Ülker Metro Klasik chocolate bar",
    width: 1100,
    height: 520,
  },
  almaraiMilk: {
    src: `${PRODUCTS}/almarai-barista-milk.png`,
    alt: "Almarai Barista full-fat milk 1 L carton",
    width: 700,
    height: 1100,
  },
} as const satisfies Record<string, ImageRef>;

export type ProductImageKey = keyof typeof PRODUCT_IMAGES;

/** Brand wordmarks for the Trusted Brands strip. Transparent PNG or SVG. */
export const BRAND_LOGOS = {
  pepsi: { src: `${BRANDS}/pepsi.svg`, alt: "Pepsi" },
  cocaCola: { src: `${BRANDS}/coca-cola.svg`, alt: "Coca-Cola" },
  ulker: { src: `${BRANDS}/ulker.svg`, alt: "Ülker" },
  altunsa: { src: `${BRANDS}/altunsa.svg`, alt: "Altunsa" },
  almarai: { src: `${BRANDS}/almarai.svg`, alt: "Almarai" },
  mahmoodRice: { src: `${BRANDS}/mahmood-rice.svg`, alt: "Mahmood Rice" },
  zer: { src: `${BRANDS}/zer.svg`, alt: "ZER" },
  metro: { src: `${BRANDS}/metro.svg`, alt: "Ülker Metro" },
} as const satisfies Record<string, ImageRef>;

export type BrandLogoKey = keyof typeof BRAND_LOGOS;

/**
 * The Kogay Karwan marks. Supply all four — the header needs a light-surface
 * lockup, the dark theme and footer need the reversed one, and the hero uses
 * the emblem alone behind the product composition.
 */
export const LOGO = {
  /** Horizontal lockup, gold monogram + navy wordmark, for light surfaces. */
  lockup: {
    src: `${LOGOS}/kogay-karwan-lockup.svg`,
    alt: "Kogay Karwan — Wholesale Trade & Logistics",
    width: 280,
    height: 64,
  },
  /** Same lockup with the wordmark reversed out, for dark surfaces. */
  lockupLight: {
    src: `${LOGOS}/kogay-karwan-lockup-light.svg`,
    alt: "Kogay Karwan — Wholesale Trade & Logistics",
    width: 280,
    height: 64,
  },
  /** Standalone 3D gold KK + globe emblem. Used as the hero backdrop seal. */
  emblem: {
    src: `${LOGOS}/kogay-karwan-emblem.png`,
    alt: "Kogay Karwan",
    width: 1600,
    height: 900,
  },
  /** Square mark for favicon, app icon and compact contexts. */
  mark: {
    src: `${LOGOS}/kogay-karwan-mark.svg`,
    alt: "Kogay Karwan",
    width: 128,
    height: 128,
  },
} as const satisfies Record<string, ImageRef>;

/**
 * Inline SVG placeholder shown when a file has not been dropped in yet.
 *
 * It renders a labelled gold-on-cream panel rather than a broken-image icon, so
 * an unfinished asset reads as "pending" in review instead of looking like a
 * bug — and layout, spacing and proportions stay exactly as they will ship.
 */
export function placeholderImage(label: string, ratio = 3 / 4): string {
  const width = 600;
  const height = Math.round(width / ratio);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f0d896"/>
      <stop offset="0.5" stop-color="#c9932a"/>
      <stop offset="1" stop-color="#8a5a1c"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" rx="24" fill="#fbf8f2" fill-opacity="0.72"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="23" fill="none" stroke="url(#g)" stroke-width="2" stroke-dasharray="10 8"/>
  <text x="50%" y="48%" text-anchor="middle" font-family="system-ui,sans-serif" font-size="28" font-weight="700" fill="#c9932a">${escapeXml(label)}</text>
  <text x="50%" y="58%" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="#6c8db4">asset pending</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
