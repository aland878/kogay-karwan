import type { MetadataRoute } from "next";

/**
 * The three portals are disallowed: they hold wholesale pricing, customer
 * records and staff tooling, none of which belongs in a search index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/employee", "/b2b"],
    },
    sitemap: "https://kogaykarwan.com/sitemap.xml",
  };
}
