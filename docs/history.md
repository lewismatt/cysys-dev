# History and decisions

What was built in this repo and why, in order. Newest decisions win; earlier ones are kept for
context so nobody re-litigates them by accident.

## 1. Bootstrap

- Scaffolded with the official shadcn CLI: `shadcn init --monorepo -t vite -b radix -p nova`
  (pnpm workspaces + Turborepo, Vite, React 19, Tailwind v4, `radix-nova` style), renamed
  `@workspace/ui` → `@cysys/ui` so other Cynerdyne repos can depend on it by name.
- Added `@cysys/themes`: themes are kept as shadcn `registry:style` JSON and compiled to CSS scoped
  by `[data-theme]`, so several themes can coexist and be switched at runtime or per subtree.
  Chosen over `shadcn add <theme-url>`, which writes a single unscoped theme into `globals.css`.
- `globals.css` keeps the neutral shadcn palette on `:root` as a baseline, with extra mappings
  (fonts, shadows, tracking) needed by tweakcn-style themes.
- Generator fix found during review: Fontsource variable packages register `"<Family> Variable"`,
  so a theme saying `'Inter'` silently fell back unless Inter was installed locally. The
  generator now prepends the registered name.

## 2. Evaluating tweakcn themes (Eldo, Eldo 2), since removed

- Imported two tweakcn themes and built `pnpm themes:audit`, a WCAG check of the token pairs the
  Nova components actually render, calibrated against shadcn's own defaults.
- Findings that shaped later decisions:
  - Nova renders focused menu/select items as `bg-accent text-accent-foreground`; both themes set
    accent-foreground = accent (orange on orange), so hovered menu text vanished.
  - White text on `#e65400`-ish orange is ~3.3:1 (fails AA). Dark text on it passes.
  - Dark-mode destructive colors were ~1.9:1.
- Both Eldo themes were removed once Eldora Night was chosen (11–14 audit errors each, superseded).

## 3. Eldora Night

- Chosen direction: the **Eldora Night** palette from the Eldora snowmaking dashboard
  (`lewismatt/eldora-snowmaking-dashboard`, `docs/product/DESIGN.md`). The dashboard was run
  locally on fixture data as the visual reference.
- Brand orange `#E65400` confirmed by sampling the logo PNG's dominant color.
- Carried over: status vocabulary and colors (Prime ≤ 20°F, Good ≤ 24°F, Marginal ≤ 28°F, Not
  qualifying; wind; stale) as tokens; dark text on orange; "color repeats a word, never replaces
  one"; "orange is the brand, never Marginal"; tabular figures.
- shadcn-specific polish: `accent` is a neutral hover (fixes the menu bug); status tokens get
  `on-*` pairs and Tailwind utilities; `link` token (light mode `#bd4500` because the logo orange is
  3.6:1 as text on white); themeable `font-heading`.
- Made installable elsewhere: the generator writes a shadcn registry index;
  `pnpm registry:build` publishes `apps/web/public/r/eldora-night.json`. Verified by installing into
  a fresh `shadcn init` project.

## 4. Refinement passes (user feedback)

| Request | Change |
| --- | --- |
| Use the shadcn examples' styles, cards, minimal typography | Overview page modeled on shadcn example dashboards: stat row, chart card, data table, settings, forms |
| Cleaner, easier to read | Removed footer strips on stat cards, neutral comparison bars, dot + word status in tables, line chart without gradient, 12px minimum |
| Bright bubbles don't fit; professional, less noise | Softened all status colors (still AA); rating pills and band chips became `Status` (dot + word); slim hour bars where "Not qualifying" is neutral grey |
| More terminal-like type, not overdone | Mono for headings, labels, figures, metadata, tables, chart axes, nav; sans for reading text |
| Darker, fewer browns | Dark mode moved from brown-black/cream/tan to near-black `#0a0a09`, off-white `#ecebe8`, grey `#9a9993`; orange removed from progress bars, sparklines and secondary buttons |
| Light mode to match; sans didn't vibe with the mono | Light mode neutral (`#fafaf9`, `#111110`, `#5c5b56`); fonts switched from Geist/Geist Mono to IBM Plex Sans/Plex Mono (one superfamily) |
| Remove Eldo themes, document everything | Eldo themes removed; `Status` promoted into `@cysys/ui`; README, AGENTS.md, this `docs/` folder |

## 5. License

- Owner direction (2026-11-19): if every component is open source, license the project as
  permissively as possible.
- Verified the full dependency tree in `pnpm-lock.yaml` (562 packages) against the npm
  registry: every package carries a recognized open-source license — MIT (470), ISC (30),
  Apache-2.0 (20), BSD-2/3-Clause (18), BlueOak-1.0.0 (5), 0BSD (1), and two MIT-combination
  entries, plus MPL-2.0 for lightningcss only (build-time CSS tooling), OFL-1.1 for the three
  Fontsource font packages, and CC-BY-4.0 for caniuse-lite data. No proprietary,
  restricted-source, or unlicensed packages.
- Project-owned code is therefore licensed under the **MIT License** — owner's final call
  (2026-11-19), superseding a BSD-0-Clause (0BSD) draft from earlier the same day: MIT is
  permissive (use, copy, modify, merge, publish, distribute, sublicense, sell) with a single
  condition — keep the copyright and permission notices in copies — and it is the license
  readers, tooling, and other projects recognize on sight.
- Upstream components keep their own licenses and notices; MIT covers only code owned by
  this project. The OFL-1.1 font packages in particular remain OFL-1.1.

## 6. Deployment (decided 2026-11-19)

- **Host: Vercel.** The playground is the Vercel project `cysys-dev`, linked to this
  repo (production branch `main`, root `vercel.json`: pnpm frozen install, `pnpm build`,
  output `apps/web/dist`). First deployment 2026-11-19 from main `5cb2733f`.
- **Domain: cysys.dev.** The apex and `www` moved from the GCP server to Vercel with
  two Namecheap record changes (apex A to Vercel anycast; `www` CNAME to Vercel,
  redirecting 308 to the apex). All subdomains (vault, versus, traffic, snow) and the
  Namecheap email-forwarding MX records were deliberately left untouched — the GCP
  server keeps everything it hosts today.
- Live URLs: playground https://cysys.dev, registry item
  https://cysys.dev/r/eldora-night.json (also on the `cysys-dev.vercel.app` alias).

## Open items

- ~~**Registry hosting:** decide where the playground is deployed so other projects can
  `shadcn add https://<host>/r/eldora-night.json` instead of a local path.~~
  Resolved 2026-11-19 — see §6: https://cysys.dev/r/eldora-night.json.
- **Fonts in consumers:** the shadcn CLI installs but doesn't import the Plex packages; consumers
  add three `@import` lines (see `using-eldora-night.md`).
- **Bundle size:** recharts makes the playground chunk > 500 kB (Vite warning). Fine for a
  playground; code-split if this becomes a product app.
- **Info-level audit items:** 50%-opacity focus ring and input borders are below 3:1, same as
  shadcn's defaults; focused controls also get a solid ring-colored border.
