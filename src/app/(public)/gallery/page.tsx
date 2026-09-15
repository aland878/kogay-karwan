import type { Metadata } from "next";

import { B2BCallout } from "@/components/site/home-sections";
import { PageHeader } from "@/components/site/page-header";
import { AssetImage } from "@/components/ui/asset-image";
import { Container } from "@/components/ui/layout";
import { getSettings } from "@/lib/data";
import { localize } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Inside Kogay Karwan — our warehouse, stock, delivery and team in Erbil.",
};

/**
 * Gallery.
 *
 * A deliberately irregular masonry rhythm: every third tile spans two rows, so
 * the grid reads as a considered layout rather than a uniform product sheet.
 * Tiles render at their final size whether or not the photo has been uploaded,
 * so the page is reviewable before the business supplies its images.
 */

export default async function GalleryPage() {
  const settingsRepo = getSettings();
  const [settings, items] = await Promise.all([
    settingsRepo.getSettings(),
    settingsRepo.listGallery(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Inside"
        highlight="Kogay Karwan"
        lead="Our warehouse, our stock and the team that gets it to your shelves."
        crumbs={[{ href: "/", label: "Home" }, { label: "Gallery" }]}
      />

      <Container size="wide" className="py-12 sm:py-16">
        {items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center text-sm text-ink-muted">
            No gallery images published yet.
          </p>
        ) : (
          <ul className="grid auto-rows-[13rem] grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {items.map((item, index) => {
              const tall = index % 3 === 0;
              const caption = item.caption ? localize(item.caption, "en") : item.image.alt;

              return (
                <li
                  key={item.id}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border border-line bg-surface-muted",
                    tall && "row-span-2",
                  )}
                >
                  <AssetImage
                    asset={item.image.src ? item.image : null}
                    fallbackLabel={caption}
                    sizes="(max-width: 640px) 50vw, 25vw"
                    fallbackRatio={tall ? 3 / 4 : 4 / 3}
                    className="transition-transform duration-[var(--duration-slow)] ease-[var(--ease-out-quint)] group-hover:scale-[1.04]"
                  />

                  {/* Caption scrim sits above the image and below nothing else. */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/75 to-transparent p-4 pt-10">
                    <p className="text-sm font-semibold text-white">{caption}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Container>

      <B2BCallout settings={settings} />
    </>
  );
}
