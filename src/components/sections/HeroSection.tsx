'use client'

import { Profile, Publication } from '@/lib/schemas'
import { DropletPhoto } from '@/components/ui/DropletPhoto'
import { WaveDivider } from '@/components/ui/WaveDivider'
import { useEffect, useMemo, useRef, useState } from 'react'

interface HeroSectionProps {
  profile: Profile
  publications: Publication[]
}

/**
 * Renders a full name with intelligent wrapping:
 * - Keeps honorific prefix (Md.) glued to the following word via non-breaking space
 * - On screens <= 1023px, renders the last name on a new visual line (block span)
 *   so the final word never sits orphaned or causes horizontal overflow
 */
function formatNameForWrapping(name: string): React.ReactNode {
  const parts = name.trim().split(/\s+/)
  if (parts.length <= 1) return name

  const lastName = parts[parts.length - 1]
  const frontParts = parts.slice(0, -1)

  const front: React.ReactNode[] = []
  let i = 0
  while (i < frontParts.length) {
    const part = frontParts[i]
    if (part.match(/^[A-Z][a-z]?\.$/) && i + 1 < frontParts.length) {
      front.push(
        <span key={`nb-${i}`} className="name-part name-honorific">
          {part}
          &nbsp;
          {frontParts[i + 1]}
        </span>
      )
      i += 2
    } else {
      front.push(
        <span key={`w-${i}`} className="name-part">
          {part}
        </span>
      )
      i += 1
    }
    if (i < frontParts.length) {
      front.push(
        <span key={`sp-${i}`} className="name-space">
          &nbsp;
        </span>
      )
    }
  }

  return (
    <>
      <span className="name-front-wrap">
        <span className="name-front">{front}</span>
      </span>
      <span className="name-last-wrap">
        <span className="name-last">{lastName}</span>
      </span>
    </>
  )
}

function useCountUp(target: string | number, durationMs = 1600, delayMs = 600): string | number {
  const num = typeof target === 'string' ? parseFloat(target) : target
  const hasDecimal = typeof target === 'string' && target.includes('.')
  const decimals = hasDecimal && typeof target === 'string' ? target.split('.')[1]?.length ?? 2 : 0
  const [display, setDisplay] = useState<string | number>(target)
  const rafRef = useRef<number | null>(null)
  const startedRef = useRef<boolean>(false)

  useEffect(() => {
    if (isNaN(num)) {
      setDisplay(target)
      return
    }

    const timeout = window.setTimeout(() => {
      if (startedRef.current) return
      startedRef.current = true
      const start = performance.now()
      const from = 0

      const step = (now: number) => {
        const p = Math.min(1, (now - start) / durationMs)
        const eased = 1 - Math.pow(1 - p, 3)
        const value = from + (num - from) * eased
        const formatted = hasDecimal
          ? value.toFixed(decimals)
          : Math.round(value).toString()
        setDisplay(formatted)
        if (p < 1) {
          rafRef.current = requestAnimationFrame(step)
        }
      }

      rafRef.current = requestAnimationFrame(step)
    }, delayMs)

    return () => {
      clearTimeout(timeout)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [num, durationMs, delayMs, hasDecimal, decimals, target])

  return display
}

function FactCell({ value, label }: { value: string; label: string }) {
  const display = useCountUp(value, 1700, 700)
  return (
    <div className="hero-reveal" style={{ transitionDelay: '850ms' }}>
      <strong>{display}</strong>
      {label}
    </div>
  )
}

export function HeroSection({ profile, publications }: HeroSectionProps) {
  const paperCount = publications.length
  const paperCountStr = useMemo(() => String(paperCount), [paperCount])

  return (
    <header className="hero" id="top">
      <div className="wrap hero-grid">
        <div className="hero-title">
          <h1 className="hero-reveal" style={{ transitionDelay: '80ms' }}>
            {formatNameForWrapping(profile.name)}
          </h1>
        </div>

        <div
          id="hero-photo-container"
          className="hero-photo stage flex justify-center items-center hero-reveal"
          style={{ transitionDelay: '260ms' }}
        >
          <DropletPhoto
            src="/profile.jpg"
            alt={`Portrait of ${profile.name}`}
            initials={profile.initials}
          />
        </div>

        <div className="hero-body">
          <p className="lead hero-reveal" style={{ transitionDelay: '420ms' }}>
            {profile.bioLead}
          </p>
          <div className="btns hero-reveal" style={{ transitionDelay: '560ms' }}>
            <a className="btn pri" href="/cv.pdf" download>
              <span className="shine-layer" aria-hidden="true" />
              Download CV
            </a>
            <a className="btn gl" href="#research">
              <span className="shine-layer" aria-hidden="true" />
              Read my research
            </a>
            <a className="btn gl" href="#contact">
              <span className="shine-layer" aria-hidden="true" />
              Contact me
            </a>
          </div>
          <div className="facts glass">
            <FactCell value={profile.heroFacts.cgpa} label="B.Sc. CGPA" />
            <FactCell value={paperCountStr} label="IEEE papers" />
            <FactCell value={profile.heroFacts.studentsTutored} label="students tutored" />
            <FactCell value={profile.heroFacts.clubMembersLed} label="club members led" />
          </div>
        </div>
      </div>
      <WaveDivider />
    </header>
  )
}
