'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

type ThemeToggleProps = {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('mymag-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      type="button"
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-xl text-foreground/65 ring-1 ring-border/60 transition-all duration-300 hover:text-foreground hover:bg-muted hover:ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60',
        className
      )}
      aria-label={dark ? 'Passer en thème clair' : 'Passer en thème sombre'}
      aria-pressed={dark}
      onClick={() => setDark((d) => !d)}
    >
      {dark ? <Sun className="size-[17px]" strokeWidth={1.75} /> : <Moon className="size-[17px]" strokeWidth={1.75} />}
    </button>
  )
}
