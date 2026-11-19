import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@cysys/ui/globals.css"
import "@cysys/themes/all.css"
import { defaultTheme, themeNames } from "@cysys/themes"
import { TooltipProvider } from "@cysys/ui/components/tooltip"
import { ThemeProvider } from "@cysys/ui/providers/theme-provider"

import { App } from "./App.tsx"
import { BASELINE_THEME } from "./lib/baseline.ts"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider
      themes={[...themeNames, BASELINE_THEME]}
      defaultTheme={defaultTheme}
      defaultMode="dark"
      enableHotkey
    >
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
)
