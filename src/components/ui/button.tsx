import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The one button in the system.
 *
 * `primary` is the gold pill from the hero — a real gradient with an inner
 * highlight, not a flat fill, because the reference design reads as metal.
 * Hover lifts 1px and deepens the shadow; that is the whole interaction. No
 * scale bounce, no glow pulse.
 */

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 font-semibold " +
  "whitespace-nowrap rounded-full transition-all duration-[var(--duration-quick)] " +
  "ease-[var(--ease-out-quint)] disabled:pointer-events-none disabled:opacity-50 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants: Record<Variant, string> = {
  primary: cn(
    "text-white shadow-[0_1px_0_rgba(255,255,255,0.28)_inset,0_10px_24px_-10px_rgba(173,119,32,0.75)]",
    "bg-[linear-gradient(135deg,var(--color-gold-400)_0%,var(--color-gold-500)_46%,var(--color-gold-600)_100%)]",
    "hover:-translate-y-px hover:shadow-[0_1px_0_rgba(255,255,255,0.32)_inset,0_16px_32px_-12px_rgba(173,119,32,0.9)]",
    "active:translate-y-0 active:shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_6px_16px_-8px_rgba(173,119,32,0.7)]",
  ),
  secondary: cn(
    "bg-surface text-ink border border-line shadow-card",
    "hover:-translate-y-px hover:border-line-strong hover:shadow-lift",
    "active:translate-y-0",
  ),
  outline: cn(
    "border border-accent/45 text-accent-strong bg-transparent",
    "hover:bg-accent-soft hover:border-accent",
  ),
  ghost: "text-ink-muted hover:text-ink hover:bg-surface-muted",
  danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.9375rem]",
  lg: "h-13 px-8 text-base",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** Trailing glyph — the hero's "Explore Products →" arrow. */
  trailing?: ReactNode;
  leading?: ReactNode;
};

type ButtonProps = BaseProps &
  Omit<ComponentPropsWithoutRef<"button">, "children" | "className">;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  trailing,
  leading,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {leading}
      {children}
      {trailing}
    </button>
  );
}

type ButtonLinkProps = BaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "children" | "className">;

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  trailing,
  leading,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {leading}
      {children}
      {trailing}
    </Link>
  );
}

/** Inline arrow that nudges on the parent's hover. Decorative, so aria-hidden. */
export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn(
        "size-4 transition-transform duration-[var(--duration-quick)]",
        "ease-[var(--ease-out-quint)] group-hover:translate-x-0.5 rtl:-scale-x-100",
        className,
      )}
    >
      <path
        d="M4 10h11m0 0-4.2-4.2M15 10l-4.2 4.2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
