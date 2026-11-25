# cysys-dev

The Cynerdyne Systems design system: [shadcn/ui](https://ui.shadcn.com) components themed with
**Eldora Night**, a clean dark (and light) theme derived from the Eldora snowmaking dashboard, with
the Eldora logo orange `#E65400` and terminal-style IBM Plex typography.

```
apps/
  web/              Vite playground: Overview example dashboard + component kitchen sink
    public/r/       Generated shadcn registry (install Eldora Night into any project)
packages/
  ui/               @cysys/ui      shadcn components, globals.css, ThemeProvider, Status
  themes/           @cysys/themes  theme source, generator, audit, compiled CSS
docs/
  eldora-night.md        Design spec: palette, typography, color rules, patterns
  using-eldora-night.md  How to use the theme here or in another project
  history.md             What was built and why (decision log)
  history/               Archive: the pre-monorepo plan and theme study (background only)
.agents/skills/     Vendored agent skills (pinned in skills-lock.json)
.github/workflows/  CI: format, theme sync + audit, registry sync, lint, typecheck, build
AGENTS.md           Instructions for coding agents working in this repo
```

pnpm workspaces · Turborepo · Vite 8 · React 19 · Tailwind CSS v4 · shadcn CLI 4.23
(Radix base, `radix-nova` style) · TypeScript 6 · recharts 3.

## Quick start

```bash
pnpm install
pnpm dev            # playground at http://localhost:5173 (#/overview, #/components; "d" toggles dark)
pnpm build          # typecheck + build
pnpm lint
pnpm format         # prettier (CI runs format:check)
pnpm themes:check   # generated theme files are up to date
pnpm themes:audit   # WCAG contrast + structure checks for the theme
```

## Eldora Night at a glance

| | Light | Dark |
| --- | --- | --- |
| Background / cards | `#fafaf9` / `#ffffff` | `#0a0a09` / `#111110` |
| Text / secondary text | `#111110` / `#5c5b56` | `#ecebe8` / `#9a9993` |
| Brand (buttons, focus, charts) | `#e65400` | `#e65400` |
| Link text | `#bd4500` | `#e65400` |
| Text on orange | `#0a0a09` | `#0a0a09` |
| Fonts | IBM Plex Sans (reading) · IBM Plex Mono (headings, labels, figures) | same |

It also adds status tokens from the dashboard (`prime`, `good`, `marginal`, `no-window`, `wind`,
`stale`), a `link` token and a themeable `font-heading`. The full spec, with the rules for when to
use orange, mono and status colors, is in [docs/eldora-night.md](docs/eldora-night.md).

## Common tasks

| Task | Command / file |
| --- | --- |
| Add a shadcn component | `pnpm ui:add dialog` → `packages/ui/src/components/dialog.tsx` |
| Change a theme color | edit `packages/themes/registry/eldora-night.json`, then `pnpm themes:build && pnpm themes:audit && pnpm registry:build` |
| Use the theme in another project | [docs/using-eldora-night.md](docs/using-eldora-night.md) |
| Import a theme from tweakcn | `pnpm themes:add https://tweakcn.com/r/themes/<id> --title "Name"` |
| List / remove themes | `pnpm themes list` · `pnpm themes remove <name>` |

Agents: read [AGENTS.md](AGENTS.md) before changing anything.

## License

Project-owned code is [MIT licensed](LICENSE). Third-party components keep their own
open-source licenses; see
[docs/history.md](docs/history.md) §5 for the verified license inventory.
