import { cn } from "@cysys/ui/lib/utils"

import { BAND_LABEL, type Band } from "./data"

// Color repeats a word; it never replaces one (Eldora DESIGN.md). Orange is
// the brand and is never used for the Marginal band.
const DOT: Record<Band, string> = {
  prime: "bg-chart-3",
  good: "bg-chart-2",
  marginal: "bg-chart-4",
  none: "bg-muted-foreground/50",
}

export function BandLabel({ band, className }: { band: Band; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", DOT[band])} aria-hidden />
      {BAND_LABEL[band]}
    </span>
  )
}
