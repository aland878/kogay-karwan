"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

import { HeroStage } from "@/components/site/hero/hero-stage";
import { ArrowRight, ButtonLink } from "@/components/ui/button";
import { PlayIcon, WIDGET_ICONS } from "@/components/ui/icons";
import { Container } from "@/components/ui/layout";
import type { HeroWidget, Locale, SiteSettings } from "@/lib/domain/types";
import { localize } from "@/lib/domain/types";
import { DURATION, EASE, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * HERO
 *
 * The composition from the reference, rebuilt responsively: widget chips above
 * the headline, the highlighted phrase carrying the gold gradient, two CTAs,
 * and the floating product stage on the end side.
 *
 * Copy and widgets are driven entirely by `SiteSettings`, so Admin edits the
 * headline, subcopy, button labels and every widget without a deploy.
 */

export function Hero({
  settings,
  locale = "en",
}: {
  settings: SiteSettings;
  locale?: Locale;
}) {
  const rootRef = useRef<HTMLElement>(null);
  const { hero } = settings;

  const widgets = hero.widgets
    .filter((widget) => widget.active)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const context = gsap.context(() => {
      // Copy enters as one considered sequence, not eight separate reveals.
      gsap
        .timeline({ defaults: { ease: EASE.quint, duration: DURATION.slow } })
        .from("[data-hero-widget]", { opacity: 0, y: -14, stagger: 0.08 })
        .from("[data-hero-line]", { opacity: 0, y: 26, stagger: 0.1 }, "-=0.62")
        .from("[data-hero-lead]", { opacity: 0, y: 18 }, "-=0.66")
        .from("[data-hero-cta]", { opacity: 0, y: 16, stagger: 0.08 }, "-=0.66");
    }, root);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden pb-10 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36"
    >
      {/* Ambient wash. Sits behind everything and never intercepts pointers. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 80% at 72% 18%, var(--accent-soft) 0%, transparent 58%)",
        }}
      />

      <Container size="wide">
        {/* Widget chips — a scroll rail on phones so they never wrap raggedly. */}
        {widgets.length > 0 ? (
          <ul
            className={cn(
              "mb-10 flex gap-3 overflow-x-auto pb-2 lg:mb-12",
              "[-ms-overflow-style:none] [scrollbar-width:none]",
              "[&::-webkit-scrollbar]:hidden",
            )}
          >
            {widgets.map((widget) => (
              <HeroWidgetChip key={widget.id} widget={widget} locale={locale} />
            ))}
          </ul>
        ) : null}

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8">
          {/* --- Copy column --- */}
          <div className="max-w-xl">
            <h1 className="text-[2.5rem] font-extrabold leading-[1.06] tracking-tight sm:text-[3.25rem] lg:text-[3.75rem]">
              <span data-hero-line className="block">
                {localize(hero.headlinePrefix, locale)}
              </span>
              <span data-hero-line className="block text-gold-gradient">
                {localize(hero.headlineHighlight, locale)}
              </span>
              <span data-hero-line className="block">
                {localize(hero.headlineSuffix, locale)}
              </span>
            </h1>

            <p
              data-hero-lead
              className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-ink-muted sm:text-lg"
            >
              {localize(hero.subcopy, locale)}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
              <span data-hero-cta>
                <ButtonLink
                  href="/products"
                  size="lg"
                  className="group"
                  trailing={<ArrowRight />}
                >
                  {localize(hero.primaryCta, locale)}
                </ButtonLink>
              </span>

              <span data-hero-cta>
                <ButtonLink
                  href={hero.videoUrl ?? "/about#video"}
                  size="lg"
                  variant="secondary"
                  leading={<PlayIcon className="size-5 text-accent" />}
                >
                  {localize(hero.secondaryCta, locale)}
                </ButtonLink>
              </span>
            </div>

            {/* Cash-only is a real commercial term, so it is stated up front. */}
            <p className="mt-6 text-sm font-medium text-ink-subtle">
              {localize(settings.business.cashOnlyNote, locale)}
            </p>
          </div>

          {/* --- Stage column --- */}
          <HeroStage className="mx-auto w-full max-w-[38rem] lg:max-w-none" />
        </div>
      </Container>
    </section>
  );
}

function HeroWidgetChip({
  widget,
  locale,
}: {
  widget: HeroWidget;
  locale: Locale;
}) {
  const Icon = WIDGET_ICONS[widget.icon];

  return (
    <li
      data-hero-widget
      className={cn(
        "flex shrink-0 items-center gap-3 rounded-2xl border border-line bg-surface/80",
        "px-4 py-3 shadow-card backdrop-blur-sm transition-[transform,box-shadow]",
        "duration-[var(--duration-base)] ease-[var(--ease-out-quint)]",
        "hover:-translate-y-0.5 hover:shadow-lift",
      )}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong">
        <Icon className="size-5" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-bold text-ink">
          {localize(widget.title, locale)}
        </span>
        <span className="text-xs text-ink-subtle">
          {localize(widget.subtitle, locale)}
        </span>
      </span>
    </li>
  );
}
