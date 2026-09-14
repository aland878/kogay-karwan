import { NextResponse, type NextRequest } from "next/server";

/**
 * ROUTE GUARD — redirect convenience only.
 *
 * This runs on the edge with no database access, so it can check whether a
 * session cookie EXISTS but not whether it is valid, current, or carries the
 * right permissions. It exists to send a signed-out visitor to the correct
 * login screen instead of a flash of empty dashboard.
 *
 * It is NOT the security boundary. Every protected page and action calls
 * `requireAdmin()` / `requireEmployee()` / `requireB2B()` server-side, and once
 * Supabase is connected, RLS enforces the same rules at the database. Deleting
 * this file would worsen the UX and change nothing about who can read what.
 */

const COOKIES = {
  b2b: "kg_b2b_session",
  employee: "kg_emp_session",
  admin: "kg_adm_session",
} as const;

/** Reachable without a session, so the guard must not trap visitors here. */
const PUBLIC_PORTAL_ROUTES = [
  "/b2b/login",
  "/b2b/register",
  "/employee/login",
  "/admin/login",
];

type PortalKey = keyof typeof COOKIES;

const PORTALS: { prefix: string; key: PortalKey; login: string }[] = [
  { prefix: "/admin", key: "admin", login: "/admin/login" },
  { prefix: "/employee", key: "employee", login: "/employee/login" },
  { prefix: "/b2b", key: "b2b", login: "/b2b/login" },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PORTAL_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const portal = PORTALS.find(
    (entry) => pathname === entry.prefix || pathname.startsWith(`${entry.prefix}/`),
  );
  if (!portal) return NextResponse.next();

  const hasCookie = Boolean(request.cookies.get(COOKIES[portal.key])?.value);
  if (hasCookie) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = portal.login;
  // Preserve the destination so login can return the user where they meant to go.
  url.searchParams.set("next", pathname);

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/b2b/:path*", "/employee/:path*", "/admin/:path*"],
};
