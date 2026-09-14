"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { LogoLink } from "@/components/brand/logo";
import { ArrowRight, ButtonLink } from "@/components/ui/button";
import {
  ChevronDownIcon,
  CloseIcon,
  GlobeIcon,
  MenuIcon,
  UserIcon,
} from "@/components/ui/icons";
import { Container } from "@/components/ui/layout";
import { LOCALES, type Locale } from "@/lib/domain/types";
import { cn } from "@/lib/utils";

/**
 * Site header.
 *
 * Matches the reference: logo left, centred nav, then language / Login /
 * Get Started on the right. It starts transparent over the hero and gains a
 * surface + border once scrolled — the only thing that animates here, because
 * a header that moves while you read is a distraction.
 */

const NAV = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;

const LOCALE_LABEL: Record<Locale, string> = { en: "EN", ar: "AR", ku: "KU" };

export function SiteHeader({
  businessName,
  tagline,
}: {
  businessName: string;
  tagline: string;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile sheet on navigation, and lock body scroll while it is open.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow]",
        "duration-[var(--duration-base)] ease-[var(--ease-out-quint)]",
        scrolled || menuOpen
          ? "border-b border-line bg-canvas/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container size="wide">
        <div className="flex h-20 items-center justify-between gap-4">
          <LogoLink businessName={businessName} tagline={tagline} priority />

          {/* Desktop nav */}
          <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-[0.9375rem] font-medium",
                  "transition-colors duration-[var(--duration-quick)]",
                  isActive(item.href)
                    ? "text-ink"
                    : "text-ink-muted hover:text-ink",
                )}
              >
                {item.label}
                {/* The gold underline from the reference marks the active page. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent",
                    "origin-center transition-transform duration-[var(--duration-base)]",
                    "ease-[var(--ease-out-quint)]",
                    isActive(item.href) ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <LocaleSwitcher />

            <Link
              href="/b2b/login"
              className={cn(
                "hidden items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold",
                "text-white shadow-[0_8px_20px_-10px_rgba(173,119,32,0.85)] sm:inline-flex",
                "bg-[linear-gradient(135deg,var(--color-gold-400),var(--color-gold-600))]",
                "transition-transform duration-[var(--duration-quick)] hover:-translate-y-px",
              )}
            >
              <UserIcon className="size-4" />
              Login
            </Link>

            <ButtonLink
              href="/b2b/register"
              variant="secondary"
              size="sm"
              className="group hidden md:inline-flex"
              trailing={<ArrowRight />}
            >
              Get Started
            </ButtonLink>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="rounded-lg p-2 text-ink transition-colors hover:bg-surface-muted xl:hidden"
            >
              {menuOpen ? <MenuIconSwap /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        hidden={!menuOpen}
        className="border-t border-line bg-canvas xl:hidden"
      >
        <Container>
          <nav aria-label="Mobile" className="flex flex-col py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-3 text-base font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-accent-soft text-accent-strong"
                    : "text-ink-muted hover:bg-surface-muted hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-3 flex flex-col gap-2 border-t border-line pt-4">
              <ButtonLink href="/b2b/login" size="md">
                B2B Login
              </ButtonLink>
              <ButtonLink href="/b2b/register" variant="secondary" size="md">
                Request B2B Access
              </ButtonLink>
            </div>
          </nav>
        </Container>
      </div>
    </header>
  );
}

function MenuIconSwap() {
  return <CloseIcon />;
}

/**
 * Language switcher. Wired to the locale list; persistence lands with the i18n
 * routing layer, which is why it does not yet navigate.
 */
function LocaleSwitcher() {
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>("en");

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Change language"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2",
          "text-sm font-semibold text-ink-muted transition-colors",
          "hover:border-line-strong hover:text-ink",
        )}
      >
        <GlobeIcon className="size-4" />
        <span className="hidden sm:inline">{LOCALE_LABEL[locale]}</span>
        <ChevronDownIcon
          className={cn(
            "size-3.5 transition-transform duration-[var(--duration-quick)]",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          className={cn(
            "absolute end-0 top-full z-10 mt-2 min-w-32 overflow-hidden rounded-xl",
            "border border-line bg-surface p-1 shadow-lift",
          )}
        >
          {LOCALES.map((value) => (
            <li key={value}>
              <button
                type="button"
                role="option"
                aria-selected={locale === value}
                onClick={() => {
                  setLocale(value);
                  setOpen(false);
                }}
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-start text-sm font-medium transition-colors",
                  locale === value
                    ? "bg-accent-soft text-accent-strong"
                    : "text-ink-muted hover:bg-surface-muted hover:text-ink",
                )}
              >
                {value === "en" ? "English" : value === "ar" ? "العربية" : "کوردی"}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
