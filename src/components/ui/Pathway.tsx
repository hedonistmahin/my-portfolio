'use client'

import { useEffect, useState, useRef, useMemo } from 'react'

const SECTION_META: { id: string; label?: string; accent?: 'green' | 'orange' }[] = [
  { id: 'about', label: 'About', accent: 'green' },
  { id: 'education', label: 'Education', accent: 'green' },
  { id: 'research', label: 'Research', accent: 'orange' },
  { id: 'experience', label: 'Experience', accent: 'green' },
  { id: 'skills', label: 'Skills', accent: 'green' },
  { id: 'projects', label: 'Projects', accent: 'orange' },
  { id: 'references', label: 'References', accent: 'green' },
  { id: 'contact', label: 'Contact', accent: 'orange' },
]

interface SectionNode {
  id: string
  label?: string
  accent?: 'green' | 'orange'
  y: number
  x: number
  side: 'left' | 'right'
}

interface Star {
  id: number
  cx: number
  cy: number
  r: number
  delay: number
  color: 'green' | 'orange'
}

export function Pathway() {
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [pathD, setPathD] = useState<string>('')
  const [pathLength, setPathLength] = useState<number>(0)
  const [svgHeight, setSvgHeight] = useState<number>(4000)
  const [svgWidth, setSvgWidth] = useState<number>(100)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false)
  const [nodes, setNodes] = useState<SectionNode[]>([])
  const [beadPos, setBeadPos] = useState<{ x: number; y: number } | null>(null)
  const [hasHydrated, setHasHydrated] = useState<boolean>(false)
  const [viewportScrollY, setViewportScrollY] = useState<number>(0)

  const pathRef = useRef<SVGPathElement>(null)
  const layoutTickRef = useRef<number | null>(null)

  const mulberry32 = (seed: number) => {
    let a = seed >>> 0
    return function () {
      a = (a + 0x6d2b79f5) >>> 0
      let t = a
      t = Math.imul(t ^ (t >>> 15), t | 1)
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  const stars = useMemo<Star[]>(() => {
    const rand = mulberry32(133742)
    const arr: Star[] = []
    for (let i = 0; i < 22; i++) {
      arr.push({
        id: i,
        cx: 10 + rand() * 80,
        cy: 2 + rand() * 96,
        r: 0.35 + rand() * 0.85,
        delay: rand() * 3,
        color: rand() > 0.5 ? 'green' : 'orange',
      })
    }
    return arr
  }, [])

  useEffect(() => {
    setHasHydrated(true)
    setViewportScrollY(typeof window !== 'undefined' ? window.scrollY : 0)
  }, [])

  // Initialize responsive state + listen for reduced motion changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)
    const handleChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [])

  // Build SVG path geometry + node positions
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    const buildLayout = () => {
      const mobile = window.innerWidth < 820
      setIsMobile(mobile)
      setSvgHeight(Math.max(document.documentElement.scrollHeight || 4000, window.innerHeight * 3))
      setSvgWidth(mobile ? 56 : 100)

      const sectionNodes: SectionNode[] = []
      SECTION_META.forEach((meta, idx) => {
        const el = document.getElementById(meta.id)
        if (!el) return
        const rect = el.getBoundingClientRect()
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        if (mobile) {
          sectionNodes.push({
            ...meta,
            y: rect.top + scrollTop + 40,
            x: 40,
            side: idx % 2 === 0 ? 'right' : 'left',
          })
        } else {
          const isEven = idx % 2 === 0
          sectionNodes.push({
            ...meta,
            y: rect.top + scrollTop + 44,
            x: isEven ? 22 : 78,
            side: isEven ? 'left' : 'right',
          })
        }
      })

      setNodes(sectionNodes)

      if (sectionNodes.length === 0) return

      let d = ''
      if (mobile) {
        const startY = Math.max(40, sectionNodes[0].y - 80)
        const endY = sectionNodes[sectionNodes.length - 1].y + 120
        d = `M 40 ${startY} L 40 ${endY}`
      } else {
        d = `M 50 ${sectionNodes[0].y - 90} `
        sectionNodes.forEach((node, idx) => {
          const prevY = idx === 0 ? sectionNodes[0].y - 90 : sectionNodes[idx - 1].y
          const midY = (prevY + node.y) / 2
          const fromLeft = idx % 2 === 1
          const cX1 = fromLeft ? 22 : 78
          const cX2 = fromLeft ? 78 : 22
          d += `C ${cX1} ${midY}, ${cX2} ${midY}, ${node.x} ${node.y} `
        })
        // Tail past final node
        const last = sectionNodes[sectionNodes.length - 1]
        const fromLeft = sectionNodes.length % 2 === 0
        d += `C ${fromLeft ? 78 : 22} ${last.y + 60}, 50 ${last.y + 110}, 50 ${last.y + 160} `
      }

      setPathD(d)
    }

    buildLayout()

    const debounced = () => {
      if (layoutTickRef.current !== null) cancelAnimationFrame(layoutTickRef.current)
      layoutTickRef.current = requestAnimationFrame(buildLayout)
    }

    window.addEventListener('resize', debounced, { passive: true })
    window.addEventListener('load', debounced)
    const t = setTimeout(buildLayout, 250)

    return () => {
      if (layoutTickRef.current !== null) cancelAnimationFrame(layoutTickRef.current)
      window.removeEventListener('resize', debounced)
      window.removeEventListener('load', debounced)
      clearTimeout(t)
    }
  }, [])

  // Compute path length once pathD changes
  useEffect(() => {
    if (pathRef.current) {
      try {
        setPathLength(pathRef.current.getTotalLength())
      } catch {
        // ignore
      }
    }
  }, [pathD])

  // Track scroll + compute bead position along the path
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined' || typeof document === 'undefined') return
      const scrollY = window.scrollY + window.innerHeight * 0.25
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight * 0.5
      const progress = maxScroll > 0 ? Math.min(Math.max(scrollY / maxScroll, 0), 1) : 0
      setScrollProgress(progress)
      setViewportScrollY(window.scrollY)

      if (pathRef.current && pathLength > 0) {
        try {
          const pt = pathRef.current.getPointAtLength(pathLength * progress)
          setBeadPos({ x: pt.x, y: pt.y })
        } catch {
          // ignore
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathLength])

  const strokeDashoffset = isReducedMotion ? 0 : pathLength * (1 - scrollProgress)

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
    >
      <svg
        className="w-full h-full animate-pathway-drift"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="none"
      >
        <defs>
          {/* Primary path gradient — top green → bottom orange */}
          <linearGradient id="pathGradientMain" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--green)" stopOpacity="0.95" />
            <stop offset="52%" stopColor="#7ee3b9" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--orange)" stopOpacity="0.95" />
          </linearGradient>

          {/* Soft outer glow */}
          <filter id="pathGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.2" result="blur1" />
            <feGaussianBlur stdDeviation="3" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Strong bead glow */}
          <filter id="beadGlow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial stop for beads */}
          <radialGradient id="beadGradient" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="40%" stopColor="var(--green)" />
            <stop offset="100%" stopColor="var(--orange)" />
          </radialGradient>
        </defs>

        {/* Ambient twinkling stars scattered around the path */}
        {!isReducedMotion &&
          stars.map((s) => (
            <circle
              key={s.id}
              cx={`${s.cx}%`}
              cy={`${s.cy}%`}
              r={s.r * (isMobile ? 0.7 : 1)}
              fill={s.color === 'green' ? 'var(--green)' : 'var(--orange)'}
              opacity="0.5"
              style={{
                transformOrigin: `${s.cx}% ${s.cy}%`,
                animation: `twinkle ${2.4 + (s.id % 5) * 0.35}s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}

        {/* ── DASHED BACKGROUND TRACK ─────────────────────────────── */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="var(--glass-border)"
            strokeWidth={isMobile ? '2' : '1'}
            strokeDasharray={isMobile ? '3 6' : '2 7'}
            strokeLinecap="round"
            opacity="0.8"
          />
        )}

        {/* Subtle secondary thicker track underneath the reveal */}
        {pathD && (
          <path
            d={pathD}
            fill="none"
            stroke="url(#pathGradientMain)"
            strokeWidth={isMobile ? '4.5' : '2.2'}
            strokeLinecap="round"
            opacity="0.14"
          />
        )}

        {/* ── SCROLL-REVEALED GLOWING PATH ────────────────────────── */}
        {pathD && (
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="url(#pathGradientMain)"
            strokeWidth={isMobile ? '2.6' : '1.3'}
            strokeLinecap="round"
            filter="url(#pathGlow)"
            strokeDasharray={pathLength || 99999}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: isReducedMotion ? 'none' : 'stroke-dashoffset 180ms linear' }}
          />
        )}

        {/* ── SECTION NODE MARKERS + LABELS ───────────────────────── */}
        {nodes.map((node, idx) => {
          const progress =
            pathLength > 0
              ? Math.min(1, Math.max(0, 1 - (node.y - (scrollProgress * svgHeight + 0)) / svgHeight))
              : 0
          const reached = hasHydrated
            ? progress > 0 || node.y <= viewportScrollY + window.innerHeight * 0.7
            : progress > 0
          const isOrange = node.accent === 'orange'

          return (
            <g
              key={node.id}
              style={{
                transition: 'opacity 400ms ease-out, transform 400ms ease-out',
                transform: reached ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.9)',
                opacity: reached ? 1 : 0.25,
              }}
            >
              {/* Outer pulsing ring */}
              {!isReducedMotion && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isMobile ? 3.2 : 2.2}
                  fill="none"
                  stroke={isOrange ? 'var(--orange)' : 'var(--green)'}
                  strokeWidth="0.6"
                  style={{
                    transformOrigin: `${node.x}px ${node.y}px`,
                    animation: `pulse-ring ${2 + (idx % 3) * 0.3}s ease-in-out infinite`,
                    opacity: reached ? 0.75 : 0.2,
                  }}
                />
              )}

              {/* Core bead */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isMobile ? 2.2 : 1.6}
                fill={isOrange ? 'var(--orange)' : 'var(--green)'}
                stroke="var(--bg)"
                strokeWidth={isMobile ? '0.8' : '0.55'}
                style={{
                  filter: reached
                    ? `drop-shadow(0 0 ${isMobile ? '5px' : '3px'} ${isOrange ? 'rgba(255,138,61,0.7)' : 'rgba(61,220,151,0.7)'})`
                    : 'none',
                }}
              />

              {/* Tick mark pointing outward */}
              <line
                x1={node.x}
                y1={node.y}
                x2={node.side === 'left' ? node.x - (isMobile ? 10 : 14) : node.x + (isMobile ? 10 : 14)}
                y2={node.y}
                stroke={isOrange ? 'var(--orange)' : 'var(--green)'}
                strokeWidth="0.6"
                strokeLinecap="round"
                opacity={reached ? 0.55 : 0.2}
              />

              {/* Section label */}
              {node.label && (
                <text
                  x={node.side === 'left' ? node.x - (isMobile ? 14 : 20) : node.x + (isMobile ? 14 : 20)}
                  y={node.y + (isMobile ? 1.2 : 0.8)}
                  fontSize={isMobile ? 3.2 : 2.35}
                  fontFamily="var(--font-dm-sans), system-ui, sans-serif"
                  fontWeight="500"
                  fill={reached ? (isOrange ? 'var(--orange)' : 'var(--green)') : 'var(--mute)'}
                  opacity={reached ? 0.92 : 0.35}
                  textAnchor={node.side === 'left' ? 'end' : 'start'}
                  dominantBaseline="middle"
                  style={{
                    transition: 'fill 500ms ease-out, opacity 500ms ease-out',
                    letterSpacing: '0.01em',
                  }}
                >
                  {node.label}
                </text>
              )}
            </g>
          )
        })}

        {/* ── MOVING PROGRESS BEAD ────────────────────────────────── */}
        {!isReducedMotion && beadPos && pathLength > 0 && (
          <g style={{ transition: 'opacity 300ms ease-out' }}>
            {/* Fuzzy outer halo */}
            <circle
              cx={beadPos.x}
              cy={beadPos.y}
              r={isMobile ? 9 : 5.5}
              fill="url(#beadGradient)"
              opacity="0.22"
            />
            {/* Glow core */}
            <circle
              cx={beadPos.x}
              cy={beadPos.y}
              r={isMobile ? 5 : 3}
              fill="url(#beadGradient)"
              filter="url(#beadGlow)"
            />
            {/* Bright center specular */}
            <circle
              cx={beadPos.x - (isMobile ? 1.2 : 0.7)}
              cy={beadPos.y - (isMobile ? 1.2 : 0.7)}
              r={isMobile ? 1.5 : 0.9}
              fill="#ffffff"
              opacity="0.85"
            />
          </g>
        )}
      </svg>
    </div>
  )
}
