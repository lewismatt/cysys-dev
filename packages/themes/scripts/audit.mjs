// Theme audit: WCAG 2.x contrast for the token pairs shadcn components
// actually render (radix-nova style), plus structural sanity checks.
//
// Pairs below mirror real usage in packages/ui/src/components, e.g. focused
// dropdown/select items are `bg-accent text-accent-foreground`, destructive
// buttons/badges are `bg-destructive/10 text-destructive`, focus rings are
// `ring-ring/50`. Update them if the component style changes.

const REQUIRED = [
  "background", "foreground", "card", "card-foreground", "popover",
  "popover-foreground", "primary", "primary-foreground", "secondary",
  "secondary-foreground", "muted", "muted-foreground", "accent",
  "accent-foreground", "destructive", "border", "input", "ring",
  "chart-1", "chart-2", "chart-3", "chart-4", "chart-5", "sidebar",
  "sidebar-foreground", "sidebar-primary", "sidebar-primary-foreground",
  "sidebar-accent", "sidebar-accent-foreground", "sidebar-border",
  "sidebar-ring",
]

// [fg, bg, min ratio, where it shows up, level when failing]
// bg may be "token/NN" meaning NN% of token composited over `background`.
const PAIRS = [
  ["foreground", "background", 4.5, "body text", "error"],
  ["card-foreground", "card", 4.5, "card text", "error"],
  ["popover-foreground", "popover", 4.5, "menus, selects, tooltips", "error"],
  ["muted-foreground", "background", 4.5, "descriptions, placeholders", "error"],
  ["muted-foreground", "muted", 4.5, "inactive tabs (TabsList)", "warn"],
  ["primary-foreground", "primary", 4.5, "default buttons, badges, checked checkbox", "error"],
  ["secondary-foreground", "secondary", 4.5, "secondary buttons, badges", "error"],
  ["accent-foreground", "accent", 4.5, "focused/hovered dropdown & select items", "error"],
  ["primary", "background", 4.5, "link buttons, text-primary", "warn"],
  ["destructive", "card", 4.5, "destructive alert text", "error"],
  ["destructive", "destructive/10", 4.5, "destructive buttons & badges (bg-destructive/10)", "error"],
  ["sidebar-foreground", "sidebar", 4.5, "sidebar text", "error"],
  ["sidebar-primary-foreground", "sidebar-primary", 4.5, "sidebar active item", "error"],
  ["sidebar-accent-foreground", "sidebar-accent", 4.5, "sidebar hovered item", "error"],
  // Non-text (WCAG 1.4.11) — 3:1
  ["primary", "background", 3, "checked switch/checkbox fill", "warn"],
  ["ring/50", "background", 3, "focus ring (ring-ring/50)", "info"],
  ["input", "background", 3, "input/checkbox borders", "info"],
  // Optional status tokens (Eldora Night): text on filled chips, and the
  // color used as text on cards. Skipped when a theme doesn't define them.
  ...["prime", "good", "marginal", "no-window"].flatMap((s) => [
    [`on-${s}`, s, 4.5, `${s} chip text`, "error", true],
    [s, "card", 4.5, `${s} as text on cards`, "error", true],
  ]),
  ["wind", "card", 4.5, "wind as text on cards", "warn", true],
  ["stale", "card", 4.5, "stale as text on cards", "warn", true],
]

// ---------------------------------------------------------------------------
// color math (sRGB, gamma-space compositing like browsers do)

function parseAlpha(a) {
  if (a === undefined) return 1
  return a.endsWith("%") ? parseFloat(a) / 100 : parseFloat(a)
}

function oklchToLinear(L, C, H) {
  const h = (H * Math.PI) / 180
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)
const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const clamp01 = (x) => Math.min(1, Math.max(0, x))

/** → { rgb: [r,g,b] gamma 0..1, alpha, outOfGamut } or null */
export function parseColor(str) {
  const s = String(str).trim()
  let m = s.match(/^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+%?))?\s*\)$/i)
  if (m) {
    const L = parseFloat(m[1]) / (m[2] ? 100 : 1)
    const lin = oklchToLinear(L, parseFloat(m[3]), parseFloat(m[4]))
    const outOfGamut = lin.some((c) => c < -0.002 || c > 1.002)
    const h = (parseFloat(m[4]) * Math.PI) / 180
    const lab = [L, parseFloat(m[3]) * Math.cos(h), parseFloat(m[3]) * Math.sin(h)]
    return { rgb: lin.map((c) => toGamma(clamp01(c))), lab, alpha: parseAlpha(m[5]), outOfGamut }
  }
  m = s.match(/^#([0-9a-f]{3,8})$/i)
  if (m) {
    let h = m[1]
    if (h.length <= 4) h = [...h].map((c) => c + c).join("")
    const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255
    return { rgb: [n(0), n(2), n(4)], alpha: h.length === 8 ? n(6) : 1, outOfGamut: false }
  }
  m = s.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+%?))?\s*\)$/i)
  if (m) {
    return { rgb: [m[1], m[2], m[3]].map((v) => parseFloat(v) / 255), alpha: parseAlpha(m[4]), outOfGamut: false }
  }
  return null
}

