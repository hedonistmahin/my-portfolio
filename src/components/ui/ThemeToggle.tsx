'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState, useCallback, useRef } from 'react'

interface Ripple {
  id: number
  x: number
  y: number
}

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const btnRef = useRef<HTMLButtonElement>(null)
  const rippleIdRef = useRef<number>(0)
  const timersRef = useRef<number[]>([])

  const scheduleCleanup = (handle: number) => {
    timersRef.current.push(handle)
  }

  useEffect(() => {
    setMounted(true)
    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t))
      timersRef.current = []
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('theme-transitioning')
      }
    }
  }, [])

  const effectiveTheme = theme ?? resolvedTheme ?? 'dark'
  const isDark = effectiveTheme === 'dark'

  const toggleTheme = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const newTheme = isDark ? 'light' : 'dark'

      // Apply global transitioning class to ensure smooth cross-fade across ALL elements
      if (typeof document !== 'undefined') {
        const root = document.documentElement
        root.classList.add('theme-transitioning')
        const clearFlag = window.setTimeout(() => {
          root.classList.remove('theme-transitioning')
        }, 700)
        scheduleCleanup(clearFlag)
      }

      setTheme(newTheme)
      setIsAnimating(true)

      // Click ripple effect
      const btn = btnRef.current
      if (btn) {
        const rect = btn.getBoundingClientRect()
        const id = ++rippleIdRef.current
        setRipples((prev) => [
          ...prev,
          { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
        ])
        const rippleTimer = window.setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id))
        }, 650)
        scheduleCleanup(rippleTimer)
      }

      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('mahin-portfolio-theme', newTheme)
        }
      } catch {
        // localStorage may be unavailable in some environments (incognito, etc.)
      }

      const animTimer = window.setTimeout(() => setIsAnimating(false), 650)
      scheduleCleanup(animTimer)
    },
    [isDark, setTheme]
  )

  if (!mounted) {
    return (
      <button
        aria-hidden="true"
        tabIndex={-1}
        className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center text-mute rounded-full cursor-wait"
      >
        <Moon className="w-4 h-4" />
      </button>
    )
  }

  return (
    <button
      ref={btnRef}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-pressed={isDark}
      role="button"
      type="button"
      className={`group relative w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center overflow-hidden rounded-full focus-visible:outline-none transition-all duration-400 ease-out hover:shadow-[0_0_0_1px_var(--glass-border),0_4px_18px_-4px_rgba(61,220,151,0.35)] active:scale-[0.92] ${
        isDark
          ? 'text-orange hover:text-orange-hover hover:bg-orange/10'
          : 'text-green hover:text-green-hover hover:bg-green/10'
      }`}
    >
      {/* Gradient wash that flashes on toggle */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-full transition-opacity duration-500 ${
          isAnimating
            ? isDark
              ? 'bg-gradient-to-br from-orange/25 via-orange/10 to-transparent opacity-100'
              : 'bg-gradient-to-br from-green/25 via-green/10 to-transparent opacity-100'
            : 'opacity-0'
        }`}
      />

      {/* Click ripple rings */}
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden="true"
          className={`pointer-events-none absolute rounded-full animate-theme-ripple ${
            isDark ? 'bg-orange/35' : 'bg-green/35'
          }`}
          style={{ left: r.x, top: r.y }}
        />
      ))}

      {/* Sun (dark mode visible) — spins counter-clockwise and shrinks on transition */}
      <span
        aria-hidden="true"
        className={`absolute flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isDark
            ? 'opacity-100 rotate-0 scale-100 translate-y-0'
            : 'opacity-0 -rotate-[120deg] scale-50 -translate-y-2'
        }`}
      >
        <Sun className="w-4.5 h-4.5 drop-shadow-[0_0_6px_rgba(255,138,61,0.5)]" />
      </span>

      {/* Moon (light mode visible) — spins clockwise and rises on transition */}
      <span
        aria-hidden="true"
        className={`absolute flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          !isDark
            ? 'opacity-100 rotate-0 scale-100 translate-y-0'
            : 'opacity-0 rotate-[120deg] scale-50 translate-y-2'
        }`}
      >
        <Moon className="w-4.5 h-4.5 drop-shadow-[0_0_6px_rgba(61,220,151,0.5)]" />
      </span>

      {/* Subtle halation ring on hover */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 blur-md scale-110 transition-opacity duration-300 ${
          isDark ? 'bg-orange/40' : 'bg-green/40'
        }`}
      />
    </button>
  )
}
