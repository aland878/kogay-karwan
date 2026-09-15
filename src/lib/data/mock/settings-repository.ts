import { DEFAULT_SETTINGS } from "@/lib/data/seed/settings";
import type { SettingsRepository } from "@/lib/data/repositories";
import type { GalleryItem, SiteSettings } from "@/lib/domain/types";

/**
 * IN-MEMORY SETTINGS ADAPTER
 *
 * Holds the global, admin-controlled site configuration — including the site
 * theme, which is a business-wide setting rather than a visitor preference.
 * Backed by a `site_settings` single-row table in Supabase later, with gallery
 * rows in their own table and their files in Supabase Storage.
 */

let settings: SiteSettings = structuredClone(DEFAULT_SETTINGS);

/**
 * Gallery placeholders.
 *
 * `image.src` is intentionally empty: no stock photography is invented for a
 * real business. Each row renders as a labelled pending tile until Admin
 * uploads the actual photo, which keeps the layout honest and reviewable.
 */
const gallery: GalleryItem[] = [
  { id: "g-1", image: { src: "", alt: "Warehouse aisle" }, caption: { en: "Warehouse" }, group: "business", sortOrder: 1, active: true },
  { id: "g-2", image: { src: "", alt: "Loading bay" }, caption: { en: "Loading bay" }, group: "business", sortOrder: 2, active: true },
  { id: "g-3", image: { src: "", alt: "Delivery vehicle" }, caption: { en: "Erbil delivery" }, group: "services", sortOrder: 3, active: true },
  { id: "g-4", image: { src: "", alt: "Beverage stock" }, caption: { en: "Beverages" }, group: "products", sortOrder: 4, active: true },
  { id: "g-5", image: { src: "", alt: "Dry goods stock" }, caption: { en: "Rice & grains" }, group: "products", sortOrder: 5, active: true },
  { id: "g-6", image: { src: "", alt: "Shop front" }, caption: { en: "Store front" }, group: "store", sortOrder: 6, active: true },
  { id: "g-7", image: { src: "", alt: "Order picking" }, caption: { en: "Order picking" }, group: "services", sortOrder: 7, active: true },
  { id: "g-8", image: { src: "", alt: "Team at work" }, caption: { en: "Our team" }, group: "business", sortOrder: 8, active: true },
];

function nextId(): string {
  return `g-${Math.random().toString(36).slice(2, 10)}`;
}

export class MockSettingsRepository implements SettingsRepository {
  async getSettings(): Promise<SiteSettings> {
    return settings;
  }

  async updateSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
    settings = {
      ...settings,
      ...patch,
      business: { ...settings.business, ...(patch.business ?? {}) },
      hero: { ...settings.hero, ...(patch.hero ?? {}) },
      about: { ...settings.about, ...(patch.about ?? {}) },
    };
    return settings;
  }

  async setTheme(theme: SiteSettings["theme"]): Promise<SiteSettings> {
    settings = { ...settings, theme };
    return settings;
  }

  // --- Gallery -----------------------------------------------------------

  async listGallery(
    options: { group?: GalleryItem["group"] } = {},
  ): Promise<GalleryItem[]> {
    return gallery
      .filter((item) => item.active && (!options.group || item.group === options.group))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async createGalleryItem(input: Omit<GalleryItem, "id">): Promise<GalleryItem> {
    const item: GalleryItem = { ...input, id: nextId() };
    gallery.push(item);
    return item;
  }

  async updateGalleryItem(
    id: string,
    patch: Partial<GalleryItem>,
  ): Promise<GalleryItem> {
    const index = gallery.findIndex((item) => item.id === id);
    if (index === -1) throw new Error(`Gallery item ${id} not found`);
    gallery[index] = { ...gallery[index], ...patch, id };
    return gallery[index];
  }

  async deleteGalleryItem(id: string): Promise<void> {
    const index = gallery.findIndex((item) => item.id === id);
    if (index !== -1) gallery.splice(index, 1);
  }
}
