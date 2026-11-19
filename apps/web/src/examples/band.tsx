import { cn } from "@cysys/ui/lib/utils"

import { BAND_LABEL, type Band, type Rating } from "./data"

// Color repeats a word; it never replaces one (Eldora DESIGN.md). Orange is
// the brand and is never a status color. "Not qualifying" is the resting
// state, so it stays neutral and only qualifying bands get color.
export const BAND_SWATCH: Record<Band, string> = {
  prime: "bg-prime",
  good: "bg-good",
  marginal: "bg-marginal",
  none: "bg-muted-foreground/25",
}

function StatusText({
  dot,
  text,
  label,
  className,
}: {
  dot: string
  text: string
  label: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-xs whitespace-nowrap",
        text,
        className
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", dot)} aria-hidden />
      {label}
    </span>
  )
}

const BAND_TEXT: Record<Band, string> = {
  prime: "text-prime",
  good: "text-good",
  marginal: "text-marginal",
  none: "text-muted-foreground",
}

/** A band word with a small dot in its color. */
export function BandLabel({ band, className }: { band: Band; className?: string }) {
  return (
    <StatusText
      dot={BAND_SWATCH[band]}
      text={BAND_TEXT[band]}
      label={BAND_LABEL[band]}
      className={className}
    />
  )
}

const RATING: Record<Rating, { label: string; dot: string; text: string }> = {
  favorable: { label: "Favorable", dot: "bg-prime", text: "text-prime" },
  marginal: { label: "Marginal", dot: "bg-marginal", text: "text-marginal" },
  none: { label: "No window", dot: "bg-muted-foreground/50", text: "text-muted-foreground" },
}

/** Rating for a window or shift: a dot and a word, no container. */
export function RatingPill({ rating, className }: { rating: Rating; className?: string }) {
  const r = RATING[rating]
  return <StatusText dot={r.dot} text={r.text} label={r.label} className={className} />
}
