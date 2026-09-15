"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { LOCALE_COOKIE } from "@/lib/i18n/locale";
import { LOCALES, type Locale } from "@/lib/domain/types";

/**
 * Switches the visitor's language.
 *
 * A server action rather than client state: `lang`, `dir` and every translated
 * string are rendered on the server, so the page must be re-rendered to change
 * them. A one-year cookie keeps the choice across visits.
 */
export async function setLocale(locale: Locale) {
  if (!(LOCALES as readonly string[]).includes(locale)) return;

  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  // Language affects every route, so the whole tree is revalidated.
  revalidatePath("/", "layout");
}
