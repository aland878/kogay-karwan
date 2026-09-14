import { DEFAULT_SETTINGS } from "@/lib/data/seed/settings";
import type { SettingsRepository } from "@/lib/data/repositories";
import type { SiteSettings } from "@/lib/domain/types";

/**
 * IN-MEMORY SETTINGS ADAPTER
 *
 * Holds the global, admin-controlled site configuration — including the site
 * theme, which is a business-wide setting rather than a visitor preference.
 * Backed by a `site_settings` single-row table in Supabase later.
 */

let settings: SiteSettings = structuredClone(DEFAULT_SETTINGS);

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
}
