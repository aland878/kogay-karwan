"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  LOGIN_ROUTES,
  SESSION_COOKIES,
  SESSION_COOKIE_OPTIONS,
  encodeSession,
} from "@/lib/auth/session";
import type { EmployeeRole } from "@/lib/domain/types";

/**
 * AUTH SERVER ACTIONS
 *
 * ┌─ DEMO AUTHENTICATION ────────────────────────────────────────────────────┐
 * │ These actions accept a fixed set of demo identities so the portals can be │
 * │ reviewed before Supabase is connected. There is no password hashing, no   │
 * │ rate limiting and no account lookup, because there are no real accounts   │
 * │ yet. No production credential is committed anywhere in this repository.   │
 * │                                                                          │
 * │ Replacing this with Supabase Auth means swapping the body of each action  │
 * │ for `signInWithPassword` plus a profile read. The signatures, the cookie  │
 * │ names and every call site stay exactly as they are.                       │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_AUTH !== "false";

/** Only ever used while DEMO_MODE is on. Not a credential store. */
const DEMO_PASSWORD = "demo1234";

export type AuthState = { error?: string };

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/**
 * Iraqi mobile numbers are entered in several shapes (0750…, +964750…,
 * 964750…). Normalising on the way in means the same customer cannot end up
 * with two accounts because they typed the number differently.
 */
const phoneSchema = z
  .string()
  .trim()
  .min(7, "Enter your phone number")
  .transform((value) => value.replace(/[\s\-()]/g, ""))
  .refine((value) => /^\+?\d{7,15}$/.test(value), "Enter a valid phone number");

const b2bLoginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, "Enter your password"),
});

const staffLoginSchema = z.object({
  identifier: z.string().trim().min(1, "Enter your username"),
  password: z.string().min(1, "Enter your password"),
});

function safeNext(value: FormDataEntryValue | null, fallback: string): string {
  const next = typeof value === "string" ? value : "";
  // Only same-origin absolute paths. An open redirect here would let a phishing
  // link bounce a signed-in employee straight off the platform.
  return next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

// ---------------------------------------------------------------------------
// B2B
// ---------------------------------------------------------------------------

export async function b2bLogin(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = b2bLoginSchema.safeParse({
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details" };
  }

  if (!DEMO_MODE) {
    return { error: "Authentication is not configured yet." };
  }
  if (parsed.data.password !== DEMO_PASSWORD) {
    // Deliberately vague: naming which half was wrong tells an attacker whether
    // a phone number is a registered customer.
    return { error: "Phone number or password is incorrect." };
  }

  const store = await cookies();
  store.set(
    SESSION_COOKIES.b2b,
    encodeSession({
      customerId: "cust-demo-1",
      phone: parsed.data.phone,
      ownerName: "Demo Customer",
      businessName: "Demo Market",
    }),
    SESSION_COOKIE_OPTIONS,
  );

  redirect(safeNext(formData.get("next"), "/b2b"));
}

// ---------------------------------------------------------------------------
// Employee
// ---------------------------------------------------------------------------

const DEMO_EMPLOYEES: Record<string, { name: string; role: EmployeeRole }> = {
  cashier: { name: "Demo Cashier", role: "cashier" },
  sales: { name: "Demo Sales", role: "sales" },
  warehouse: { name: "Demo Warehouse", role: "warehouse" },
  delivery: { name: "Demo Delivery", role: "delivery" },
  support: { name: "Demo Support", role: "support" },
  manager: { name: "Demo Manager", role: "manager" },
};

export async function employeeLogin(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = staffLoginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details" };
  }
  if (!DEMO_MODE) {
    return { error: "Authentication is not configured yet." };
  }

  const employee = DEMO_EMPLOYEES[parsed.data.identifier.toLowerCase()];
  if (!employee || parsed.data.password !== DEMO_PASSWORD) {
    return { error: "Username or password is incorrect." };
  }

  const store = await cookies();
  store.set(
    SESSION_COOKIES.employee,
    encodeSession({
      employeeId: `emp-${parsed.data.identifier}`,
      fullName: employee.name,
      role: employee.role,
    }),
    SESSION_COOKIE_OPTIONS,
  );

  redirect(safeNext(formData.get("next"), "/employee"));
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export async function adminLogin(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = staffLoginSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details" };
  }
  if (!DEMO_MODE) {
    return { error: "Authentication is not configured yet." };
  }
  if (parsed.data.identifier.toLowerCase() !== "admin" || parsed.data.password !== DEMO_PASSWORD) {
    return { error: "Username or password is incorrect." };
  }

  const store = await cookies();
  store.set(
    SESSION_COOKIES.admin,
    encodeSession({ adminId: "adm-1", fullName: "Administrator" }),
    SESSION_COOKIE_OPTIONS,
  );

  redirect(safeNext(formData.get("next"), "/admin"));
}

// ---------------------------------------------------------------------------
// Sign out
// ---------------------------------------------------------------------------

export async function signOut(audience: "b2b" | "employee" | "admin") {
  const store = await cookies();
  store.delete(SESSION_COOKIES[audience]);
  redirect(LOGIN_ROUTES[audience]);
}
