"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/layout";
import { useCart } from "@/lib/cart/cart-context";
import type { Locale } from "@/lib/domain/types";
import { t } from "@/lib/i18n/dictionary";
import { cn } from "@/lib/utils";

/**
 * B2B PORTAL SHELL
 *
 * Working chrome: no Lenis, no marketing navigation, no scroll animation. The
 * only live element is the cart badge, which reads from the cart context so it
 * stays correct across every screen without a refetch.
 */

const NAV = [
  { href: "/b2b", key: "b2b.dashboard" },
  { href: "/b2b/products", key: "nav.products" },
  { href: "/b2b/orders", key: "b2b.orders" },
  { href: "/b2b/account", key: "b2b.account" },
] as const;

export function B2BShell({
  user,
  locale,
  signOutAction,
  children,
}: {
  user: { name: string; detail: string };
  locale: Locale;
  signOutAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { itemCount, hydrated } = useCart();

  const isActive = (href: string) =>
    href === "/b2b" ? pathname === "/b2b" : pathname.startsWith(href);

  return (
    <div className="min-h-dvh bg-canvas-sunken">
      <header className="sticky top-0 z-40 border-b border-line bg-surface">
        <Container size="wide">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" aria-label="Kogay Karwan home">
                <Logo showTagline={false} className="h-8" />
              </Link>
              <span className="hidden rounded-full bg-accent-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-accent-strong sm:inline">
                {t("b2b.portal", locale)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <CartButton itemCount={itemCount} hydrated={hydrated} locale={locale} />

              <span className="hidden flex-col text-end leading-tight sm:flex">
                <span className="text-sm font-semibold text-ink">{user.name}</span>
                <span dir="ltr" className="text-xs text-ink-subtle">
                  {user.detail}
                </span>
              </span>

              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
                >
                  {t("action.signOut", locale)}
                </button>
              </form>
            </div>
          </div>
        </Container>
      </header>

      <div className="border-b border-line bg-surface">
        <Container size="wide">
          <nav aria-label="Portal sections" className="flex gap-1 overflow-x-auto">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "shrink-0 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "border-accent text-ink"
                    : "border-transparent text-ink-muted hover:border-accent/40 hover:text-ink",
                )}
              >
                {t(item.key, locale)}
              </Link>
            ))}
          </nav>
        </Container>
      </div>

      <main id="main" className="py-8">
        <Container size="wide">{children}</Container>
      </main>
    </div>
  );
}

function CartButton({
  itemCount,
  hydrated,
  locale,
}: {
  itemCount: number;
  hydrated: boolean;
  locale: Locale;
}) {
  return (
    <Link
      href="/b2b/cart"
      className={cn(
        "relative inline-flex items-center gap-2 rounded-full border border-line px-4 py-2",
        "text-sm font-semibold text-ink transition-colors hover:border-accent/45",
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="size-4"
      >
        <path d="M3 4h2.2l2.3 11h9.6l2.1-8H6.2" />
        <circle cx="9" cy="19" r="1.4" />
        <circle cx="17" cy="19" r="1.4" />
      </svg>

      <span className="hidden sm:inline">{t("cart.title", locale)}</span>

      {/* Rendered only after hydration: the server cannot know the count, and
          showing 0 first would flash the wrong number on every load. */}
      {hydrated && itemCount > 0 ? (
        <span className="grid min-w-5 place-items-center rounded-full bg-accent px-1.5 text-xs font-bold text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}

      <span className="sr-only">
        {hydrated ? `${itemCount} items in cart` : "Cart"}
      </span>
    </Link>
  );
}
