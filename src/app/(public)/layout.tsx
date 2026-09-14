import { SiteFooter } from "@/components/site/home-sections";
import { SiteHeader } from "@/components/site/site-header";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { getSettings } from "@/lib/data";
import { localize } from "@/lib/domain/types";

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
  const settings = await getSettings().getSettings();

  return (
    <SmoothScroll>
      <SiteHeader
        businessName={localize(settings.business.name, "en")}
        tagline={localize(settings.business.tagline, "en")}
      />
      <main id="main">{children}</main>
      <SiteFooter settings={settings} />
    </SmoothScroll>
  );
}
