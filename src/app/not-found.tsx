import Link from "next/link";

import { ArrowRight, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/layout";

/**
 * Custom 404. Brand-consistent rather than a framework default, and it offers
 * real routes out — a dead end on a catalog site loses an order.
 */
export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh items-center overflow-hidden py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 60% at 50% 10%, var(--accent-soft) 0%, transparent 60%)",
        }}
      />

      <Container>
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <p className="text-[6rem] font-extrabold leading-none text-gold-gradient sm:text-[8rem]">
            404
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            This page isn&apos;t in stock
          </h1>

          <p className="mt-4 text-pretty leading-relaxed text-ink-muted">
            The page you&apos;re looking for has moved or never existed. The
            catalog, categories and our contact details are all still here.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/" size="lg" className="group" trailing={<ArrowRight />}>
              Back to home
            </ButtonLink>
            <ButtonLink href="/products" size="lg" variant="secondary">
              Browse products
            </ButtonLink>
          </div>

          <p className="mt-8 text-sm text-ink-subtle">
            Need something specific?{" "}
            <Link
              href="/contact"
              className="font-semibold text-accent-strong underline-offset-4 hover:underline"
            >
              Talk to us on WhatsApp
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
