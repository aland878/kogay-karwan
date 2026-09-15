"use client";

import { useState, useTransition } from "react";

import { ChevronDownIcon, GlobeIcon } from "@/components/ui/icons";
import type { Locale } from "@/lib/domain/types";
import { setLocale } from "@/lib/i18n/actions";
import { cn } from "@/lib/utils";

/**
 * Language switcher.
 *
 * Calls a server action so `lang`, `dir` and every translated string are
 * re-rendered together. Kurdish and Arabic are right-to-left; English is not,
 * so this control changes page direction, not just wording.
 */

const OPTIONS: { value: Locale; short: string; label: string }[] = [
  { value: "ku", short: "KU", label: "کوردی" },
  { value: "ar", short: "AR", label: "العربية" },
  { value: "en", short: "EN", label: "English" },
];

export function LocaleSwitcher({ current }: { current: Locale }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const active = OPTIONS.find((option) => option.value === current) ?? OPTIONS[0];

  const choose = (locale: Locale) => {
    setOpen(false);
    if (locale === current) return;
    startTransition(() => {
      void setLocale(locale);
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Change language"
        disabled={isPending}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2",
          "text-sm font-semibold text-ink-muted transition-colors",
          "hover:border-line-strong hover:text-ink disabled:opacity-60",
        )}
      >
        <GlobeIcon className="size-4" />
        <span className="hidden sm:inline">{active.short}</span>
        <ChevronDownIcon
          className={cn(
            "size-3.5 transition-transform duration-[var(--duration-quick)]",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <>
          {/* Click-away layer. Sits below the menu, above everything else. */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />

          <ul
            role="listbox"
            aria-label="Language"
            className={cn(
              "absolute end-0 top-full z-20 mt-2 min-w-36 overflow-hidden rounded-xl",
              "border border-line bg-surface p-1 shadow-lift",
            )}
          >
            {OPTIONS.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === current}
                  onClick={() => choose(option.value)}
                  className={cn(
                    "w-full rounded-lg px-3 py-2 text-start text-sm font-medium transition-colors",
                    option.value === current
                      ? "bg-accent-soft text-accent-strong"
                      : "text-ink-muted hover:bg-surface-muted hover:text-ink",
                  )}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
