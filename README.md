# cysys-dev

Cynerdyne Systems design system: [shadcn/ui](https://ui.shadcn.com) components plus a set of
brand themes (from [tweakcn](https://tweakcn.com)) that can be switched at runtime.

```
apps/
  web/              Vite playground: every component × every theme, light/dark
packages/
  ui/               @cysys/ui      shadcn components, globals.css, ThemeProvider
  themes/           @cysys/themes  tweakcn themes compiled to data-theme scoped CSS
```

pnpm workspaces + Turborepo · React 19 · Tailwind CSS v4 · shadcn `radix-nova` style.

## Themes at a glance

| Theme | Source | Notes |
| --- | --- | --- |
| **Eldora Night** (default) | hand-authored, `registry/eldora-night.json` | The Eldora snowmaking dashboard's Eldora Night palette as a shadcn theme: logo orange `#E65400`, warm near-black surfaces, cream text, Geist type, and the dashboard's status colors as tokens. Dark = Eldora Night, light = warm daylight companion. Audit: no errors. |
| Eldo | tweakcn | Audit flags menu-hover and contrast issues (see `pnpm themes:audit`). |
| Eldo 2 | tweakcn | Same as Eldo. |

The playground's **Overview** page (`#/overview`) is an example dashboard in the style of the
shadcn/ui examples, built with Eldora snowmaking demo data. **Components** (`#/components`) is the
kitchen sink: every component, the theme's tokens, typography, and all themes side by side.

## Eldora Night

**Status tokens.** Besides the standard shadcn tokens, Eldora Night defines the dashboard's
status colors. They work as Tailwind utilities anywhere in `@cysys/ui`:

| Token | Utility | Meaning |
| --- | --- | --- |
| `--prime` / `--on-prime` | `bg-prime text-on-prime` | Wet-bulb ≤ 20°F |
| `--good` / `--on-good` | `bg-good text-on-good` | ≤ 24°F |
| `--marginal` / `--on-marginal` | `bg-marginal text-on-marginal` | ≤ 28°F |
| `--no-window` / `--on-no-window` | `bg-no-window text-on-no-window` | Not qualifying |
| `--wind`, `--stale` | `text-wind`, `text-stale` | Wind flags, stale data |
| `--link` | `text-link` | Link text. Light mode uses `#bd4500` (≥ 4.5:1 on every light surface); dark uses the logo orange. Other themes fall back to `--primary`. |

As on the dashboard, color repeats a word and never replaces one: always print the label.
Orange is the brand and never a status. Other themes get neutral fallbacks for these tokens.

**Using it in another shadcn project** (no monorepo needed):

```bash
pnpm registry:build    # writes apps/web/public/r/<theme>.json (served by the playground)
pnpm dlx shadcn@latest add https://<playground-host>/r/eldora-night.json
# or straight from a checkout:
pnpm dlx shadcn@latest add /path/to/cysys-dev/apps/web/public/r/eldora-night.json
```

The CLI writes the tokens into your CSS file and installs the Geist font packages. It doesn't
import Geist Mono, so add `@import "@fontsource-variable/geist-mono";` to that CSS file. (Geist Sans
is already imported by shadcn's default preset.)

## Getting started

```bash
pnpm install
pnpm dev          # playground at http://localhost:5173 (press "d" to toggle dark mode)
pnpm build        # typecheck + build everything
pnpm lint
pnpm themes:check # fail if generated theme files are out of date (use in CI)
```

## Themes

Themes live in `packages/themes`:

| Path | What |
| --- | --- |
| `themes.json` | Manifest: name, title, source URL, resolved font packages, default theme |
| `registry/<name>.json` | Vendored shadcn registry item, exactly as tweakcn serves it |
| `css/<name>.css` | **Generated.** Tokens scoped to `[data-theme="<name>"]` (+ `.dark`) |
| `css/all.css` | **Generated.** Imports every theme |
| `src/index.ts` | **Generated.** Typed metadata (`themes`, `ThemeName`, `defaultTheme`, swatches…) |

### Adding a theme

Use the same URL you'd give `shadcn add`:

```bash
pnpm themes:add https://tweakcn.com/r/themes/<id> --title "Nice Name"
# several at once (names come from each item's "name"):
pnpm themes:add https://tweakcn.com/r/themes/<id1> https://tweakcn.com/r/themes/<id2>
```

This downloads the registry item, resolves any web fonts to
[Fontsource](https://fontsource.org) packages (system fonts like Georgia are skipped), regenerates
the CSS and TS metadata, and runs `pnpm install` if new font packages were added. Commit the results.

> Don't run `shadcn add <tweakcn-url>` directly in this repo. It would overwrite the neutral
> baseline in `globals.css` with a single, unscoped theme.

Other commands:

```bash
pnpm themes list                 # * marks the default
pnpm themes:sync [name…]         # re-fetch from tweakcn after editing a theme there
pnpm themes default <name>       # theme used when no data-theme is set
pnpm themes remove <name>
pnpm themes:build                # regenerate after hand-editing registry/*.json
pnpm themes:audit [name…]        # contrast + structure checks (add --strict to exit 1 on errors)
pnpm registry:build              # publish themes as shadcn registry items in apps/web/public/r
```

### Auditing a theme

`pnpm themes:audit` checks WCAG contrast for the token pairs our components actually render
(e.g. focused menu items are `bg-accent` + `text-accent-foreground`, destructive buttons are
`text-destructive` on `bg-destructive/10`), plus missing tokens, chart colors that are too faint or
too similar, and out-of-gamut values. `✖` = text below 4.5:1 or invisible, `▲` = worth a look,
`·` = informational. shadcn's own neutral defaults trigger the `·` items for focus rings and input
borders too.

### How theming works

- `@cysys/ui/globals.css` maps tokens to Tailwind utilities with `@theme inline`
  (`bg-primary`, `font-sans`, `shadow-lg`, `tracking-tight`, `rounded-lg`, …) and defines the neutral
  shadcn values on `:root` as a baseline.
- Each theme stylesheet sets the same CSS variables under `[data-theme="<name>"]`. Its selectors
  out-rank the baseline, so stylesheet order doesn't matter.
- Dark mode is the standard shadcn `.dark` class.
- The default theme also matches `:root:not([data-theme])`, so pages work before JS runs.
- `data-theme` works on **any element**, so you can scope a theme to a subtree:

  ```html
  <section data-theme="eldo-1">…</section>
  ```

## Using it in an app

```tsx
import "@cysys/ui/globals.css"
import "@cysys/themes/all.css" // or a single theme: "@cysys/themes/eldo-1.css"

import { defaultTheme, themeNames } from "@cysys/themes"
import { ThemeProvider, useTheme } from "@cysys/ui/providers/theme-provider"
import { Button } from "@cysys/ui/components/button"

<ThemeProvider themes={themeNames} defaultTheme={defaultTheme}>
  <App />
</ThemeProvider>

const { theme, setTheme, mode, setMode, resolvedMode } = useTheme()
// theme: brand theme (data-theme) · mode: "light" | "dark" | "system"
```

To avoid a flash of the wrong theme, inline `themeInitScript()` from the provider module in
`<head>`. `apps/web/index.html` has the equivalent script written out by hand.

## Adding components

```bash
pnpm ui:add dialog sheet sonner     # = pnpm dlx shadcn@latest add … -c apps/web
```

Components are written to `packages/ui/src/components` and imported as
`@cysys/ui/components/<name>`.
