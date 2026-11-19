import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@cysys/ui/components/card"
import { cn } from "@cysys/ui/lib/utils"

import { BAND_SWATCH, RatingPill } from "./band"
import { BAND_LABEL, shifts, type Band, type Shift } from "./data"

export function UpcomingShifts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming shifts</CardTitle>
        <CardDescription>Each hour colored by its wet-bulb band.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col divide-y">
        {shifts.slice(0, 3).map((s, i) => (
          <ShiftRow key={s.name} shift={s} first={i === 0} />
        ))}
      </CardContent>
      <CardFooter className="mt-auto">
        <a href="#/overview" className="text-sm font-medium text-link underline underline-offset-4">
          Every shift in the forecast
        </a>
      </CardFooter>
    </Card>
  )
}

function ShiftRow({ shift, first }: { shift: Shift; first: boolean }) {
  // A shift in progress has elapsed hours before the forecast starts.
  const elapsed = first ? 12 - shift.hours.length : 0
  const counts = shift.hours.reduce<Partial<Record<Band, number>>>((acc, h) => {
    acc[h.band] = (acc[h.band] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-2.5 py-3 first:pt-0 last:pb-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {shift.startsIn === 0
              ? `In progress · ${shift.hours.length} h left`
              : `Starts in ${shift.startsIn} h`}
          </div>
          <div className="font-medium">{shift.name}</div>
          <div className="text-xs text-muted-foreground">
            {shift.range} · coldest {shift.coldest.toFixed(1)}°F
            {shift.windowHours > 0 && ` · ${shift.windowHours} h in window`}
          </div>
        </div>
        <RatingPill rating={shift.rating} />
      </div>
      <div className="grid grid-cols-12 gap-[3px]" role="img" aria-label={hourSummary(shift)}>
        {Array.from({ length: elapsed }, (_, i) => (
          <div key={`e${i}`} className="h-2 rounded-full bg-muted" />
        ))}
        {shift.hours.map((h, i) => (
          <div
            key={i}
            title={`${BAND_LABEL[h.band]} · ${h.wetBulb.toFixed(1)}°F`}
            className={cn("h-2 rounded-full", BAND_SWATCH[h.band])}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {(Object.keys(counts) as Band[]).map((b) => (
          <span key={b} className="inline-flex items-center gap-1.5">
            <span className={cn("size-2 rounded-full", BAND_SWATCH[b])} aria-hidden />
            {BAND_LABEL[b]} <span className="text-foreground">{counts[b]} h</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function hourSummary(shift: Shift) {
  return shift.hours.map((h) => BAND_LABEL[h.band]).join(", ")
}
