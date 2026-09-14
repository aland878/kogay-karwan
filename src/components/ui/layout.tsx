import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Layout primitives.
 *
 * `Container` owns the side gutter for the whole site — one place, so the page
 * can never scroll horizontally on a phone. Sections set vertical rhythm with
 * `padding-block` only and never touch the horizontal padding.
 */

export function Container({
  className,
  children,
  size = "default",
}: {
  className?: string;
  children: ReactNode;
  size?: "default" | "wide" | "narrow";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        size === "default" && "max-w-[82rem]",
        size === "wide" && "max-w-[96rem]",
        size === "narrow" && "max-w-[52rem]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Section({
  className,
  children,
  as: Tag = "section",
  id,
  tone = "canvas",
}: {
  className?: string;
  children: ReactNode;
  as?: ElementType;
  id?: string;
  tone?: "canvas" | "raised" | "sunken";
}) {
  return (
    <Tag
      id={id}
      className={cn(
        "py-20 sm:py-28",
        tone === "raised" && "bg-canvas-raised",
        tone === "sunken" && "bg-canvas-sunken",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * Section heading block. Eyebrow / title / lead, with the title's optional
 * highlighted span carrying the gold gradient — the same treatment as the hero
 * headline, so hierarchy stays consistent down the page.
 */
export function SectionHeading({
  eyebrow,
  title,
  highlight,
  lead,
  align = "start",
  className,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  lead?: string;
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-accent-strong">
          <span aria-hidden="true" className="h-px w-6 bg-accent/50" />
          {eyebrow}
        </span>
      ) : null}

      <h2 className="text-balance text-3xl font-bold leading-[1.12] sm:text-4xl lg:text-[2.75rem]">
        {title}
        {highlight ? (
          <>
            {" "}
            <span className="text-gold-gradient">{highlight}</span>
          </>
        ) : null}
      </h2>

      {lead ? (
        <p className="text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
          {lead}
        </p>
      ) : null}
    </div>
  );
}

/** Surface card. `interactive` adds the lift used by product and service tiles. */
export function Card({
  className,
  children,
  interactive = false,
}: {
  className?: string;
  children: ReactNode;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface shadow-card",
        interactive &&
          "transition-[transform,box-shadow,border-color] duration-[var(--duration-base)] " +
            "ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:border-accent/35 hover:shadow-lift",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "gold" | "success" | "warning" | "danger";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        tone === "neutral" && "bg-surface-muted text-ink-muted",
        tone === "gold" && "bg-accent-soft text-accent-strong",
        tone === "success" && "bg-leaf-500/12 text-leaf-600 dark:text-leaf-400",
        tone === "warning" && "bg-amber-500/15 text-amber-700 dark:text-amber-400",
        tone === "danger" && "bg-red-500/12 text-red-700 dark:text-red-400",
        className,
      )}
    >
      {children}
    </span>
  );
}
