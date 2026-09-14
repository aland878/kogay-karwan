import "server-only";

import { MockCatalogRepository } from "@/lib/data/mock/catalog-repository";
import { MockOrderRepository } from "@/lib/data/mock/order-repository";
import { MockSettingsRepository } from "@/lib/data/mock/settings-repository";
import type { DataContext } from "@/lib/data/repositories";

/**
 * DATA CONTEXT FACTORY — the one place the backend is chosen.
 *
 * `server-only` makes this module a build error if it is ever imported into a
 * client component. That matters: repositories read wholesale pricing and
 * customer records, and a stray client import would ship them to the browser.
 *
 * ── Connecting Supabase ────────────────────────────────────────────────────
 *  1. Add `SupabaseCatalogRepository` etc. under `lib/data/supabase/`, each
 *     implementing the matching interface from `./repositories`.
 *  2. Return them from `getDataContext()` when the env vars are present.
 *  3. Nothing else changes — no page, no component, no hook.
 *
 * Deliberately no credentials are committed. `hasSupabaseConfig()` reads the
 * environment so the switch can be flipped by configuration, not a code edit.
 */

const catalog = new MockCatalogRepository();
const orders = new MockOrderRepository();
const settings = new MockSettingsRepository();

const mockContext: DataContext = { catalog, orders, settings };

export function hasSupabaseConfig(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function getDataContext(): DataContext {
  // if (hasSupabaseConfig()) return supabaseContext;
  return mockContext;
}

/** Convenience accessors — most call sites need exactly one repository. */
export function getCatalog() {
  return getDataContext().catalog;
}

export function getOrders() {
  return getDataContext().orders;
}

export function getSettings() {
  return getDataContext().settings;
}

export type { DataContext };
