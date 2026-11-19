const GROUPS: { label: string; tokens: [bg: string, fg?: string][] }[] = [
  {
    label: "Surfaces",
    tokens: [
      ["background", "foreground"],
      ["card", "card-foreground"],
      ["popover", "popover-foreground"],
      ["muted", "muted-foreground"],
    ],
  },
  {
    label: "Brand",
    tokens: [
      ["primary", "primary-foreground"],
      ["secondary", "secondary-foreground"],
      ["accent", "accent-foreground"],
      ["destructive", "destructive-foreground"],
    ],
  },
  {
    label: "Lines",
    tokens: [["border"], ["input"], ["ring"]],
  },
  {
    label: "Charts",
    tokens: [["chart-1"], ["chart-2"], ["chart-3"], ["chart-4"], ["chart-5"]],
  },
  {
    label: "Sidebar",
    tokens: [
      ["sidebar", "sidebar-foreground"],
      ["sidebar-primary", "sidebar-primary-foreground"],
      ["sidebar-accent", "sidebar-accent-foreground"],
      ["sidebar-border"],
    ],
  },
]

export function TokenGrid() {
  return (
    <div className="flex flex-col gap-6">
      {GROUPS.map((g) => (
        <div key={g.label} className="flex flex-col gap-2">
          <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            {g.label}
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {g.tokens.map(([bg, fg]) => (
              <div key={bg} className="overflow-hidden rounded-lg border">
                <div
                  className="flex h-16 items-end p-2 text-sm font-medium"
                  style={{
                    background: `var(--${bg})`,
                    color: fg ? `var(--${fg})` : undefined,
                  }}
                >
                  {fg ? "Aa" : null}
                </div>
                <div className="border-t px-2 py-1.5 font-mono text-[11px] leading-tight">
                  <div>--{bg}</div>
                  {fg && <div className="text-muted-foreground">--{fg}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
