import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Form field primitives.
 *
 * The label is always a real, visible <label> bound by id — never a placeholder
 * standing in for one. Placeholder-as-label disappears the moment someone types
 * and is unreadable to screen readers, which is exactly when a wholesale buyer
 * entering a phone number can least afford the ambiguity.
 */

export function Field({
  id,
  label,
  hint,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>

      {children}

      {hint && !error ? (
        <p id={hintId} className="text-xs text-ink-subtle">
          {hint}
        </p>
      ) : null}

      {error ? (
        // Errors sit beside the field they belong to, not collected at the top.
        <p id={errorId} role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type InputProps = ComponentPropsWithoutRef<"input"> & {
  invalid?: boolean;
  leading?: ReactNode;
};

export function Input({ className, invalid, leading, ...props }: InputProps) {
  return (
    <div className="relative">
      {leading ? (
        <span className="pointer-events-none absolute inset-y-0 start-0 grid w-11 place-items-center text-ink-subtle">
          {leading}
        </span>
      ) : null}

      <input
        aria-invalid={invalid || undefined}
        className={cn(
          "h-12 w-full rounded-xl border bg-surface px-4 text-[0.9375rem] text-ink",
          "transition-[border-color,box-shadow] duration-[var(--duration-quick)]",
          "placeholder:text-ink-subtle/70",
          "focus:outline-none focus:ring-4 focus:ring-accent/15",
          invalid
            ? "border-red-500 focus:border-red-500"
            : "border-line focus:border-accent",
          leading && "ps-11",
          className,
        )}
        {...props}
      />
    </div>
  );
}

/** Non-blocking notice used for demo-credential hints and status messages. */
export function Notice({
  tone = "info",
  children,
  className,
}: {
  tone?: "info" | "warning" | "error";
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : undefined}
      className={cn(
        "rounded-xl border px-4 py-3 text-sm leading-relaxed",
        tone === "info" && "border-line bg-surface-muted text-ink-muted",
        tone === "warning" &&
          "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300",
        tone === "error" &&
          "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
        className,
      )}
    >
      {children}
    </div>
  );
}
