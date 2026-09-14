import Link from "next/link";
import type { ReactNode } from "react";

import { Logo } from "@/components/brand/logo";
import { signOut } from "@/lib/auth/actions";
import { Container } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

/**
 * PORTAL SHELL — chrome shared by the B2B, Employee and Admin dashboards.
 *
 * Deliberately separate from the public site shell: no Lenis, no marketing nav,
 * no scroll animation. These are working tools, and a cashier processing an
 * order should never wait on a smooth-scroll easing curve.
 */

export type PortalNavItem = { href: string; label: string };

export function PortalShell({
  audience,
  portalName,
  nav,
  user,
  children,
}: {
  audience: "b2b" | "employee" | "admin";
  portalName: string;
  nav: PortalNavItem[];
  user: { name: string; detail: string };
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-canvas-sunken">
      <header className="border-b border-line bg-surface">
        <Container size="wide">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" aria-label="Kogay Karwan home">
                <Logo showTagline={false} className="h-8" />
              </Link>
              <span className="hidden rounded-full bg-accent-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-accent-strong sm:inline">
                {portalName}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden flex-col text-end leading-tight sm:flex">
                <span className="text-sm font-semibold text-ink">{user.name}</span>
                <span className="text-xs text-ink-subtle">{user.detail}</span>
              </span>

              {/* Sign-out is a POST-style server action, not a GET link — a link
                  would let a prefetch or a crawler log the user out. */}
              <form
                action={async () => {
                  "use server";
                  await signOut(audience);
                }}
              >
                <button
                  type="submit"
                  className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </Container>
      </header>

      <div className="border-b border-line bg-surface">
        <Container size="wide">
          <nav aria-label={`${portalName} sections`} className="flex gap-1 overflow-x-auto">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 border-b-2 border-transparent px-4 py-3 text-sm font-medium",
                  "text-ink-muted transition-colors hover:border-accent/40 hover:text-ink",
                )}
              >
                {item.label}
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

/**
 * Marks a portal area that is wired and reachable but whose screens are not
 * built yet. Being explicit beats a convincing-looking dashboard full of
 * invented numbers — nobody can mistake this for finished work.
 */
export function ScaffoldNotice({
  area,
  planned,
}: {
  area: string;
  planned: string[];
}) {
  return (
    <div className="rounded-2xl border border-dashed border-accent/40 bg-surface p-8">
      <span className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-accent-strong">
        Scaffolded
      </span>
      <h2 className="mt-3 text-2xl font-bold text-ink">{area}</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
        The route, layout, authentication and permission checks for this area are
        in place. The screens below are the next build stage.
      </p>

      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {planned.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2.5 rounded-lg bg-surface-muted px-3 py-2 text-sm text-ink-muted"
          >
            <span className="size-1.5 shrink-0 rounded-full bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
