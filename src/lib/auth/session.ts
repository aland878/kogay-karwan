import "server-only";

import { cookies } from "next/headers";

import type {
  Audience,
  EmployeeRole,
  Permission,
  Session,
} from "@/lib/domain/types";
import { ALL_PERMISSIONS, ROLE_PERMISSIONS } from "@/lib/domain/types";

/**
 * SESSION HANDLING
 *
 * Three separate cookies, one per authenticated audience. They are deliberately
 * NOT interchangeable: holding an employee session grants nothing on /admin,
 * and an admin session is not a B2B customer. This is what "do not use one
 * generic login for everybody" means structurally.
 *
 * ── Security posture ───────────────────────────────────────────────────────
 * The middleware checks only for cookie PRESENCE, because Next.js middleware
 * runs on the edge and cannot reach the database. That check is a redirect
 * convenience, never an authorisation decision. Every server component, route
 * handler and server action that touches protected data must call
 * `requireEmployee()` / `requireAdmin()` / `requireB2B()` from here, which is
 * where the real check belongs.
 *
 * ── What replaces this with Supabase ───────────────────────────────────────
 * `readSession()` becomes a Supabase Auth session lookup plus a profile row
 * read for role and permissions. The exported guard functions keep the same
 * signatures, so no call site changes. Authorisation additionally moves into
 * RLS policies so it is enforced at the database, not only in this layer.
 */

export const SESSION_COOKIES = {
  b2b: "kg_b2b_session",
  employee: "kg_emp_session",
  admin: "kg_adm_session",
} as const satisfies Record<Exclude<Audience, "public">, string>;

export const LOGIN_ROUTES = {
  b2b: "/b2b/login",
  employee: "/employee/login",
  admin: "/admin/login",
} as const satisfies Record<Exclude<Audience, "public">, string>;

/**
 * Cookie options shared by every audience.
 *
 * `httpOnly` keeps the token out of reach of any script on the page, and
 * `sameSite: "lax"` blocks it from riding along on cross-site POSTs — the
 * baseline CSRF defence for a cookie-authenticated app.
 */
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 8, // one working day
} as const;

export class AuthorizationError extends Error {
  constructor(
    message: string,
    readonly audience: Exclude<Audience, "public">,
  ) {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * Decodes the session payload held in a cookie.
 *
 * The mock encoding is base64 JSON and is NOT a security boundary — it is
 * readable and forgeable by anyone. That is acceptable only because no real
 * credentials exist yet; it is replaced wholesale by Supabase's signed JWTs
 * before this goes anywhere near production data.
 */
function decode(raw: string | undefined): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export function encodeSession(payload: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export async function readSession(): Promise<Session> {
  const store = await cookies();

  const admin = decode(store.get(SESSION_COOKIES.admin)?.value);
  if (admin && typeof admin.adminId === "string") {
    return {
      audience: "admin",
      adminId: admin.adminId,
      fullName: String(admin.fullName ?? "Administrator"),
      permissions: [...ALL_PERMISSIONS],
    };
  }

  const employee = decode(store.get(SESSION_COOKIES.employee)?.value);
  if (employee && typeof employee.employeeId === "string") {
    const role = (employee.role as EmployeeRole) ?? "support";
    return {
      audience: "employee",
      employeeId: employee.employeeId,
      fullName: String(employee.fullName ?? "Employee"),
      role,
      // Permissions are re-derived from the role server-side rather than trusted
      // from the cookie — otherwise a tampered cookie grants itself rights.
      permissions: [...(ROLE_PERMISSIONS[role] ?? [])],
    };
  }

  const b2b = decode(store.get(SESSION_COOKIES.b2b)?.value);
  if (b2b && typeof b2b.customerId === "string") {
    return {
      audience: "b2b",
      customerId: b2b.customerId,
      phone: String(b2b.phone ?? ""),
      ownerName: String(b2b.ownerName ?? ""),
      businessName: String(b2b.businessName ?? ""),
    };
  }

  return { audience: "public" };
}

// ---------------------------------------------------------------------------
// Guards — call these in every protected server component / action
// ---------------------------------------------------------------------------

export async function requireB2B() {
  const session = await readSession();
  if (session.audience !== "b2b") {
    throw new AuthorizationError("B2B session required", "b2b");
  }
  return session;
}

export async function requireEmployee(permission?: Permission) {
  const session = await readSession();

  // Admin may operate employee screens; the reverse is never true.
  if (session.audience === "admin") return session;

  if (session.audience !== "employee") {
    throw new AuthorizationError("Employee session required", "employee");
  }
  if (permission && !session.permissions.includes(permission)) {
    throw new AuthorizationError(`Missing permission: ${permission}`, "employee");
  }
  return session;
}

export async function requireAdmin() {
  const session = await readSession();
  if (session.audience !== "admin") {
    throw new AuthorizationError("Admin session required", "admin");
  }
  return session;
}
