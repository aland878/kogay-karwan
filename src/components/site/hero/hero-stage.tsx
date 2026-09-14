"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { AssetImage } from "@/components/ui/asset-image";
import { LOGO, PRODUCT_IMAGES, type ProductImageKey } from "@/lib/assets";
import { DURATION, EASE, floatParams, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * HERO STAGE — the floating product composition.
 *
 * Recreated from the supplied design: the gold KK emblem sits behind, a gold
 * podium ring carries the products, and the seven real items are arranged in
 * three depth planes so the group reads as a physical group shot rather than a
 * flat row.
 *
 * Positioning is percentage-based inside an aspect-ratio box, so the whole
 * composition scales as one unit instead of re-flowing item by item. Every
 * product uses object-contain — packaging is never stretched.
 */

type StageItem = {
  key: ProductImageKey;
  label: string;
  /** Percentage offsets from the stage's left/bottom edges. */
  left: number;
  bottom: number;
  /** Rendered width as a percentage of stage width. */
  width: number;
  /** Depth plane: back sits behind the podium lip, front overlaps it. */
  plane: "back" | "mid" | "front";
};

/**
 * Order matters: later entries paint on top. Mirrors the reference layout —
 * rice bag and milk carton anchor the back, cans and oil fill the middle,
 * the Metro bar lies across the podium front.
 */
const STAGE_ITEMS: StageItem[] = [
  { key: "mahmoodRice", label: "Mahmood Rice", left: 37, bottom: 19, width: 23, plane: "back" },
  { key: "almaraiMilk", label: "Almarai Milk", left: 71, bottom: 18, width: 16, plane: "back" },
  { key: "altunsaOil", label: "Altunsa Oil", left: 53, bottom: 17, width: 13, plane: "mid" },
  { key: "zerTomatoPaste", label: "ZER Tomato Paste", left: 64, bottom: 15, width: 15, plane: "mid" },
  { key: "pepsi", label: "Pepsi", left: 27, bottom: 13, width: 11, plane: "front" },
  { key: "cocaCola", label: "Coca-Cola", left: 37, bottom: 12, width: 11, plane: "front" },
  { key: "ulkerMetro", label: "Ülker Metro", left: 52, bottom: 8, width: 26, plane: "front" },
];

const PLANE_Z: Record<StageItem["plane"], string> = {
  back: "z-10",
  mid: "z-20",
  front: "z-30",
};

export function HeroStage({ className }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [emblemFailed, setEmblemFailed] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    // Reduced motion: nothing is built, so nothing has to be torn down. The
    // composition is already in its final state from CSS.
    if (prefersReducedMotion()) return;

    const context = gsap.context(() => {
      const products = gsap.utils.toArray<HTMLElement>("[data-hero-product]");

      // --- Entrance: the group settles into place, back plane first ---------
      const intro = gsap.timeline({ defaults: { ease: EASE.quint } });

      intro
        .from("[data-hero-emblem]", {
          opacity: 0,
          scale: 0.92,
          duration: DURATION.slow,
        })
        .from(
          "[data-hero-podium]",
          { opacity: 0, scaleX: 0.8, duration: DURATION.slow },
          "-=0.6",
        )
        .from(
          products,
          {
            opacity: 0,
            y: 46,
            scale: 0.94,
            duration: DURATION.slow,
            stagger: 0.075,
          },
          "-=0.55",
        );

      // --- Perpetual float: starts only once the entrance has landed --------
      intro.eventCallback("onComplete", () => {
        products.forEach((product, index) => {
          const { distance, duration, delay, rotation } = floatParams(index);

          gsap.to(product, {
            y: -distance,
            rotation,
            duration,
            delay,
            ease: EASE.float,
            repeat: -1,
            yoyo: true,
          });
        });

        // The podium ring rotates far too slowly to read as spinning — it just
        // keeps the gold highlight alive so the scene never looks frozen.
        gsap.to("[data-hero-ring]", {
          rotation: 360,
          duration: 90,
          ease: "none",
          repeat: -1,
        });
      });
    }, stage);

    return () => context.revert();
  }, []);

  return (
    <div
      ref={stageRef}
      className={cn(
        "relative aspect-[4/3.35] w-full select-none sm:aspect-[4/3]",
        className,
      )}
    >
      {/* Warm halo behind everything — the light source for the whole scene. */}
      <div
        aria-hidden="true"
        className="hero-halo pointer-events-none absolute inset-[-12%] rounded-full blur-2xl"
      />

      {/* The KK emblem, seated behind the products as in the reference. */}
      <div
        data-hero-emblem
        aria-hidden="true"
        className="absolute left-1/2 top-[6%] z-0 w-[62%] -translate-x-1/2"
      >
        {emblemFailed ? (
          <EmblemFallback />
        ) : (
          <Image
            src={LOGO.emblem.src}
            alt=""
            width={LOGO.emblem.width}
            height={LOGO.emblem.height}
            priority
            onError={() => setEmblemFailed(true)}
            className="h-auto w-full object-contain opacity-90 mix-blend-multiply dark:mix-blend-normal dark:opacity-80"
          />
        )}
      </div>

      {/* Orbital gold rings. */}
      <div
        data-hero-ring
        aria-hidden="true"
        className="absolute left-1/2 top-[30%] z-10 aspect-square w-[88%] -translate-x-1/2 will-change-transform"
      >
        <div className="absolute inset-0 rounded-full border border-accent/25" />
        <div className="absolute inset-[9%] rounded-full border border-accent/15" />
      </div>

      {/* Podium. */}
      <div
        data-hero-podium
        aria-hidden="true"
        className="absolute inset-x-[16%] bottom-[6%] z-20 will-change-transform"
      >
        <div className="edge-gold h-3 rounded-[50%] opacity-90 blur-[0.3px]" />
        <div className="edge-gold mx-[6%] mt-1 h-2.5 rounded-[50%] opacity-60" />
        <div
          className="mx-[2%] mt-2 h-10 rounded-[50%] opacity-35 blur-xl"
          style={{ background: "var(--color-gold-500)" }}
        />
      </div>

      {/* Products. */}
      {STAGE_ITEMS.map((item, index) => (
        <div
          key={item.key}
          data-hero-product
          className={cn(
            "absolute will-change-transform",
            PLANE_Z[item.plane],
            item.plane === "back" && "opacity-95",
          )}
          style={{
            left: `${item.left}%`,
            bottom: `${item.bottom}%`,
            width: `${item.width}%`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="relative aspect-[3/5] w-full drop-shadow-[var(--shadow-product)]">
            <AssetImage
              asset={PRODUCT_IMAGES[item.key]}
              fallbackLabel={item.label}
              sizes="(max-width: 640px) 34vw, (max-width: 1024px) 22vw, 16vw"
              priority={index < 4}
              fallbackRatio={3 / 5}
            />
          </div>
        </div>
      ))}

      {/* Drifting leaf accents from the reference — purely decorative. */}
      <Leaf className="left-[6%] top-[14%] size-7 rotate-[18deg]" delay={0} />
      <Leaf className="right-[8%] top-[24%] size-6 -rotate-[24deg]" delay={1.4} />
      <Leaf className="left-[12%] bottom-[30%] size-5 rotate-[42deg]" delay={2.6} />
    </div>
  );
}

/**
 * Shown only if the emblem file is missing. A dashed gold ring that reads as a
 * pending asset — never an invented substitute mark.
 */
function EmblemFallback() {
  return (
    <div className="mx-auto flex aspect-video w-full items-center justify-center">
      <div className="flex size-[58%] items-center justify-center rounded-full border-2 border-dashed border-accent/45">
        <span className="px-3 text-center text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-accent-strong">
          Emblem
          <br />
          pending
        </span>
      </div>
    </div>
  );
}

function Leaf({ className, delay }: { className?: string; delay: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("absolute z-30 text-leaf-500/70 motion-safe:animate-pulse", className)}
      style={{ animationDuration: "6s", animationDelay: `${delay}s` }}
      fill="currentColor"
    >
      <path d="M20 4c-8 0-14 3.5-14 10a6 6 0 0 0 1.2 3.6L5 20l1.4 1.4 2.4-2.2A6 6 0 0 0 12 20c6.5 0 8-6 8-16z" />
    </svg>
  );
}