function over(top, base) {
  const a = top.alpha
  return { rgb: top.rgb.map((c, i) => c * a + base.rgb[i] * (1 - a)), alpha: 1 }
}

function luminance({ rgb }) {
  const [r, g, b] = rgb.map(toLinear)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (l1 + 0.05) / (l2 + 0.05)
}

// ---------------------------------------------------------------------------

function resolve(vars, ref, background) {
  const [token, pct] = ref.split("/")
  const raw = vars[token]
  if (raw === undefined) return { error: `missing --${token}` }
  const c = parseColor(raw)
  if (!c) return { error: `can't parse --${token}: ${raw}` }
  const withPct = pct ? { ...c, alpha: c.alpha * (Number(pct) / 100) } : c
  return { color: withPct.alpha < 1 ? over(withPct, background) : withPct }
}

/** Audit one registry item. Returns { findings: [{level, mode, message}] } */
export function auditTheme(item) {
  const findings = []
  const add = (level, mode, message) => findings.push({ level, mode, message })
  const v = item.cssVars ?? {}

  for (const mode of ["light", "dark"]) {
    const vars = { ...(v.theme ?? {}), ...(v[mode] ?? {}) }
    const missing = REQUIRED.filter((k) => !(k in vars))
    if (missing.length) add("error", mode, `missing tokens: ${missing.join(", ")}`)

    const bgParsed = parseColor(vars.background ?? "")
    if (!bgParsed) {
      add("error", mode, "can't parse --background; skipping contrast checks")
      continue
    }
    const background = bgParsed.alpha < 1 ? over(bgParsed, { rgb: [1, 1, 1], alpha: 1 }) : bgParsed

    for (const [fgRef, bgRef, min, where, level, optional] of PAIRS) {
      if (optional && !(fgRef.split("/")[0] in vars && bgRef.split("/")[0] in vars)) continue
      const bg = resolve(vars, bgRef, background)
      const fg = bg.color && resolve(vars, fgRef, bg.color)
      const err = bg.error ?? fg?.error
      if (err) {
        if (!missing.length) add("warn", mode, err)
        continue
      }
      const ratio = contrast(fg.color, bg.color)
      const same = !fgRef.includes("/") && !bgRef.includes("/") && vars[fgRef] === vars[bgRef]
      if (same) {
        add("error", mode, `--${fgRef} is identical to --${bgRef} → invisible ${where}`)
      } else if (ratio < min) {
        add(level, mode, `${ratio.toFixed(2)}:1 --${fgRef} on --${bgRef} (needs ${min}:1) — ${where}`)
      }
    }

    // Charts: visible against the page and distinguishable from each other.
    const charts = [1, 2, 3, 4, 5].map((n) => [`chart-${n}`, parseColor(vars[`chart-${n}`] ?? "")]).filter(([, c]) => c)
    for (const [name, c] of charts) {
      const r = contrast(c, background)
      if (r < 3) add("warn", mode, `${r.toFixed(2)}:1 --${name} on --background (needs 3:1) — chart series may be hard to see`)
    }
    for (let i = 0; i < charts.length; i++) {
      for (let j = i + 1; j < charts.length; j++) {
        const [a, b] = [charts[i][1].lab, charts[j][1].lab]
        const dE = a && b ? Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) : null
        if (vars[charts[i][0]] === vars[charts[j][0]]) add("warn", mode, `--${charts[i][0]} and --${charts[j][0]} are identical`)
        else if (dE !== null && dE < 0.08) add("warn", mode, `ΔE ${dE.toFixed(3)} --${charts[i][0]} vs --${charts[j][0]} — near-identical chart series (want ≥ 0.08)`)
      }
    }

    // Gamut / misc.
    const oog = Object.entries(vars).filter(([, val]) => parseColor(val)?.outOfGamut).map(([k]) => k)
    if (oog.length) add("info", mode, `outside sRGB, clipped on sRGB screens: ${oog.join(", ")}`)
    const badAlpha = Object.entries(vars).filter(([k, val]) => k.startsWith("shadow") && /\/\s*(1\.\d*[1-9]|[2-9])/.test(val)).map(([k]) => k)
    if (badAlpha.length) add("info", mode, `shadow alpha > 1 (clamped to 1): ${badAlpha.join(", ")}`)
  }

  return { findings }
}

const ICON = { error: "✖", warn: "▲", info: "·" }

export function formatFindings(name, { findings }) {
  if (!findings.length) return `✔ ${name}: no issues`
  const counts = ["error", "warn", "info"].map((l) => `${findings.filter((f) => f.level === l).length} ${l}`).join(", ")
  const lines = [`${name}: ${counts}`]
  for (const f of findings) lines.push(`  ${ICON[f.level]} [${f.mode}] ${f.message}`)
  return lines.join("\n")
}
