import * as React from "react"
import { cn } from "cn"

/**
 * Status: a small dot plus a word, in the tone's color, set in mono.
 *
 * Eldora Night rule: color repeats a word, it never replaces one. Always pass
 * a visible label. Orange (primary) is the brand and is never a status tone.
 *
 *   <Status tone="prime">Favorable</Status>
 *   <Status tone="no-window">Fault</Status>
 *   <Status tone="neutral">Standby</Status>
 */
const TONES = {
  prime: { dot: "bg-prime", text: "text-prime" },
  good: { dot: "bg-good", text: "text-good" },
  marginal: { dot: "bg-marginal", text: "text-marginal" },
  "no-window": { dot: "bg-no-window", text: "text-no-window" },
  wind: { dot: "bg-wind", text: "text-wind" },
  // Running / OK in a list: green dot, normal text color.
  ok: { dot: "bg-prime", text: "" },
  neutral: { dot: "bg-muted-foreground/50", text: "text-muted-foreground" },
} as const

type StatusTone = keyof typeof TONES

function Status({
  tone = "neutral",
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & { tone?: StatusTone }) {
  return (
    <span
      data-slot="status"
      data-tone={tone}
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-xs whitespace-nowrap",
        TONES[tone].text,
        className
      )}
      {...props}
    >
      <span
        data-slot="status-dot"
        className={cn("size-1.5 shrink-0 rounded-full", TONES[tone].dot)}
        aria-hidden
      />
      {children}
    </span>
  )
}

export { Status, type StatusTone }
