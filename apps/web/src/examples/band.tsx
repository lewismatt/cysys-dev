import { Status, type StatusTone } from "@cysys/ui/components/status"

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

const BAND_TONE: Record<Band, StatusTone> = {
  prime: "prime",
  good: "good",
  marginal: "marginal",
  none: "neutral",
}

/** A band word with a small dot in its color. */
export function BandLabel({
  band,
  className,
}: {
  band: Band
  className?: string
}) {
  return (
    <Status tone={BAND_TONE[band]} className={className}>
      {BAND_LABEL[band]}
    </Status>
  )
}

const RATING: Record<Rating, { label: string; tone: StatusTone }> = {
  favorable: { label: "Favorable", tone: "prime" },
  marginal: { label: "Marginal", tone: "marginal" },
  none: { label: "No window", tone: "neutral" },
}

/** Rating for a window or shift: a dot and a word, no container. */
export function RatingPill({
  rating,
  className,
}: {
  rating: Rating
  className?: string
}) {
  return (
    <Status tone={RATING[rating].tone} className={className}>
      {RATING[rating].label}
    </Status>
  )
}
