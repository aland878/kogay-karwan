import "server-only";

import { cookies } from "next/headers";

import { DEFAULT_LOCALE, LOCALES, type Locale, isRtl } from "@/lib/domain/types";

/**
 * LOCALE RESOLUTION
 *
 * The site serves Kurdish (Sorani), Arabic and English. Kurdish is the
 * business's own language and the language its catalog is written in, so it is
 * the default: an Erbil wholesaler's customers should not have to switch away
 * from English to read their own product names.
 *
 * The choice lives in a cookie and is read on the SERVER, so `lang` and `dir`
 * are correct in the first byte of HTML. A client-side switch would flash
 * left-to-right English before flipping, which is exactly the jarring moment
 * an RTL reader notices.
 */

export const LOCALE_COOKIE = "kg_locale";

/** Kurdish first — this is a Kurdish business with a Kurdish catalog. */
export const SITE_DEFAULT_LOCALE: Locale = "ku";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;

  if (value && (LOCALES as readonly string[]).includes(value)) {
    return value as Locale;
  }
  return SITE_DEFAULT_LOCALE;
}

export function directionOf(locale: Locale): "rtl" | "ltr" {
  return isRtl(locale) ? "rtl" : "ltr";
}

/**
 * BCP-47 tag for the `lang` attribute and `Intl` formatting.
 * Sorani Kurdish in Arabic script is `ckb`; `ku` alone is ambiguous between
 * Kurmanji (Latin) and Sorani, and screen readers pick the wrong voice for it.
 */
export function htmlLang(locale: Locale): string {
  switch (locale) {
    case "ku":
      return "ckb";
    case "ar":
      return "ar-IQ";
    default:
      return "en";
  }
}

/** Locale tag used for number, currency and date formatting. */
export function intlLocale(locale: Locale): string {
  switch (locale) {
    case "ku":
      // Kurdish has no widely-shipped ICU number format; Iraqi Arabic gives the
      // correct grouping and currency placement with Western digits.
      return "en-IQ";
    case "ar":
      return "ar-IQ";
    default:
      return "en-US";
  }
}

export { DEFAULT_LOCALE, LOCALES, isRtl };
export type { Locale };
