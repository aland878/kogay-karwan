"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";

import { prefersReducedMotion } from "@/lib/motion";

/**
 * Smooth scrolling + scroll-triggered reveals.
 *
 * Lenis drives the scroll position and GSAP's ScrollTrigger reads from it. The
 * two must share a clock, otherwise triggers fire against the native scroll
 * position while the page is visually somewhere else — so Lenis is stepped from
 * GSAP's ticker rather than its own RAF loop.
 *
 * Under `prefers-reduced-motion` Lenis is never constructed: native scrolling
 * is correct, and hijacking it is exactly what that preference asks us not to
 * do. Reveal elements are made visible immediately in that case.
 */

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const reduced = prefersReducedMotion();

    // --- Reveals ----------------------------------------------------------
    const context = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>("[data-reveal]");

      if (reduced) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }

      targets.forEach((target) => {
        const children = target.querySelectorAll<HTMLElement>("[data-reveal-item]");
        const elements = children.length > 0 ? Array.from(children) : [target];

        gsap.from(elements, {
          opacity: 0,
          y: 28,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: target,
            start: "top 85%",
            once: true,
          },
        });
      });
    });

    if (reduced) {
      return () => context.revert();
    }

    // --- Lenis ------------------------------------------------------------
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch devices already have momentum scrolling; adding Lenis on top of
      // it fights the platform and feels laggy.
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const step = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(step);
    gsap.ticker.lagSmoothing(0);

    // Anchor links must go through Lenis or they jump past the smooth scroll.
    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!anchor) return;

      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;

      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -96 });
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(step);
      lenis.destroy();
      context.revert();
    };
  }, []);

  return <>{children}</>;
}
