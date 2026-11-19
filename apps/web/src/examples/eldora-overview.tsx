import { CalendarClockIcon, DownloadIcon } from "lucide-react"

import { Button } from "@cysys/ui/components/button"

import { AlertsCard, IssueCard, ModeCard, ShareCard } from "./controls"
import { ForecastChart } from "./forecast"
import { CrewCard, GunsTable, PumpHouse } from "./operations"
import { GunsRunning, NextWindowStat, WaterThisWeek, WetBulbNow } from "./stats"

/**
 * Example page in the spirit of the shadcn/ui examples: plain cards on a
 * quiet background, one accent color, small type and tabular figures.
 * Content is Eldora snowmaking demo data.
 */
export function EldoraOverview() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">Snowmaking</h1>
          <p className="text-sm text-muted-foreground">
            Eldora · conditions, windows and equipment. Demo data.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <DownloadIcon data-icon="inline-start" />
            Export
          </Button>
          <Button>
            <CalendarClockIcon data-icon="inline-start" />
            Plan crew
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <WetBulbNow />
        <NextWindowStat />
        <WaterThisWeek />
        <GunsRunning />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ForecastChart />
        <CrewCard />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <GunsTable />
        <div className="flex flex-col gap-4">
          <PumpHouse />
          <AlertsCard />
        </div>
      </div>

      <div className="grid items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ModeCard />
        <IssueCard />
        <ShareCard />
      </div>
    </div>
  )
}
