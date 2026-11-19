// Deterministic demo data for the Eldora example page. Not real readings.
// Bands follow eldora-snowmaking-dashboard docs/SNOWMAKING.md:
// Prime ≤ 20°F · Good ≤ 24°F · Marginal ≤ 28°F · Not qualifying > 28°F.

export type Band = "prime" | "good" | "marginal" | "none"

export const BAND_LABEL: Record<Band, string> = {
  prime: "Prime",
  good: "Good",
  marginal: "Marginal",
  none: "Not qualifying",
}

export function bandOf(wetBulbF: number): Band {
  if (wetBulbF <= 20) return "prime"
  if (wetBulbF <= 24) return "good"
  if (wetBulbF <= 28) return "marginal"
  return "none"
}

const DAYS = ["Today", "Tomorrow", "Day 3", "Day 4"]

// 72 hourly wet-bulb values starting 12:00 today: a diurnal swing plus a
// cold front arriving overnight on day two.
const START_HOUR = 12
export const forecast = Array.from({ length: 72 }, (_, i) => {
  const hour = (START_HOUR + i) % 24
  const day = Math.floor((START_HOUR + i) / 24)
  const diurnal = Math.cos(((hour - 15) / 24) * 2 * Math.PI) * 6.5
  const front = i > 30 ? -Math.min(7, (i - 30) * 0.45) : 0
  const noise = Math.sin(i * 1.7) * 0.8
  const wetBulb = Math.round((24.5 + diurnal + front + noise) * 10) / 10
  const label = `${DAYS[day]} ${String(hour).padStart(2, "0")}:00`
  return { i, hour, day, label, wetBulb }
})

export const now = forecast[0]

// Last 24h of wet-bulb for the sparkline.
export const last24 = Array.from({ length: 24 }, (_, i) => ({
  i,
  wetBulb: Math.round((26 + Math.cos(((i - 3) / 24) * 2 * Math.PI) * 5 + Math.sin(i) * 0.6) * 10) / 10,
}))

export const waterByDay = [
  { day: "Mon", gallons: 2.1 },
  { day: "Tue", gallons: 2.8 },
  { day: "Wed", gallons: 1.4 },
  { day: "Thu", gallons: 0.6 },
  { day: "Fri", gallons: 2.9 },
  { day: "Sat", gallons: 3.4 },
  { day: "Sun", gallons: 3.2 },
]

// Windows: ≥ 5 continuous hours with wet-bulb ≤ 28°F (SNOWMAKING.md rule 3).
function findWindows() {
  const out: { from: number; to: number }[] = []
  let start = -1
  forecast.forEach((h, i) => {
    const ok = h.wetBulb <= 28
    if (ok && start < 0) start = i
    if ((!ok || i === forecast.length - 1) && start >= 0) {
      const end = ok ? i : i - 1
      if (end - start + 1 >= 5) out.push({ from: start, to: end })
      start = -1
    }
  })
  return out
}

export const windows = findWindows()

const first = windows[0]
const hoursIn = forecast.slice(first.from, first.to + 1)
const shiftOf = (hour: number) => (hour >= 7 && hour < 19 ? "Day" : "Night")

export const nextWindow = {
  start: forecast[first.from].label,
  end: first.to === forecast.length - 1 ? "beyond forecast" : forecast[first.to + 1].label,
  hours: hoursIn.length,
  goodOrBetter: hoursIn.filter((h) => h.wetBulb <= 24).length,
  coldest: Math.min(...hoursIn.map((h) => h.wetBulb)),
  shifts: hoursIn.map((h) => shiftOf(h.hour)).filter((s, i, a) => s !== a[i - 1]),
  wind: "W 8–14 mph",
}

export type Gun = {
  id: string
  trail: string
  type: "Fan" | "Tower"
  status: "running" | "standby" | "fault"
  gpm: number
}

export const guns: Gun[] = [
  { id: "F-12", trail: "Ho Hum", type: "Fan", status: "running", gpm: 92 },
  { id: "F-14", trail: "Ho Hum", type: "Fan", status: "running", gpm: 88 },
  { id: "T-03", trail: "Corona", type: "Tower", status: "running", gpm: 41 },
  { id: "T-07", trail: "Corona", type: "Tower", status: "standby", gpm: 0 },
  { id: "F-21", trail: "Jolly Jug", type: "Fan", status: "fault", gpm: 0 },
  { id: "T-11", trail: "Indian Peaks", type: "Tower", status: "running", gpm: 38 },
]

export const crew = [
  { name: "Riley Moreno", initials: "RM", email: "riley@eldora.example", role: "Lead" },
  { name: "Sam Okafor", initials: "SO", email: "sam@eldora.example", role: "Hydrants" },
  { name: "Jess Lindqvist", initials: "JL", email: "jess@eldora.example", role: "Pump house" },
  { name: "Dev Patel", initials: "DP", email: "dev@eldora.example", role: "Hydrants" },
]

export const pumps = [
  { name: "Pump 1", load: 86 },
  { name: "Pump 2", load: 72 },
  { name: "Booster", load: 41 },
]
