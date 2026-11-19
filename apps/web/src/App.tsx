import { themes } from "@cysys/themes"

import { ModeToggle, ThemeSelect } from "@/components/theme-controls"
import { Showcase } from "@/components/showcase"
import { ThemeGallery } from "@/components/theme-gallery"
import { TokenGrid } from "@/components/token-grid"
import { Typography } from "@/components/typography"

export function App() {
  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="mr-auto flex items-center gap-2">
            <div className="size-6 rounded-md bg-primary" aria-hidden />
            <div className="leading-tight">
              <div className="text-sm font-semibold">Cynerdyne Systems</div>
              <div className="text-xs text-muted-foreground">
                Design playground · {themes.length} theme
                {themes.length === 1 ? "" : "s"}
              </div>
            </div>
          </div>
          <ThemeSelect />
          <ModeToggle />
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-8">
        <Section
          title="Components"
          description="shadcn/ui components from @cysys/ui, rendered with the active theme."
        >
          <Showcase />
        </Section>
        <Section
          title="Tokens"
          description="Semantic color tokens defined by the active theme."
        >
          <TokenGrid />
        </Section>
        <Section title="Typography">
          <Typography />
        </Section>
        <Section
          title="All themes"
          description={
            <>
              Each preview is scoped with its own{" "}
              <code className="font-mono text-xs">data-theme</code>{" "}
              attribute, so themes can coexist on one page.
            </>
          }
        >
          <ThemeGallery />
        </Section>
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        Press <kbd className="rounded border px-1 font-mono">d</kbd> to toggle
        dark mode
      </footer>
    </div>
  )
}

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  )
}
