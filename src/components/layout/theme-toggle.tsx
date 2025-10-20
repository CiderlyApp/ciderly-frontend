// FILE: src/components/layout/theme-toggle.tsx
"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Избегаем гидрационного несовпадения
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Переключить тему</span>
      </Button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Переключить на ${isDark ? 'светлую' : 'темную'} тему`}
      className="!ring-0 !outline-none focus-visible:!ring-0 focus-visible:!outline-none hover:bg-transparent active:bg-transparent"
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-transform duration-200 ${isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100 text-yellow-500'}`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] pointer-events-none transition-transform duration-200 ${isDark ? 'rotate-0 scale-100 text-white' : 'rotate-90 scale-0'}`} />
      <span className="sr-only">Переключить тему</span>
    </Button>
  )
}