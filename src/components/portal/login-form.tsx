"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Field, Input, Notice } from "@/components/ui/field";
import { PhoneIcon, UserIcon } from "@/components/ui/icons";
import type { AuthState } from "@/lib/auth/actions";

/**
 * Shared login form for all three portals.
 *
 * Errors come back from the server action — the form never decides on its own
 * that a credential is wrong, because the client has no way to know.
 */

type LoginAction = (state: AuthState, formData: FormData) => Promise<AuthState>;

export function LoginForm({
  action,
  mode,
  next,
  demoHint,
}: {
  action: LoginAction;
  /** `phone` for B2B customers, `username` for staff. */
  mode: "phone" | "username";
  next?: string;
  demoHint?: string;
}) {
  const [state, formAction] = useActionState<AuthState, FormData>(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      {state.error ? <Notice tone="error">{state.error}</Notice> : null}

      {mode === "phone" ? (
        <Field
          id="phone"
          label="Phone number"
          hint="The number your account was verified on."
        >
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            required
            placeholder="0750 000 0000"
            leading={<PhoneIcon className="size-4" />}
            invalid={Boolean(state.error)}
          />
        </Field>
      ) : (
        <Field id="identifier" label="Username">
          <Input
            id="identifier"
            name="identifier"
            type="text"
            autoComplete="username"
            required
            placeholder="your.username"
            leading={<UserIcon className="size-4" />}
            invalid={Boolean(state.error)}
          />
        </Field>
      )}

      <Field id="password" label="Password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          invalid={Boolean(state.error)}
        />
      </Field>

      <SubmitButton />

      {demoHint ? <Notice tone="warning">{demoHint}</Notice> : null}
    </form>
  );
}

/**
 * Must be its own component: `useFormStatus` reads the status of the nearest
 * parent <form>, so it cannot be called from the component that renders it.
 */
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending} className="mt-1 w-full">
      {pending ? "Signing in…" : "Sign in"}
    </Button>
  );
}
