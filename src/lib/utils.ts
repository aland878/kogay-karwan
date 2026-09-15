import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { CURRENCY, type Money } from "@/lib/domain/types";

/** Tailwind-aware class merge. Later classes win over conflicting earlier ones. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats money from its minor-unit representation.
 * IQD has no minor unit, so it renders with no decimal places.
 */
export function formatMoney(value: Money, locale = "en-US"): string {
  const config = CURRENCY[value.currency];
  const major = value.amount / config.minor;
  const fractionDigits = config.minor === 1 ? 0 : 2;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: config.code,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(major);
}

export function formatNumber(value: number, locale = "en-US"): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatDate(value: string, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateTime(value: string, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

/**
 * Builds a `tel:` / `wa.me` safe phone string.
 * WhatsApp rejects spaces, dashes and a leading `+`.
 */
export function toWhatsAppNumber(phone: string): string {
  return phone.replace(/[^\d]/g, "");
}

export function toTelHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function toWhatsAppHref(phone: string, message?: string): string {
  const base = `https://wa.me/${toWhatsAppNumber(phone)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** "1 product" / "24 products" — avoids the "1 products" tell. */
export function pluralize(count: number, singular: string, plural?: string): string {
  const word = count === 1 ? singular : (plural ?? `${singular}s`);
  return `${formatNumber(count)} ${word}`;
}
