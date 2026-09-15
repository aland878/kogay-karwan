import { CategoryRail } from "@/components/site/category-rail";
import {
  AboutSection,
  B2BCallout,
  ContactSection,
  FeaturedProducts,
  ServicesSection,
  WhyUs,
} from "@/components/site/home-sections";
import { Hero } from "@/components/site/hero/hero";
import { TrustedBrands } from "@/components/site/trusted-brands";
import { getCatalog, getSettings } from "@/lib/data";
import { getLocale } from "@/lib/i18n/locale";

/**
 * Homepage — the composition from the supplied reference, in order:
 * hero → trusted brands → category rail → why us → featured products →
 * about → services → B2B callout → contact.
 */
export default async function HomePage() {
  const catalog = getCatalog();

  // Fetched in parallel — these four queries have no interdependency, and
  // awaiting them in sequence would serialise the whole page render.
  const [locale, settings, brands, categories, showcase] = await Promise.all([
    getLocale(),
    getSettings().getSettings(),
    catalog.listBrands({ featuredOnly: true }),
    catalog.listCategoryTree(),
    catalog.listPublicShowcaseProducts(8),
  ]);

  return (
    <>
      <Hero settings={settings} locale={locale} />
      <TrustedBrands brands={brands} />
      <CategoryRail categories={categories} locale={locale} />
      <WhyUs settings={settings} locale={locale} />
      <AboutSection settings={settings} locale={locale} />
      <ServicesSection settings={settings} locale={locale} />
      <B2BCallout settings={settings} locale={locale} />
      {/* Products sit directly above Contact: the catalog is the last thing a
          visitor reads before the WhatsApp and phone links they act on. */}
      <FeaturedProducts products={showcase} brands={brands} locale={locale} />
      <ContactSection settings={settings} locale={locale} />
    </>
  );
}
