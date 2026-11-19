import { Card, CardContent } from "@cysys/ui/components/card"

const SAMPLES = [
  { cls: "font-sans", label: "font-sans", text: "Systems that think in signals." },
  { cls: "font-serif", label: "font-serif", text: "Systems that think in signals." },
  { cls: "font-mono", label: "font-mono", text: "const signal = await probe(host)" },
]

export function Typography() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-bold tracking-tight">
            Cynerdyne Systems
          </h1>
          <p className="max-w-prose text-muted-foreground">
            Headings use <code className="font-mono text-sm">tracking-tight</code>;
            body copy inherits the theme's{" "}
            <code className="font-mono text-sm">--tracking-normal</code>.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {SAMPLES.map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <span className="font-mono text-xs text-muted-foreground">
                {s.label}
              </span>
              <span className={`${s.cls} text-lg`}>{s.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
