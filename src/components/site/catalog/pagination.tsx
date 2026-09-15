import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Server-rendered pagination.
 *
 * Real <a> links, not buttons: each page is a distinct URL, so it is
 * crawlable, shareable and works before hydration. Long ranges collapse with
 * ellipses so a 200-page catalog does not render 200 links.
 */

export function Pagination({
  page,
  pageCount,
  baseHref,
  searchParams,
}: {
  page: number;
  pageCount: number;
  baseHref: string;
  searchParams: Record<string, string | undefined>;
}) {
  if (pageCount <= 1) return null;

  const hrefFor = (target: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== "page") params.set(key, value);
    }
    if (target > 1) params.set("page", String(target));

    const query = params.toString();
    return query ? `${baseHref}?${query}` : baseHref;
  };

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
      <PageLink
        href={hrefFor(page - 1)}
        disabled={page <= 1}
        label="Previous page"
      >
        <span aria-hidden="true">←</span>
      </PageLink>

      <ul className="flex items-center gap-1">
        {buildRange(page, pageCount).map((entry, index) =>
          entry === "gap" ? (
            <li
              key={`gap-${index}`}
              aria-hidden="true"
              className="px-2 text-ink-subtle"
            >
              …
            </li>
          ) : (
            <li key={entry}>
              <Link
                href={hrefFor(entry)}
                aria-current={entry === page ? "page" : undefined}
                aria-label={`Page ${entry}`}
                className={cn(
                  "grid size-10 place-items-center rounded-lg text-sm font-semibold",
                  "transition-colors duration-[var(--duration-quick)]",
                  entry === page
                    ? "bg-accent text-white"
                    : "border border-line text-ink-muted hover:border-accent/40 hover:text-ink",
                )}
              >
                {entry}
              </Link>
            </li>
          ),
        )}
      </ul>

      <PageLink
        href={hrefFor(page + 1)}
        disabled={page >= pageCount}
        label="Next page"
      >
        <span aria-hidden="true">→</span>
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  disabled,
  label,
  children,
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const className = cn(
    "grid size-10 place-items-center rounded-lg border border-line text-sm",
    "transition-colors duration-[var(--duration-quick)]",
    disabled
      ? "cursor-not-allowed opacity-40"
      : "text-ink-muted hover:border-accent/40 hover:text-ink",
  );

  // A disabled control must not stay in the tab order or keep a live href.
  if (disabled) {
    return (
      <span aria-disabled="true" aria-label={label} className={className}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} aria-label={label} className={className}>
      {children}
    </Link>
  );
}

/**
 * Windowed page range: always the first and last page, plus a window around
 * the current one, with gaps marked. Keeps the control a fixed width no matter
 * how deep the catalog goes.
 */
function buildRange(page: number, pageCount: number): (number | "gap")[] {
  const window = 1;
  const pages = new Set<number>([1, pageCount]);

  for (let index = page - window; index <= page + window; index += 1) {
    if (index >= 1 && index <= pageCount) pages.add(index);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "gap")[] = [];

  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) result.push("gap");
    result.push(value);
  });

  return result;
}
