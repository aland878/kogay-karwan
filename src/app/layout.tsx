import type { Metadata, Viewport } from "next";

import { getSettings } from "@/lib/data";
import { localize } from "@/lib/domain/types";

import "./globals.css";

/**
 * Root layout.
 *
 * The theme is read from site settings ON THE SERVER and stamped onto <html>.
 * That is deliberate: the brief makes appearance a business-wide decision owned
 * by Admin, not a visitor preference. Rendering it server-side also means there
 * is no flash of the wrong theme — the correct one is in the first byte.
 */

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings().getSettings();
  const name = localize(settings.business.name, "en");
  const tagline = localize(settings.business.tagline, "en");

  return {
    metadataBase: new URL("https://kogaykarwan.com"),
    title: {
      default: `${name} — ${tagline} in Erbil`,
      template: `%s · ${name}`,
    },
    description: localize(settings.hero.subcopy, "en"),
    applicationName: name,
    keywords: [
      "wholesale Erbil",
      "wholesale supplier Kurdistan",
      "B2B food supplier Iraq",
      "bulk groceries Erbil",
      name,
    ],
    openGraph: {
      type: "website",
      siteName: name,
      title: `${name} — ${tagline}`,
      description: localize(settings.hero.subcopy, "en"),
      locale: "en_US",
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
  const settings = await getSettings().getSettings();

  return (
    <html lang="en" dir="ltr" data-theme={settings.theme} suppressHydrationWarning>
      <body className="min-h-dvh antialiased">
        {/* Skip link — first focusable element on every page. */}
        <a
          href="#main"
          className="sr-only rounded-lg bg-accent px-4 py-2 font-semibold text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
