import * as React from "react"

/**
 * Two independent axes:
 *  - `mode`:  light / dark / system → toggles the `.dark` class on <html>
 *  - `theme`: brand theme name      → sets `data-theme` on <html>
 *
 * Theme names come from @cysys/themes (or any stylesheet that scopes its
 * tokens with `[data-theme="<name>"]`). A theme can also be applied to a
 * subtree by setting `data-theme` on any element.
 */

export type Mode = "dark" | "light" | "system"
export type ResolvedMode = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
  /** Brand themes the user may pick from (e.g. `themeNames` from @cysys/themes). */
  themes?: readonly string[]
  /** Brand theme used when nothing valid is stored. `null` = no data-theme attribute. */
  defaultTheme?: string | null
  defaultMode?: Mode
  storageKey?: string
  modeStorageKey?: string
  disableTransitionOnChange?: boolean
  /** Press "d" to toggle dark mode (handy in dev playgrounds). */
  enableHotkey?: boolean
}

type ThemeProviderState = {
  mode: Mode
  resolvedMode: ResolvedMode
  setMode: (mode: Mode) => void
  theme: string | null
  setTheme: (theme: string | null) => void
  themes: readonly string[]
}

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)"
const MODES: Mode[] = ["dark", "light", "system"]

const ThemeProviderContext = React.createContext<
  ThemeProviderState | undefined
>(undefined)

function isMode(value: string | null): value is Mode {
  return value !== null && MODES.includes(value as Mode)
}

function getSystemMode(): ResolvedMode {
  return window.matchMedia(COLOR_SCHEME_QUERY).matches ? "dark" : "light"
}

function readStorage(key: string) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    // storage unavailable (private mode, sandboxed iframe…) — ignore
  }
}

function disableTransitionsTemporarily() {
  const style = document.createElement("style")
  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;transition:none!important}"
    )
  )
  document.head.appendChild(style)

  return () => {
    window.getComputedStyle(document.body)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        style.remove()
      })
    })
  }
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  return Boolean(
    target.closest("input, textarea, select, [contenteditable='true']")
  )
}

export function ThemeProvider({
  children,
  themes = [],
  defaultTheme = themes[0] ?? null,
  defaultMode = "system",
  storageKey = "cysys-theme",
  modeStorageKey = "cysys-mode",
  disableTransitionOnChange = true,
  enableHotkey = false,
}: ThemeProviderProps) {
  const [mode, setModeState] = React.useState<Mode>(() => {
    const stored = readStorage(modeStorageKey)
    return isMode(stored) ? stored : defaultMode
  })
  const [systemMode, setSystemMode] = React.useState<ResolvedMode>(
    getSystemMode
  )
  const [theme, setThemeState] = React.useState<string | null>(() => {
    const stored = readStorage(storageKey)
    return stored !== null && themes.includes(stored) ? stored : defaultTheme
  })

  const resolvedMode = mode === "system" ? systemMode : mode

  const setMode = React.useCallback(
    (next: Mode) => {
      writeStorage(modeStorageKey, next)
      setModeState(next)
    },
    [modeStorageKey]
  )

  const setTheme = React.useCallback(
    (next: string | null) => {
      writeStorage(storageKey, next)
      setThemeState(next)
    },
    [storageKey]
  )

  // Apply to <html>.
  React.useLayoutEffect(() => {
    const root = document.documentElement
    const restore = disableTransitionOnChange
      ? disableTransitionsTemporarily()
      : null

    root.classList.remove("light", "dark")
    root.classList.add(resolvedMode)
    root.style.colorScheme = resolvedMode
    if (theme) root.dataset.theme = theme
    else delete root.dataset.theme

    restore?.()
  }, [resolvedMode, theme, disableTransitionOnChange])

  // Track OS preference.
  React.useEffect(() => {
    const mq = window.matchMedia(COLOR_SCHEME_QUERY)
    const onChange = () => setSystemMode(getSystemMode())
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  // Keep tabs in sync.
  React.useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.storageArea !== localStorage) return
      if (event.key === modeStorageKey) {
        setModeState(isMode(event.newValue) ? event.newValue : defaultMode)
      } else if (event.key === storageKey) {
        setThemeState(
          event.newValue !== null && themes.includes(event.newValue)
            ? event.newValue
            : defaultTheme
        )
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [defaultMode, defaultTheme, modeStorageKey, storageKey, themes])

  React.useEffect(() => {
    if (!enableHotkey) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return
      if (isEditableTarget(event.target)) return
      if (event.key.toLowerCase() !== "d") return
      setMode(resolvedMode === "dark" ? "light" : "dark")
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [enableHotkey, resolvedMode, setMode])

  const value = React.useMemo(
    () => ({ mode, resolvedMode, setMode, theme, setTheme, themes }),
    [mode, resolvedMode, setMode, theme, setTheme, themes]
  )

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

/**
 * Inline this in <head> (before your app bundle) to apply the stored mode and
 * theme before first paint and avoid a flash of the wrong theme.
 */
export function themeInitScript({
  storageKey = "cysys-theme",
  modeStorageKey = "cysys-mode",
  defaultTheme = null as string | null,
  defaultMode = "system" as Mode,
} = {}) {
  return `(function(){try{var d=document.documentElement,s=localStorage,m=s.getItem(${JSON.stringify(
    modeStorageKey
  )})||${JSON.stringify(defaultMode)};if(m==="system")m=matchMedia(${JSON.stringify(
    COLOR_SCHEME_QUERY
  )}).matches?"dark":"light";d.classList.add(m);d.style.colorScheme=m;var t=s.getItem(${JSON.stringify(
    storageKey
  )})||${JSON.stringify(defaultTheme)};if(t)d.dataset.theme=t}catch(e){}})()`
}
