---
name: awesome-claude-design
description: "Catalog of 68 ready-made DESIGN.md design-system inspirations (Vercel, Linear, Stripe, Raycast, Supabase, Claude, and more), plus the DESIGN.md format spec. Use when picking a visual direction for a new project, when the user names a brand or product whose look they want to borrow, or when authoring/consuming a DESIGN.md file as the source of truth for a project's visual language."
---

# Awesome Claude Design — DESIGN.md catalog

A curated index of `DESIGN.md` files: single-file, plain-markdown descriptions of a
brand's visual language, written in a form design agents can act on directly.

## What DESIGN.md is

| File | Who reads it | What it defines |
|------|--------------|-----------------|
| `AGENTS.md` / `CLAUDE.md` | Coding agents | How to build the project |
| `DESIGN.md` | Design agents | How the project should look and feel |

The defining idea: **token, rule, and rationale live in the same file.** A Figma
export gives you *what* to use but drops the *why*. A brand PDF speaks to humans
("approachable yet premium") but is too loose for an agent. `DESIGN.md` sits
between them — specific enough to drive the next decision, and carrying enough
reasoning to stay on-system in cases the file never explicitly covered.

## How to use this skill

1. **Pick a direction.** Read `references/catalog.md` for the full list of 68
   entries, grouped by category (AI platforms, developer tools, backend/DevOps,
   productivity/SaaS, fintech, commerce, media, and more). Each entry has a
   one-line description of its aesthetic — match that to the brief.
2. **Author the DESIGN.md.** The catalog files themselves are hosted at
   `getdesign.md` and are **not** vendored here (see Limitations). So write the
   `DESIGN.md` yourself, using the chosen entry's aesthetic as the brief and the
   structure below as the template.
3. **Use it as the source of truth.** Every subsequent screen, component, and
   token decision in the project should trace back to the `DESIGN.md`.

For generating a DESIGN.md with a strong anti-generic default, prefer the
sibling `stitch-design-taste` skill in this repo — it emits a complete
`DESIGN.md` with calibrated dials (creativity, density, variance, motion).

## DESIGN.md structure

A usable `DESIGN.md` covers, in order:

1. **Configuration dials** — creativity, density, variance, motion intent (1–10 each),
   so the same file can be retuned without a rewrite.
2. **Visual theme & atmosphere** — the mood in prose. What the interface should
   feel like, and what it must never feel like.
3. **Color palette & roles** — every color with a hex value *and* the role it
   plays (canvas, surface, accent, semantic states). Name the banned patterns too.
4. **Typography** — families, the type scale, weights, tracking, and the rules
   for pairing them.
5. **Spacing & layout** — the base unit, the scale, grid behavior, and how much
   asymmetry is allowed.
6. **Components** — buttons, cards, inputs, nav: states, elevation, radii, borders.
7. **Motion** — durations, easing curves, what animates and what stays still,
   plus the reduced-motion contract.
8. **Anti-patterns** — the explicit "never do this" list. This section is what
   keeps an agent on-system once it wanders past the cases you spelled out.

## Applying a DESIGN.md

- Treat it as **binding**, not advisory. If a request conflicts with it, say so
  rather than silently drifting.
- Resolve gaps by **reasoning from the rationale** in the file, not by falling
  back to generic defaults.
- Keep it **updated** when a real design decision is made that the file doesn't
  yet cover — otherwise it rots and stops being the source of truth.

## Limitations

The upstream repository (`VoltAgent/awesome-claude-design`) is an **index**, not
a bundle: the 68 `DESIGN.md` files live on `getdesign.md`, which this
environment's egress policy blocks. Only the catalog itself is vendored here, in
`references/catalog.md`. To get an original file verbatim, download it from the
`getdesign.md` link in the catalog on an unrestricted network and drop it into
the project root as `DESIGN.md`.

## Source

- Catalog: [VoltAgent/awesome-claude-design](https://github.com/VoltAgent/awesome-claude-design) (MIT)
- Format origin: Google Stitch, expanded by [getdesign.md](https://getdesign.md)
