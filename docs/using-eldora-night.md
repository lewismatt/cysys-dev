# Using Eldora Night

Two ways to use the theme: inside this monorepo (the `@cysys/*` packages), or in any other shadcn
project via the shadcn CLI. Written for humans and coding agents; follow the steps literally.

## A. Inside this monorepo

An app in `apps/*` gets everything from the workspace packages:

```jsonc
// apps/<app>/package.json
"dependencies": { "@cysys/ui": "workspace:*", "@cysys/themes": "workspace:*" }
```

```tsx
// main.tsx
import "@cysys/ui/globals.css"
import "@cysys/themes/eldora-night.css" // includes the IBM Plex @imports
import { defaultTheme, themeNames } from "@cysys/themes"
import { ThemeProvider } from "@cysys/ui/providers/theme-provider"
import { TooltipProvider } from "@cysys/ui/components/tooltip"

createRoot(root).render(
  <ThemeProvider themes={themeNames} defaultTheme={defaultTheme} defaultMode="dark">
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </ThemeProvider>
)
```

- Copy `apps/web/vite.config.ts` (React + `@tailwindcss/vite`, `@` alias) and the `paths` in
  `apps/web/tsconfig*.json`. `packages/ui/src/styles/globals.css` already `@source`s `apps/**`.
- Add the pre-paint script from `apps/web/index.html` to avoid a theme flash.
- Components: `import { Button } from "@cysys/ui/components/button"`; status:
  `import { Status } from "@cysys/ui/components/status"`.
- Add components with `pnpm ui:add <name>` (they land in `packages/ui`).

## B. In another shadcn project (any repo)

Requirements: a shadcn project on Tailwind v4 with CSS variables (`shadcn init`; the `radix-nova`
style is what this was built and tested with).

### 1. Install the theme

The registry item is generated at `apps/web/public/r/eldora-night.json` (`pnpm registry:build`).
It's served from the deployed playground at `https://cysys.dev/r/eldora-night.json`.

```bash
# from a deployed playground
pnpm dlx shadcn@latest add https://cysys.dev/r/eldora-night.json
# or from a local checkout of this repo
pnpm dlx shadcn@latest add /path/to/cysys-dev/apps/web/public/r/eldora-night.json
```

The CLI writes into your Tailwind CSS file (e.g. `src/index.css`):
- `:root` (light) and `.dark` values for every token, including `--prime`, `--good`, `--marginal`, `--no-window`, `--on-*`, `--wind`, `--stale`, `--link`
- `@theme inline` entries: fonts, `--font-heading: var(--font-mono)`, and `--color-prime`, `--color-link`, … (so `bg-prime`, `text-link` work)
- base rules: tabular numbers, selection color, scrollbar color
- installs `@fontsource-variable/ibm-plex-sans` and `@fontsource/ibm-plex-mono`

### 2. Import the fonts (the CLI installs but does not import them)

Add near the top of the same CSS file, after `@import "tailwindcss";`:

```css
@import "@fontsource-variable/ibm-plex-sans";
@import "@fontsource/ibm-plex-mono/400.css";
@import "@fontsource/ibm-plex-mono/500.css";
```

You can remove `@import "@fontsource-variable/geist";` if the preset added it.

### 3. Dark mode

The theme uses shadcn's `.dark` class on `<html>`. Your project's `ThemeProvider` (shadcn scaffold)
already toggles it. Eldora Night is designed dark-first: default to dark if you control it.

### 4. Make links and headings follow the theme (Nova style)

- Card titles already use `font-heading` in `radix-nova`, so they become IBM Plex Mono
  automatically. For other styles, add `font-heading` to `CardTitle`.
- For readable light-mode links, change the `link` variant in `components/ui/button.tsx` and
  `badge.tsx` from `text-primary` to `text-link`, and use `text-link` for inline links.

### 5. Add the Status component

Create `components/ui/status.tsx`. Use `import { cn } from "cn"` for new shadcn projects, or
`import { cn } from "@/lib/utils"` for older ones (match your `button.tsx`):

```tsx
import * as React from "react"
import { cn } from "cn"

const TONES = {
  prime: { dot: "bg-prime", text: "text-prime" },
  good: { dot: "bg-good", text: "text-good" },
  marginal: { dot: "bg-marginal", text: "text-marginal" },
  "no-window": { dot: "bg-no-window", text: "text-no-window" },
  wind: { dot: "bg-wind", text: "text-wind" },
  ok: { dot: "bg-prime", text: "" },
  neutral: { dot: "bg-muted-foreground/50", text: "text-muted-foreground" },
} as const

export type StatusTone = keyof typeof TONES

export function Status({
  tone = "neutral",
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & { tone?: StatusTone }) {
  return (
    <span
      data-slot="status"
      className={cn("inline-flex items-center gap-1.5 font-mono text-xs whitespace-nowrap", TONES[tone].text, className)}
      {...props}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", TONES[tone].dot)} aria-hidden />
      {children}
    </span>
  )
}
```

(Canonical copy: `packages/ui/src/components/status.tsx`.)

### 6. Verify

- `pnpm build` succeeds.
- In the browser (dark mode): `getComputedStyle(document.body).backgroundColor` is
  `rgb(10, 10, 9)`; a `Button` is `rgb(230, 84, 0)`; a `CardTitle`'s font-family starts with
  `"IBM Plex Mono"`; `document.fonts` contains loaded `IBM Plex Sans Variable` and `IBM Plex Mono`.
- Light mode: background `rgb(250, 250, 249)`, `text-link` is `rgb(189, 69, 0)`.

### 7. Follow the design rules

Read [eldora-night.md](eldora-night.md), sections 2–4: orange only where it means something, status
as dot + word, mono for data and sans for reading, plain cards, 12px minimum.

## Updating

When the theme changes in this repo, rerun the same `shadcn add …/eldora-night.json --overwrite`
in the consumer project and review the CSS diff. Your own edits to the theme block will be replaced.
