# Kogay Karwan — Wholesale Platform

Wholesale trade and B2B ordering platform for **Kogay Karwan**, Erbil, Kurdistan Region, Iraq.

Four connected experiences, each with its own authentication:

| Route | Audience | Status |
|---|---|---|
| `/` | Public website | **Built** |
| `/b2b` | Approved wholesale customers | Login built, portal scaffolded |
| `/employee` | Staff (cashier, sales, warehouse, delivery, support, manager) | Login built, portal scaffolded |
| `/admin` | Business administration | Login built, portal scaffolded |

---

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build
npm run typecheck  # tsc --noEmit
```

Requires Node 20+.

---

## ⚠️ Add your real artwork first

The product, brand and logo images are **not** in this repository. Every path is
declared in one file — `src/lib/assets.ts` — and nothing else hard-codes an
image path. Drop the files at these paths and they resolve everywhere:

```
public/assets/products/
  pepsi-can.png
  coca-cola-can.png
  mahmood-rice.png
  zer-tomato-paste.png
  altunsa-sunflower-oil.png
  ulker-metro.png
  almarai-barista-milk.png

public/assets/brands/
  pepsi.svg   coca-cola.svg   ulker.svg    altunsa.svg
  almarai.svg mahmood-rice.svg zer.svg     metro.svg

public/assets/logo/
  kogay-karwan-lockup.svg        # gold monogram + navy wordmark (light surfaces)
  kogay-karwan-lockup-light.svg  # same, reversed out (dark surfaces / footer)
  kogay-karwan-emblem.png        # 3D gold KK + globe, hero backdrop
  kogay-karwan-mark.svg          # square mark (favicon, compact contexts)
```

**Product cut-outs:** transparent PNG or WebP, upright, ~1200 px tall, packaging
centred. Everything renders with `object-fit: contain`, so a mismatched ratio
letterboxes — packaging is never stretched or cropped.

Until a file is present, a labelled *"asset pending"* placeholder renders in the
exact same box. Layout never shifts when the real file lands, and no invented
substitute logo is ever shown.

---

## Architecture

```
src/
  app/
    (public)/          public website — own layout, smooth scroll, marketing nav
    b2b/               B2B portal + its own login
    employee/          employee portal + its own login
    admin/             admin portal + its own login
  components/
    brand/             logo lockups
    site/              public site sections (hero, brands, categories, …)
    portal/            portal chrome, auth shell, login form
    ui/                design-system primitives
  lib/
    domain/types.ts    the whole domain model
    data/              repository contracts + adapters + seed
    auth/              sessions, RBAC guards, server actions
    assets.ts          ← the asset manifest
    motion.ts          motion contract
  middleware.ts        portal route guard (redirect only — see Security)
```

### The Supabase seam

Pages and components depend on the **interfaces** in
`src/lib/data/repositories.ts`, never on an adapter. Connecting Supabase is:

1. Add `src/lib/data/supabase/*-repository.ts`, each implementing the matching
   interface.
2. Return them from `getDataContext()` in `src/lib/data/index.ts` when
   `hasSupabaseConfig()` is true.
3. Done. No page, component or hook changes.

`src/lib/data/index.ts` is marked `server-only`, so a stray client import is a
build error rather than a silent leak of wholesale pricing to the browser.

No credentials are committed. Configure via environment:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_DEMO_AUTH=false     # disables the demo logins
```

---

## Security

**`middleware.ts` is not the security boundary.** It runs on the edge without
database access, so it can only check whether a session cookie *exists* — enough
to redirect a signed-out visitor to the right login, and nothing more.

Real authorisation happens server-side in every protected page and action via
`requireB2B()` / `requireEmployee(permission?)` / `requireAdmin()` from
`src/lib/auth/session.ts`. Once Supabase is connected, RLS enforces the same
rules at the database so the app layer is not the only gate.

Three separate, non-interchangeable session cookies — an employee session grants
nothing on `/admin`. Employee permissions are re-derived from the role
server-side rather than trusted from the cookie.

### Public pricing policy

Wholesale prices are enforced by the **type system**, not by hidden UI:
`toPublicProduct()` strips `wholesalePrice`, `discount` and exact stock, and
public components accept `PublicProduct`. A public component cannot render a
wholesale price because it is never handed one.

### Demo authentication

`src/lib/auth/actions.ts` ships fixed demo identities so the portals are
reviewable before Supabase exists. No hashing, no rate limiting, no account
lookup — it is replaced wholesale by Supabase Auth. Set
`NEXT_PUBLIC_DEMO_AUTH=false` to disable it.

| Portal | Username | Password |
|---|---|---|
| B2B | any valid phone number | `demo1234` |
| Employee | `cashier` `sales` `warehouse` `delivery` `support` `manager` | `demo1234` |
| Admin | `admin` | `demo1234` |

---

## Design system

Tokens live in `src/app/globals.css`. Components consume **semantic** tokens
(`bg-surface`, `text-ink`, `text-accent`) and never a raw palette step or hex —
which is what makes the dark theme a real theme instead of an inversion.

- **Gold** `--accent` — the dominant brand accent
- **Navy** — typography and deep surfaces
- **Cream/white** — surfaces
- **Green** — supporting accent only

### Theme is an admin setting, not a visitor preference

`data-theme` is stamped on `<html>` **server-side** from the settings
repository. There is no visitor toggle: appearance is a business-wide decision
owned by Admin, per the brief. Server rendering also means no flash of the
wrong theme.

### Motion

GSAP + ScrollTrigger + Lenis. `prefers-reduced-motion` is checked **before** a
timeline is built, not after — reduced-motion visitors never have animation
constructed and then skipped, and Lenis is never instantiated (native scrolling
is correct, and hijacking it is what that preference asks us not to do).

Only `transform` and `opacity` are animated.

---

## Money

Money is an **integer count of minor units**, never a float
(`{ amount: 960, currency: "USD" }` = $9.60). Wholesale totals multiply quantity
by price thousands of times over; binary floats drift and the invoice stops
reconciling with the cash drawer. Discounts are **monetary amounts**, not
percentages, per the brief.

---

## Not built yet

The public website is complete. These are scaffolded — routed, authenticated,
permission-checked, and modelled in `src/lib/domain/types.ts`, but the screens
are not written:

- B2B catalog, cart, order submission, order history
- Cashier terminal, employee order queue, Admin Updates feed
- Admin CRUD, bulk Excel/CSV import, inventory, discounts, customer approval,
  employee management, CMS, analytics, audit log
- Product/category/brand/gallery public detail pages
- i18n routing and RTL (locales, `Localized` content and the switcher exist;
  routing does not)
- Loading screen, print templates

Demo catalog is 500 products (7 real + 493 labelled demo rows) to exercise
pagination, search and filtering at realistic scale.
