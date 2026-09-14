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

/**
 * Homepage — the composition from the supplied reference, in order:
 * hero → trusted brands → category rail → why us → featured products →
 * about → services → B2B callout → contact.
 */
export default async function HomePage() {
  const catalog = getCatalog();

  // Fetched in parallel — these four queries have no interdependency, and
  // awaiting them in sequence would serialise the whole page render.
  const [settings, brands, categories, featured] = await Promise.all([
    getSettings().getSettings(),
    catalog.listBrands({ featuredOnly: true }),
    catalog.listCategoryTree(),
    catalog.listPublicFeaturedProducts(8),
  ]);

  return (
    <>
      <Hero settings={settings} />
      <TrustedBrands brands={brands} />
      <CategoryRail categories={categories} />
      <WhyUs settings={settings} />
      <FeaturedProducts products={featured} brands={brands} />
      <AboutSection settings={settings} />
      <ServicesSection settings={settings} />
      <B2BCallout settings={settings} />
      <ContactSection settings={settings} />
    </>
  );
}
