import type { Metadata, Viewport } from "next";

import { getSettings } from "@/lib/data";
import { localize } from "@/lib/domain/types";
import { directionOf, getLocale, htmlLang } from "@/lib/i18n/locale";

import "./globals.css";

/**
 * Root layout.
 *
 * Two things are resolved on the SERVER and stamped onto <html>:
 *
 *  - `data-theme`, from site settings. The brief makes appearance a
 *    business-wide decision owned by Admin, not a visitor preference.
 *  - `lang` / `dir`, from the locale cookie. Kurdish is the default, and it is
 *    right-to-left, so rendering it server-side means no flash of left-to-right
 *    English before the page flips — the moment an RTL reader notices most.
 */

export async function generateMetadata(): Promise<Metadata> {
  const [settings, locale] = await Promise.all([
    getSettings().getSettings(),
    getLocale(),
  ]);

  const name = localize(settings.business.name, locale);
  const tagline = localize(settings.business.tagline, locale);

  return {
    metadataBase: new URL("https://kogaykarwan.com"),
    title: {
      default: `${name} — ${tagline}`,
      template: `%s · ${name}`,
    },
    description: localize(settings.hero.subcopy, locale),
    applicationName: name,
    keywords: [
      "wholesale Erbil",
      "کۆگای کاروان",
      "بازرگانی کۆمەڵ هەولێر",
      "wholesale supplier Kurdistan",
      "B2B food supplier Iraq",
      name,
    ],
    openGraph: {
      type: "website",
      siteName: name,
      title: `${name} — ${tagline}`,
      description: localize(settings.hero.subcopy, locale),
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf8f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1120" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, locale] = await Promise.all([
    getSettings().getSettings(),
    getLocale(),
  ]);

  return (
    <html
      lang={htmlLang(locale)}
      dir={directionOf(locale)}
      data-theme={settings.theme}
      suppressHydrationWarning
    >
      <body className="min-h-dvh antialiased">
        {/* Skip link — first focusable element on every page. */}
        <a
          href="#main"
          className="sr-only rounded-lg bg-accent px-4 py-2 font-semibold text-white focus:not-sr-only focus:absolute focus:top-4 focus:z-[100] focus:start-4"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
