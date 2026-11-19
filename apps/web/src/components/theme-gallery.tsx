import { themes } from "@cysys/themes"
import { Badge } from "@cysys/ui/components/badge"
import { Button } from "@cysys/ui/components/button"
import { Input } from "@cysys/ui/components/input"
import { Switch } from "@cysys/ui/components/switch"
import { useTheme } from "@cysys/ui/providers/theme-provider"
import { cn } from "@cysys/ui/lib/utils"

const ENTRIES = themes.map((t) => ({
  name: t.name as string,
  title: t.title as string,
  fonts: t.fonts as { sans?: string; mono?: string },
}))

export function ThemeGallery() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ENTRIES.map((t) => (
        // `data-theme` on any element scopes that theme to its subtree.
        <div
          key={t.name}
          data-theme={t.name}
          className={cn(
            "flex flex-col gap-4 rounded-xl border bg-background p-4 font-sans text-foreground shadow-sm",
            theme === t.name && "ring-2 ring-ring"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-semibold">{t.title}</div>
              <div className="font-mono text-xs text-muted-foreground">
                data-theme="{t.name}"
              </div>
            </div>
            {theme === t.name ? (
              <Badge>Active</Badge>
            ) : (
              <Button size="xs" variant="outline" onClick={() => setTheme(t.name)}>
                Use
              </Button>
            )}
          </div>
          <div className="flex gap-1.5">
            {["primary", "secondary", "accent", "muted", "destructive"].map(
              (k) => (
                <div
                  key={k}
                  title={k}
                  className="h-6 flex-1 rounded-sm border"
                  style={{ background: `var(--${k})` }}
                />
              )
            )}
          </div>
          <Input placeholder="Search…" />
          <div className="flex items-center gap-2">
            <Button size="sm">Primary</Button>
            <Button size="sm" variant="secondary">
              Secondary
            </Button>
            <Switch className="ml-auto" defaultChecked />
          </div>
          <div className="text-xs text-muted-foreground">
            {t.fonts.sans ?? "—"} · {t.fonts.mono ?? "system mono"}
          </div>
        </div>
      ))}
    </div>
  )
}
