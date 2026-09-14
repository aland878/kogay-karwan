# Design skills

Vendored Claude Code skills covering visual design, UX, motion, and design-system
authoring. All sources are MIT licensed; upstream copyright notices are retained
in each skill directory where the upstream repo shipped one.

Claude picks these up automatically — no configuration needed. To invoke one
explicitly, name it (e.g. "use design-motion-principles to audit these transitions").

## Installed

| Skill | What it does | Upstream |
|-------|--------------|----------|
| `design-taste-frontend` | Anti-slop frontend skill for landing pages, portfolios, and redesigns. Reads the brief, infers a design direction, tunes three dials (variance / motion / density), and ships interfaces that don't look templated. Audit-first on redesigns, strict pre-flight check. | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `design-motion-principles` | Motion and interaction design expert based on Emil Kowalski, Jakub Krehel, and Jhey Tompkins. Two modes: **create** (build components with purposeful motion) and **audit** (review existing animation, emit an HTML report with looping demos). | [kylezantos/design-motion-principles](https://github.com/kylezantos/design-motion-principles) |
| `stitch-design-taste` | Generates `DESIGN.md` files — the single source of truth for a project's visual language. Strict typography, calibrated color, asymmetric layout, micro-motion, GPU-friendly performance. Ships a reference `DESIGN.md`. | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) |
| `awesome-claude-design` | Catalog of 68 `DESIGN.md` design-system inspirations (Vercel, Linear, Raycast, Supabase, Stripe, Claude, …) plus the `DESIGN.md` format spec. Use it to pick a visual direction before authoring one. | [VoltAgent/awesome-claude-design](https://github.com/VoltAgent/awesome-claude-design) |

## Not installed

**`ui-ux-pro-max`** ([nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill))
— a searchable local database of 79 UI styles, 192 product palettes, 74 font
pairings, 119 UX guidelines, 105 icons, 17 GSAP presets, 25 chart types, and 22
technology stacks, queried through a bundled Python script.

It was fetched and reviewed but **not** committed: this session's sandbox blocks
writing third-party executable code (`scripts/*.py`) into the repo. The rest of
the skill is CSV data and markdown. To install it yourself:

```bash
git clone --depth 1 https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git /tmp/uipro
cp -r /tmp/uipro/.claude/skills/ui-ux-pro-max .claude/skills/ui-ux-pro-max
rm -rf .claude/skills/ui-ux-pro-max/scripts/tests
```

Then fix the script path in `SKILL.md`, which is written for a plugin install:

```bash
sed -i 's|${CLAUDE_PLUGIN_ROOT}/|${CLAUDE_PROJECT_DIR}/|g' \
  .claude/skills/ui-ux-pro-max/SKILL.md
```

Requires Python 3 (no third-party packages). Verify with:

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "keyboard focus modal" --domain ux
```

Alternatively install it globally via the upstream CLI, which sidesteps
vendoring entirely:

```bash
npm install -g ui-ux-pro-max-cli && uipro init --ai claude
```

## Also available upstream

`Leonxlnx/taste-skill` ships sibling skills not vendored here: `brutalist-skill`,
`minimalist-skill`, `soft-skill`, `redesign-skill`, `brandkit`, `output-skill`,
`image-to-code-skill`, `imagegen-frontend-web`, `imagegen-frontend-mobile`, and
`gpt-tasteskill` (a stricter variant tuned for GPT/Codex). Copy any of them from
`skills/<name>/` in that repo into this directory.

## Note on egress

`getdesign.md` (host of the 68 `DESIGN.md` files) and direct `github.com` HTTP
are blocked by this environment's egress policy. `git clone` over HTTPS and the
npm registry both work.
