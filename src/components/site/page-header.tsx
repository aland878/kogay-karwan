import Link from "next/link";

import { Container } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

/**
 * Inner-page header. Sits under the fixed site header, so it carries the top
 * padding that clears it — pages themselves never deal with that offset.
 */

export type Crumb = { href?: string; label: string };

export function PageHeader({
  eyebrow,
  title,
  highlight,
  lead,
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  lead?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line pb-12 pt-32 sm:pb-16 sm:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(90% 70% at 20% 0%, var(--accent-soft) 0%, transparent 58%)",
        }}
      />

      <Container size="wide">
        {crumbs && crumbs.length > 0 ? <Breadcrumbs crumbs={crumbs} /> : null}

        <div className="mt-5 max-w-3xl">
          {eyebrow ? (
            <span className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-accent-strong">
              <span aria-hidden="true" className="h-px w-6 bg-accent/50" />
              {eyebrow}
            </span>
          ) : null}

          <h1 className="mt-3 text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
            {title}
            {highlight ? (
              <>
                {" "}
                <span className="text-gold-gradient">{highlight}</span>
              </>
            ) : null}
          </h1>

          {lead ? (
            <p className="mt-4 text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
              {lead}
            </p>
          ) : null}
        </div>

        {children ? <div className="mt-8">{children}</div> : null}
      </Container>
    </header>
  );
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-subtle">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-1.5">
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="transition-colors hover:text-accent-strong"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(isLast && "font-medium text-ink-muted")}
                >
                  {crumb.label}
                </span>
              )}

              {!isLast ? (
                <span aria-hidden="true" className="text-ink-subtle/50">
                  /
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
