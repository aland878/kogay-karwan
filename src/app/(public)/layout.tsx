import { SiteFooter } from "@/components/site/home-sections";
import { SiteHeader } from "@/components/site/site-header";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { getSettings } from "@/lib/data";
import { localize } from "@/lib/domain/types";
import { getLocale } from "@/lib/i18n/locale";

/**
 * Public site shell — header, smooth scroll, footer.
 *
 * The three portals (/b2b, /employee, /admin) deliberately do NOT use this
 * layout: they are separate experiences with their own chrome, and a cashier
 * screen must not inherit Lenis or marketing navigation.
 */
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, locale] = await Promise.all([
    getSettings().getSettings(),
    getLocale(),
  ]);

  return (
    <SmoothScroll>
      <SiteHeader
        businessName={localize(settings.business.name, locale)}
        tagline={localize(settings.business.tagline, locale)}
        locale={locale}
      />
      <main id="main">{children}</main>
      <SiteFooter settings={settings} locale={locale} />
    </SmoothScroll>
  );
}
