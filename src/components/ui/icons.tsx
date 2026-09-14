import type { SVGProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Icon set — a single consistent family, drawn on a 24px grid at 1.6 stroke.
 * SVG only: the design brief bans emoji as icons, and emoji would not inherit
 * `currentColor` across the light and dark themes anyway.
 */

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

function Icon({ className, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      {children}
    </svg>
  );
}

export function BoxIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
      <path d="M3.5 7.5 12 12m0 0 8.5-4.5M12 12v9" />
    </Icon>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </Icon>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21s6.5-5.4 6.5-10a6.5 6.5 0 1 0-13 0c0 4.6 6.5 10 6.5 10z" />
      <circle cx="12" cy="11" r="2.4" />
    </Icon>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" />
    </Icon>
  );
}

export function TruckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3 6.5h10.5v10H3zM13.5 10H17l3 3v3.5h-6.5z" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="16.5" cy="17.5" r="1.8" />
    </Icon>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M11.5 3.5H20v8.5l-8.6 8.6a1.6 1.6 0 0 1-2.3 0l-6.2-6.2a1.6 1.6 0 0 1 0-2.3z" />
      <circle cx="16" cy="8" r="1.4" />
    </Icon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </Icon>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10.4 9.2v5.6L15 12z" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.5 3.5h3l1.5 4-2 1.4a11 11 0 0 0 5.1 5.1l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z" />
    </Icon>
  );
}

export function WhatsAppIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24h.01c5.49 0 9.95-4.46 9.95-9.96C22 6.46 17.53 2 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.1.81.83-3.02-.2-.31a8.24 8.24 0 0 1-1.26-4.38c0-4.55 3.7-8.26 8.26-8.26 2.2 0 4.28.86 5.84 2.42a8.2 8.2 0 0 1 2.42 5.84c0 4.56-3.71 8.23-8.29 8.23zm4.52-6.16c-.25-.13-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23a7.4 7.4 0 0 1-1.38-1.71c-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.09-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.55-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.17 1.73 2.64 4.19 3.7.58.26 1.04.41 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29z" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m6 9.5 6 5 6-5" />
    </Icon>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5a13 13 0 0 1 0 17 13 13 0 0 1 0-17z" />
    </Icon>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </Icon>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </Icon>
  );
}

// --- Category glyphs -------------------------------------------------------

export function FoodIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 3.5v7a2.5 2.5 0 0 0 5 0v-7M8.5 13v7.5" />
      <path d="M17 3.5c-1.4 1.2-2 3-2 5s.7 2.8 2 3v8" />
    </Icon>
  );
}

export function DairyIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 3.5h6v2.8l1.8 3v11.2H7.2V9.3L9 6.3z" />
      <path d="M7.2 11.5h9.6" />
    </Icon>
  );
}

export function HouseholdIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m3.5 11 8.5-7 8.5 7" />
      <path d="M5.8 9.4V20h12.4V9.4" />
      <path d="M10 20v-5h4v5" />
    </Icon>
  );
}

export function PersonalCareIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9.5 3.5h5v3h-5zM8 6.5h8v14H8z" />
      <path d="M8 11h8" />
    </Icon>
  );
}

export function GrainsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 21V8.5" />
      <path d="M12 8.5c0-3 1.6-5 4-5 0 3-1.6 5-4 5zM12 13c0-3-1.6-5-4-5 0 3 1.6 5 4 5z" />
    </Icon>
  );
}

export function BeveragesIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 3.5h8l-1 17H9z" />
      <path d="M8.3 9h7.4" />
    </Icon>
  );
}

export function SnacksIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 8.5 8 5h8l3.5 3.5-3.5 3.5v7H8v-7z" />
    </Icon>
  );
}

export function FrozenIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
    </Icon>
  );
}

export function CleaningIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 3.5h6v5H9zM8 8.5h8l1 12H7z" />
    </Icon>
  );
}

export function GridIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.4" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.4" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.4" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.4" />
    </Icon>
  );
}

// --- Service glyphs --------------------------------------------------------

export function StockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 20V9.5h5.3V20M9.3 20V4h5.4v16M14.7 20v-7H20v7z" />
    </Icon>
  );
}

export function PricingIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M14.5 9.2a2.8 2.8 0 0 0-2.5-1.2c-1.5 0-2.4.8-2.4 1.9 0 2.7 5 1.4 5 4.1 0 1.2-1 2-2.6 2a3 3 0 0 1-2.6-1.3M12 6.4v11.2" />
    </Icon>
  );
}

export function SupportIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 13v-1a7.5 7.5 0 0 1 15 0v1" />
      <path d="M4.5 13h2.2v5H5.6A1.1 1.1 0 0 1 4.5 17zM19.5 13h-2.2v5h1.1a1.1 1.1 0 0 0 1.1-1.1z" />
      <path d="M17.3 18v.6a2.4 2.4 0 0 1-2.4 2.4H12" />
    </Icon>
  );
}

export function RangeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 6h16M4 12h16M4 18h10" />
      <circle cx="18.5" cy="18" r="2" />
    </Icon>
  );
}

export function SupplyIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 8.5 12 4l8.5 4.5v7L12 20l-8.5-4.5z" />
      <path d="M7.8 6.2 16.2 11v6" />
    </Icon>
  );
}

// --- Registries ------------------------------------------------------------

export const CATEGORY_ICONS = {
  food: FoodIcon,
  dairy: DairyIcon,
  household: HouseholdIcon,
  "personal-care": PersonalCareIcon,
  grains: GrainsIcon,
  beverages: BeveragesIcon,
  snacks: SnacksIcon,
  frozen: FrozenIcon,
  cleaning: CleaningIcon,
  more: GridIcon,
} as const;

export const WIDGET_ICONS = {
  box: BoxIcon,
  clock: ClockIcon,
  pin: PinIcon,
  star: StarIcon,
  truck: TruckIcon,
  tag: TagIcon,
} as const;

export const SERVICE_ICONS = {
  supply: SupplyIcon,
  stock: StockIcon,
  pricing: PricingIcon,
  delivery: TruckIcon,
  support: SupportIcon,
  range: RangeIcon,
} as const;
