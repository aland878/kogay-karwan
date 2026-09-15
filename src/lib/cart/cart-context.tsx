"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { clampQuantity } from "@/lib/cart/totals";

/**
 * CART STATE
 *
 * The cart holds ONLY `{ productId, quantity }`. No price, no discount, no
 * name. Two reasons:
 *
 *  1. Security — the server re-reads every price from the catalog at submission
 *     time, so a hand-edited localStorage entry cannot change what an order
 *     costs.
 *  2. Correctness — if Admin changes a price while a cart sits open overnight,
 *     the buyer is quoted the current price, not a stale one captured at
 *     add-to-cart time.
 *
 * Persisted per browser so a cart survives a reload. It is a draft, not a
 * record: the authoritative order exists only once submitted.
 */

const STORAGE_KEY = "kg_b2b_cart_v1";

export type CartEntry = { productId: string; quantity: number };

type CartContextValue = {
  entries: CartEntry[];
  /** Total units across all lines — what the header badge shows. */
  itemCount: number;
  lineCount: number;
  /** Ready only after the first client read; guards against hydration mismatch. */
  hydrated: boolean;
  add: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  quantityOf: (productId: string) => number;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartEntry[] {
  // Storage access throws in private mode and when site data is blocked, and
  // the stored value may be anything. Neither may break the portal.
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (entry): entry is CartEntry =>
          typeof entry === "object" &&
          entry !== null &&
          typeof (entry as CartEntry).productId === "string" &&
          typeof (entry as CartEntry).quantity === "number",
      )
      .map((entry) => ({
        productId: entry.productId,
        quantity: clampQuantity(entry.quantity),
      }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<CartEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Read after mount, never during render: the server has no localStorage, and
  // seeding initial state from it would mismatch on hydration.
  useEffect(() => {
    setEntries(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // A cart that cannot persist still works for this session.
    }
  }, [entries, hydrated]);

  // Keep duplicate tabs in step — two windows on one cart is normal for a buyer
  // comparing the catalog against their shelf list.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) setEntries(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback((productId: string, quantity = 1) => {
    setEntries((current) => {
      const existing = current.find((entry) => entry.productId === productId);
      if (!existing) {
        return [...current, { productId, quantity: clampQuantity(quantity) }];
      }
      return current.map((entry) =>
        entry.productId === productId
          ? { ...entry, quantity: clampQuantity(entry.quantity + quantity) }
          : entry,
      );
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setEntries((current) => {
      // Dropping to zero removes the line rather than leaving an empty row.
      if (quantity <= 0) {
        return current.filter((entry) => entry.productId !== productId);
      }
      return current.map((entry) =>
        entry.productId === productId
          ? { ...entry, quantity: clampQuantity(quantity) }
          : entry,
      );
    });
  }, []);

  const remove = useCallback((productId: string) => {
    setEntries((current) => current.filter((entry) => entry.productId !== productId));
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  const value = useMemo<CartContextValue>(() => {
    const quantityOf = (productId: string) =>
      entries.find((entry) => entry.productId === productId)?.quantity ?? 0;

    return {
      entries,
      itemCount: entries.reduce((sum, entry) => sum + entry.quantity, 0),
      lineCount: entries.length,
      hydrated,
      add,
      setQuantity,
      remove,
      clear,
      quantityOf,
    };
  }, [entries, hydrated, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return context;
}
