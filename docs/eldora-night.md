# Eldora Night: design spec

Eldora Night is the Cynerdyne shadcn theme. It started from the **Eldora Night** palette of the
Eldora snowmaking dashboard (`lewismatt/eldora-snowmaking-dashboard`, `docs/product/DESIGN.md`),
was mapped onto shadcn's token set, and was then refined for a clean, professional "modern
terminal dashboard" look:

- near-neutral surfaces (near-black in dark mode, off-white in light mode), no brown cast
- the real Eldora logo orange `#E65400` (sampled from the logo PNG), used only where it carries meaning
- IBM Plex Sans for reading, IBM Plex Mono for headings, labels and figures
- the dashboard's status vocabulary (Prime / Good / Marginal / Not qualifying) as tokens
- every text pair at WCAG AA or better

Source of truth: `packages/themes/registry/eldora-night.json`. If this document and that file
disagree, the file wins; update this document.

## 1. Palette

### Core tokens

| Token | Light | Dark | Notes |
| --- | --- | --- | --- |
| `background` | `#fafaf9` | `#0a0a09` | Page |
| `foreground` | `#111110` | `#ecebe8` | 18:1 / 16.6:1 |
| `card` / `card-foreground` | `#ffffff` / `#111110` | `#111110` / `#ecebe8` | Cards sit one step above the page |
| `popover` / `popover-foreground` | `#ffffff` / `#111110` | `#161615` / `#ecebe8` | Menus sit above cards |
| `primary` | `#e65400` | `#e65400` | Eldora logo orange |
| `primary-foreground` | `#0a0a09` | `#0a0a09` | Near-black on orange (5.3:1). White on this orange fails AA |
| `secondary` / `muted` | `#f2f2f0` | `#1b1b19` | Tabs list, secondary buttons, footers |
| `muted-foreground` | `#5c5b56` | `#9a9993` | Secondary text, 6.5:1 / 6.6:1 |
| `accent` / `accent-foreground` | `#efefed` / `#111110` | `#262624` / `#ecebe8` | Menu/select hover. Deliberately not orange (shadcn's Nova uses it as a hover background) |
| `destructive` | `#cc1616` | `#f87171` | shadcn destructive variants |
| `border` | `#e5e5e2` | `#232321` | Hairlines |
| `input` | `#d6d6d2` | `#2e2e2b` | Form field borders, scrollbar thumb |
| `ring` | `#e65400` | `#e65400` | Focus |
| `link` | `#bd4500` | `#e65400` | Link text (`text-link`). Light uses a darker orange: 5.0:1 page, 5.2:1 card, 4.9:1 footer |
| `radius` | `0.625rem` | | shadcn default |

Sidebar tokens mirror the above (`sidebar` `#f7f7f6` / `#080807`, `sidebar-accent`
`#efefed` / `#1b1b19`, primary = brand).

### Status tokens (from the Eldora dashboard)

Utilities: `bg-prime text-on-prime`, `text-good`, `bg-marginal`, etc.

| Token | Meaning | Light | Dark | On-color (`on-*`) |
| --- | --- | --- | --- | --- |
| `prime` | Wet-bulb ≤ 20°F; also "OK / running" dots | `#2e7a4b` | `#6cbf8a` | white / `#0a0a09` |
| `good` | ≤ 24°F | `#2d6a99` | `#6fa9d2` | white / `#0a0a09` |
| `marginal` | ≤ 28°F (still qualifies) | `#8f5f12` | `#d4a24c` | white / `#0a0a09` |
| `no-window` | Not qualifying / fault / alert | `#b03a2e` | `#db7b6c` | white / `#0a0a09` |
| `wind` | Wind flags | `#6a4fa8` | `#c3b2dd` | |
| `stale` | Stale data | `#5c5b56` | `#c9c7c0` | |

These are softened versions of the dashboard's colors (the originals were very bright on dark).
All pass AA as text on cards (dark 6.4–9.7:1, light 5.0–6.4:1).

### Charts

`chart-1` brand orange, `chart-2` Good, `chart-3` Prime, `chart-4` Marginal, `chart-5` wind.

### Other theme CSS

Body text uses `font-variant-numeric: tabular-nums` (figures line up); `::selection` is the brand
at 35%; scrollbars use `--input`.

## 2. Typography

| Role | Font | How |
| --- | --- | --- |
| Reading text: descriptions, sentences, form labels and inputs, buttons, names | IBM Plex Sans (variable) | default (`font-sans`) |
| Card titles, page titles | IBM Plex Mono | automatic for `CardTitle` via `--font-heading`; `font-heading` elsewhere |
| Eyebrow labels | IBM Plex Mono | `font-mono text-xs tracking-wider uppercase` |
| Figures (stat values) | IBM Plex Mono (via CardTitle) | `text-3xl font-medium tracking-tight` |
| Metadata, timestamps, footnotes | IBM Plex Mono | `font-mono text-xs text-muted-foreground` |
| Status words | IBM Plex Mono | `<Status>` component |
| Table headers | IBM Plex Mono | `[&_th]:font-mono [&_th]:text-xs [&_th]:font-normal [&_th]:tracking-wider [&_th]:text-muted-foreground [&_th]:uppercase` on `TableHeader` |
| Numeric cells, IDs | IBM Plex Mono | `font-mono text-[13px]` |
| Chart axes and labels | IBM Plex Mono | `font-mono` on `ChartContainer` |
| Navigation, wordmark, path line | IBM Plex Mono | `font-mono text-[13px]`; wordmark lowercase |

Why Plex: Plex Sans and Plex Mono share one skeleton, so the sans/mono switch reads as one voice.
(Geist Sans + Geist Mono looked mismatched: tight geometric sans next to a wide rounded mono.) Both
are highly legible at 12–14px.

Rules: smallest text is 12px (`text-xs`); never set paragraphs or descriptions in mono; mono weights
in use are 400 and 500 only (`font-medium` max); headings in mono use `tracking-tight`, uppercase
mono labels use `tracking-wider`.

## 3. Color rules

1. **Orange means something.** Allowed: brand mark; the single primary action in an area; the
   primary data series in a chart; snowmaking windows; the current/highlighted value in a series;
   user-set states (checked switch, selected option); links. Not allowed: progress bars,
   sparklines, secondary actions, status, decorative fills, backgrounds.
2. **Color repeats a word; it never replaces one.** Every status color appears next to its label.
3. **Orange is never a status color** (in particular, never "Marginal").
4. **The resting state is neutral.** "Not qualifying", "No window", "Standby" use neutral grey.
   Red (`no-window` tone) is reserved for things that need attention: faults, alerts.
5. **No bubbles.** No filled pills or outlined capsules for status/rating; use the `Status`
   component (6px dot + mono word). Plain `Badge` is fine for neutral tags.
6. **Plain cards.** No tinted card backgrounds, no extra borders or shadows.

## 4. Component patterns

| Pattern | Implementation (see `apps/web/src/examples/`) |
| --- | --- |
| Stat card | `CardDescription` eyebrow, `CardTitle` figure, tiny chart, `mt-auto px-4 font-mono text-xs` footnote. Status/trend in `CardAction` as `Status` or muted mono text |
| Status | `<Status tone="ok">Running</Status>`, `<Status tone="no-window">Fault</Status>`, `<Status tone="neutral">Standby</Status>` |
| Hour bar | `grid grid-cols-12 gap-[3px]` of `h-2 rounded-full` cells; color only qualifying hours (`bg-prime` / `bg-good` / `bg-marginal`), others `bg-muted-foreground/25`, elapsed `bg-muted`; legend = `size-2 rounded-full` swatch + label + mono count |
| Neutral progress | `<Progress className="[&_[data-slot=progress-indicator]]:bg-foreground/55" />` |
| Primary chart | `AreaChart`/`LineChart`, `stroke="var(--chart-1)"`, `strokeWidth={2.25}`, `fill="none"`; zones `ReferenceArea` `fillOpacity={0.06}` with labels `position: "right"` and `margin.right = 64`; windows as a `ReferenceArea` strip at the bottom in `var(--primary)` |
| Comparison bars | `Cell` per bar: `var(--muted-foreground)` at 0.35, current bar `var(--primary)` at 1 |
| Page header | mono path (`eldora / snowmaking`), `h1.font-heading text-2xl font-medium tracking-tight`, sans description, actions right (outline + one primary) |
| Radio cards | `Label` wrapping a `sr-only` `RadioGroupItem`; `has-data-checked:border-primary has-data-checked:bg-primary/5 has-focus-visible:ring-3 has-focus-visible:ring-ring/50` |

## 5. Accessibility

`pnpm themes:audit eldora-night` must report 0 errors and 0 warnings. It checks the pairs the
components actually render (including focused menu items on `accent`, destructive text on
`destructive/10`, links on page/card/footer, status colors on cards and `on-*` on fills). Four
info items are accepted: focus ring at 50% opacity and input borders (shadcn defaults score the
same; focused controls also switch their border to the solid ring color).
