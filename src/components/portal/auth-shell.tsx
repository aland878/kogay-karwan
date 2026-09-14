import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

/**
 * PORTAL AUTH SHELL
 *
 * A split screen: the form on one side, a deep navy panel carrying the brand on
 * the other. Each portal passes its own accent copy so B2B, Employee and Admin
 * are visibly different places — a cashier should never wonder which system
 * they just signed into.
 */

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  aside,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  aside: { heading: string; points: string[] };
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      {/* --- Form side --- */}
      <div className="flex flex-col justify-center px-5 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="inline-block">
            <Logo />
          </Link>

          <div className="mt-10">
            <span className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-accent-strong">
              {eyebrow}
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">
              {title}
            </h1>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-ink-muted">
              {subtitle}
            </p>
          </div>

          <div className="mt-8">{children}</div>

          {footer ? <div className="mt-8">{footer}</div> : null}
        </div>
      </div>

      {/* --- Brand side. Decorative, so it is hidden from assistive tech. --- */}
      <aside
        aria-hidden="true"
        className="relative hidden overflow-hidden bg-navy-950 lg:block"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 70% 12%, rgba(201,147,42,0.30) 0%, transparent 62%)",
          }}
        />

        {/* Orbital rings echoing the emblem. */}
        <div className="absolute -right-24 top-1/4 aspect-square w-[34rem] rounded-full border border-gold-500/15" />
        <div className="absolute -right-10 top-1/3 aspect-square w-[26rem] rounded-full border border-gold-500/10" />

        <div className="relative flex h-full flex-col justify-end p-14">
          <h2 className="max-w-md text-balance text-4xl font-extrabold leading-tight text-white">
            {aside.heading}
          </h2>

          <ul className="mt-8 flex max-w-md flex-col gap-3">
            {aside.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-white/65">
                <span
                  className={cn(
                    "mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-400",
                  )}
                />
                <span className="text-sm leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
