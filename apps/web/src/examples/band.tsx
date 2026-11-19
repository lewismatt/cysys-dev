import { cn } from "@cysys/ui/lib/utils"

import { BAND_LABEL, type Band, type Rating } from "./data"

// Color repeats a word; it never replaces one (Eldora DESIGN.md). Orange is
// the brand and is never a status color.
export const BAND_FILL: Record<Band, string> = {
  prime: "bg-prime text-on-prime",
  good: "bg-good text-on-good",
  marginal: "bg-marginal text-on-marginal",
  none: "bg-no-window text-on-no-window",
}

/** Filled chip: a band word on its band color. */
export function BandLabel({ band, className }: { band: Band; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-md px-1.5 text-xs font-medium whitespace-nowrap",
        BAND_FILL[band],
        className
      )}
    >
      {BAND_LABEL[band]}
    </span>
  )
}

const RATING: Record<Rating, { label: string; className: string }> = {
  favorable: { label: "Favorable", className: "border-prime/60 text-prime" },
  marginal: { label: "Marginal", className: "border-marginal/60 text-marginal" },
  none: { label: "No window", className: "border-no-window/60 text-no-window" },
}

/** Outlined, uppercase rating pill for a window or shift. */
export function RatingPill({ rating, className }: { rating: Rating; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-full border px-2.5 text-[11px] font-semibold tracking-wider whitespace-nowrap uppercase",
        RATING[rating].className,
        className
      )}
    >
      {RATING[rating].label}
    </span>
  )
}
