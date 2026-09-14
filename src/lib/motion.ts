/**
 * MOTION CONTRACT
 *
 * Every animated surface goes through here. Two rules the codebase enforces
 * rather than hopes for:
 *
 *  1. `prefersReducedMotion()` is checked before a timeline is built, not after.
 *     A reduced-motion visitor should never have the animation constructed and
 *     then skipped — elements land in their final state directly.
 *  2. Only compositor-friendly properties are animated: transform and opacity.
 *     Nothing here animates width, height, top or left.
 */

export const DURATION = {
  quick: 0.18,
  base: 0.42,
  slow: 0.9,
  float: 5.5,
} as const;

export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  /** Matches --ease-out-quint in CSS so JS and CSS motion feel identical. */
  quint: "expo.out",
  float: "sine.inOut",
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Per-product float parameters.
 *
 * Amplitude and duration are derived from the index rather than randomised, so
 * neighbouring products never drift into sync — a row of items bobbing in
 * lockstep reads as a carousel glitch, not as depth. The prime-ish multipliers
 * keep the cycle from repeating visibly.
 */
export function floatParams(index: number) {
  return {
    /** Vertical travel in px. Deliberately small — this is drift, not bounce. */
    distance: 7 + (index % 3) * 3,
    duration: DURATION.float + (index % 4) * 0.7,
    delay: index * 0.35,
    rotation: index % 2 === 0 ? 1.1 : -0.9,
  };
}

/** Standard scroll-reveal offsets, so every section enters the same way. */
export const REVEAL = {
  y: 28,
  opacity: 0,
  duration: DURATION.slow,
  ease: EASE.quint,
  stagger: 0.08,
  /** Fires when the element's top passes 85% of the viewport height. */
  start: "top 85%",
} as const;
