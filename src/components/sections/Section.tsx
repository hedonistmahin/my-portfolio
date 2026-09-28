'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

interface SectionProps {
  id: string
  title?: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export function Section({ id, title, subtitle, children, className }: SectionProps) {
  const ref = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      setRevealed(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -10% 0px' }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [id])

  return (
    <section
      ref={ref}
      id={id}
      className={`${className ?? ''} ${revealed ? 'reveal' : 'pre-reveal'}`}
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? 'translateY(0)' : 'translateY(28px)',
        filter: revealed ? 'blur(0)' : 'blur(4px)',
        transition:
          'opacity 780ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 780ms cubic-bezier(0.2, 0.8, 0.2, 1), filter 620ms ease-out',
      }}
    >
      <div className="wrap">
        {title && <h2>{title}</h2>}
        {subtitle && <p className="sub">{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}
