import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"

import { themes } from "@cysys/themes"
import { Button } from "@cysys/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@cysys/ui/components/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@cysys/ui/components/select"
import { useTheme, type Mode } from "@cysys/ui/providers/theme-provider"

import { BASELINE_THEME } from "@/lib/baseline"

export function Swatches({ colors }: { colors: string[] }) {
  return (
    <span className="flex -space-x-1" aria-hidden>
      {colors.map((c, i) => (
        <span
          key={i}
          className="size-3 rounded-full border border-black/10 dark:border-white/20"
          style={{ background: c }}
        />
      ))}
    </span>
  )
}

export function ThemeSelect() {
  const { theme, setTheme, resolvedMode } = useTheme()

  return (
    <Select value={theme ?? undefined} onValueChange={setTheme}>
      <SelectTrigger className="w-36 sm:w-48" aria-label="Theme">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent position="popper" align="end">
        <SelectGroup>
          <SelectLabel>Cynerdyne themes</SelectLabel>
          {themes.map((t) => {
            const s = t.swatches[resolvedMode]
            return (
              <SelectItem key={t.name} value={t.name}>
                <Swatches colors={[s.primary, s.background, s.foreground]} />
                {t.title}
              </SelectItem>
            )
          })}
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Reference</SelectLabel>
          <SelectItem value={BASELINE_THEME}>
            <Swatches
              colors={
                resolvedMode === "dark"
                  ? ["#e5e5e5", "#0a0a0a", "#fafafa"]
                  : ["#171717", "#ffffff", "#0a0a0a"]
              }
            />
            shadcn neutral
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

const MODE_ICON = { light: SunIcon, dark: MoonIcon, system: MonitorIcon }

export function ModeToggle() {
  const { mode, setMode, resolvedMode } = useTheme()
  const Icon = MODE_ICON[resolvedMode]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Color mode">
          <Icon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={mode}
          onValueChange={(v) => setMode(v as Mode)}
        >
          {(["light", "dark", "system"] as const).map((m) => {
            const ItemIcon = MODE_ICON[m]
            return (
              <DropdownMenuRadioItem key={m} value={m} className="capitalize">
                <ItemIcon />
                {m}
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
