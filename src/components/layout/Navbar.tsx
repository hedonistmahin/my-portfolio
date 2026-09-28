'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown, Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

interface NavItem {
  id: string
  title: string
  href: string
}

const MAIN_NAV_ITEMS: NavItem[] = [
  { id: 'top', title: 'Home', href: '/#top' },
  { id: 'about', title: 'About', href: '/#about' },
  { id: 'education', title: 'Education', href: '/#education' },
  { id: 'publications', title: 'Publications', href: '/#research' },
  { id: 'skills', title: 'Skills', href: '/#skills' },
  { id: 'blog', title: 'Blog', href: '/blog' },
]

const MORE_NAV_ITEMS: NavItem[] = [
  { id: 'research', title: 'Research', href: '/#research' },
  { id: 'experience', title: 'Experience', href: '/#experience' },
  { id: 'projects', title: 'Projects', href: '/#projects' },
  { id: 'references', title: 'References', href: '/#references' },
  { id: 'contact', title: 'Contact', href: '/#contact' },
]

const ALL_MOBILE_ITEMS: NavItem[] = [
  { id: 'top', title: 'Home', href: '/#top' },
  { id: 'about', title: 'About', href: '/#about' },
  { id: 'education', title: 'Education', href: '/#education' },
  { id: 'research', title: 'Research', href: '/#research' },
  { id: 'publications', title: 'Publications', href: '/#research' },
  { id: 'experience', title: 'Experience', href: '/#experience' },
  { id: 'projects', title: 'Projects', href: '/#projects' },
  { id: 'skills', title: 'Skills', href: '/#skills' },
  { id: 'references', title: 'References', href: '/#references' },
  { id: 'blog', title: 'Blog', href: '/blog' },
  { id: 'contact', title: 'Contact', href: '/#contact' },
]

const MORE_SECTION_TO_MAIN_INDICATOR: Record<string, string> = {
  research: 'publications',
  experience: 'publications',
  projects: 'skills',
  references: 'blog',
  contact: 'blog',
}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const isHomePage = pathname === '/'

  const [activeSection, setActiveSection] = useState<string>('top')
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [isScrolled, setIsScrolled] = useState<boolean>(false)
  const [showAvatar, setShowAvatar] = useState<boolean>(!isHomePage)
  const [avatarError, setAvatarError] = useState<boolean>(false)
  const [isMoreOpen, setIsMoreOpen] = useState<boolean>(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [drawerMounted, setDrawerMounted] = useState<boolean>(false)
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 })
  const scrollLockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLAnchorElement>(null)
  const navContainerRef = useRef<HTMLDivElement>(null)
  const navItemRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())

  useEffect(() => {
    if (isMobileMenuOpen) {
      setDrawerMounted(true)
    }
  }, [isMobileMenuOpen])

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const parts = href.split('#')
    const hasHash = parts.length > 1
    const hash = hasHash ? parts[1] : ''
    const pathPart = parts[0]

    const externalRoute = !isHomePage && pathPart === '/'
    const nonHashRoute = !hash && !pathPart.startsWith('/blog') && !pathPart.startsWith('/projects') && !pathPart.startsWith('/research')
    const externalBaseRoute = pathPart && pathPart !== '/' && !pathPart.includes('blog') && !pathPart.includes('projects') && !pathPart.includes('research')
    const justPath = !hash

    if (externalRoute || nonHashRoute || externalBaseRoute || justPath) {
      setIsMobileMenuOpen(false)
      setIsMoreOpen(false)
      if (!hash && (pathPart.startsWith('/blog') || pathPart.startsWith('/projects'))) {
        const segmentKey = pathPart.startsWith('/blog') ? 'blog' : pathPart.startsWith('/projects') ? 'projects' : 'research'
        setActiveSection(segmentKey)
        if (scrollLockTimerRef.current) clearTimeout(scrollLockTimerRef.current)
        scrollLockTimerRef.current = setTimeout(() => { scrollLockTimerRef.current = null }, 900)
      }
      router.push(href)
      return
    }

    if (hash) {
      setActiveSection(hash)
      if (scrollLockTimerRef.current) clearTimeout(scrollLockTimerRef.current)
      scrollLockTimerRef.current = setTimeout(() => {
        scrollLockTimerRef.current = null
      }, 900)
    }

    const targetEl = document.getElementById(hash)
    if (targetEl) {
      setIsMobileMenuOpen(false)
      setIsMoreOpen(false)
      const navHeight = window.innerWidth < 640 ? 72 : 88
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight
      window.scrollTo({ top: targetPosition, behavior: 'smooth' })
    } else if (href.startsWith('/')) {
      setIsMobileMenuOpen(false)
      setIsMoreOpen(false)
      router.push(href)
    }
  }

  // Track scroll progress & header scroll state
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? (currentScrollY / maxScroll) * 100 : 0
      setScrollProgress(progress)
      setIsScrolled(currentScrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // IntersectionObserver to show avatar when hero photo is out of viewport on homepage
  useEffect(() => {
    if (!isHomePage) {
      setShowAvatar(true)
      return
    }

    const heroPhotoEl = document.getElementById('hero-photo-container')
    if (!heroPhotoEl) {
      // Fallback: check scroll Y position
      const handleScrollFallback = () => {
        setShowAvatar(window.scrollY > 300)
      }
      window.addEventListener('scroll', handleScrollFallback, { passive: true })
      handleScrollFallback()
      return () => window.removeEventListener('scroll', handleScrollFallback)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show avatar in navbar when hero photo is NOT intersecting viewport
        setShowAvatar(!entry.isIntersecting)
      },
      {
        rootMargin: '-80px 0px 0px 0px',
        threshold: 0.1,
      }
    )

    observer.observe(heroPhotoEl)
    return () => observer.disconnect()
  }, [isHomePage])

  // ScrollSpy for active link - reliable scroll position based approach
  useEffect(() => {
    if (!isHomePage) {
      if (pathname.startsWith('/blog')) {
        setActiveSection('blog')
      } else if (pathname.startsWith('/research')) {
        setActiveSection('research')
      }
      return
    }

    const sectionIds = [
      'top',
      'about',
      'education',
      'research',
      'experience',
      'skills',
      'projects',
      'references',
      'contact',
    ]

    const handleScrollSpy = () => {
      if (scrollLockTimerRef.current) return
      const navHeight = window.innerWidth < 640 ? 72 : 96
      const scrollY = window.scrollY + navHeight - 12

      let currentSection = sectionIds[0]
      let closestTop = -Infinity

      sectionIds.forEach((id) => {
        const el = document.getElementById(id)
        if (el) {
          const elTop = el.offsetTop
          if (elTop <= scrollY && elTop > closestTop) {
            closestTop = elTop
            currentSection = id
          }
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScrollSpy, { passive: true })
    handleScrollSpy()
    return () => window.removeEventListener('scroll', handleScrollSpy)
  }, [isHomePage, pathname])

  // Mobile menu scroll lock & keyboard event listeners
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.touchAction = 'none'
      const timer = setTimeout(() => {
        firstFocusableRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    } else {
      document.body.style.overflow = ''
      document.body.style.touchAction = ''
      const t = setTimeout(() => setDrawerMounted(false), 300)
      return () => clearTimeout(t)
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMoreOpen(false)
        setIsMobileMenuOpen(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const updateIndicator = useCallback(() => {
    const containerEl = navContainerRef.current
    if (!containerEl) return

    let indicatorSection = activeSection
    if (indicatorSection === 'publications') indicatorSection = 'research'

    const isInMoreNav = MORE_NAV_ITEMS.some((m) => m.id === indicatorSection)

    if (isInMoreNav) {
      indicatorSection = MORE_SECTION_TO_MAIN_INDICATOR[indicatorSection] || indicatorSection
    }

    if (indicatorSection === 'research') indicatorSection = 'publications'

    const activeEl = navItemRefs.current.get(indicatorSection) || null

    if (activeEl && containerEl) {
      const containerRect = containerEl.getBoundingClientRect()
      const elRect = activeEl.getBoundingClientRect()
      const left = elRect.left - containerRect.left + 16
      const width = Math.max(elRect.width - 32, 20)
      setIndicatorStyle({ left, width })
    }
  }, [activeSection])

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      updateIndicator()
    })
    return () => cancelAnimationFrame(rafId)
  }, [updateIndicator])

  useEffect(() => {
    const handleResize = () => updateIndicator()
    window.addEventListener('resize', handleResize)
    const timer = setTimeout(updateIndicator, 100)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timer)
    }
  }, [isHomePage, updateIndicator])

  // Click handler for Brand Wordmark / Avatar
  const handleLogoClick = (e: React.MouseEvent) => {
    setActiveSection('top')
    if (scrollLockTimerRef.current) clearTimeout(scrollLockTimerRef.current)
    scrollLockTimerRef.current = setTimeout(() => { scrollLockTimerRef.current = null }, 900)
    if (isHomePage) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      router.push('/')
    }
  }

  return (
    <>
      {/* Mobile Drawer Backdrop - placed OUTSIDE header to escape any stacking context */}
      {drawerMounted && (
        <div
          aria-hidden="true"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`lg:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />
      )}

      <header
        aria-label="Main Navigation"
        className={`fixed top-0 left-0 right-0 z-[70] w-full h-[64px] sm:h-[80px] bg-[var(--nav-bg)] backdrop-blur-xl border-b border-[var(--nav-border)] transition-all duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) ${
          isScrolled ? 'shadow-[0_10px_40px_-20px_rgba(61,220,151,0.35)] h-[60px] sm:h-[72px] bg-[var(--nav-bg)]/95' : ''
        }`}
      >
        <div className="max-w-[1200px] h-full mx-auto px-4 sm:px-6 flex items-center justify-between transition-all duration-500 ease-out">
          {/* Left: Avatar + Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-3 group focus-visible:outline-none text-left transition-transform duration-300 ease-out hover:scale-[1.01] active:scale-[0.98]"
              aria-label="Scroll to top"
              role="button"
              type="button"
            >
              {/* Normal static navbar profile avatar (no animations) */}
              <div
                className={`relative overflow-hidden rounded-full border-2 border-green transition-all duration-500 ease-out ${
                  showAvatar
                    ? 'opacity-100 scale-100 w-9 h-9 sm:w-11 sm:h-11'
                    : 'opacity-0 scale-75 w-0 h-9 sm:h-11 pointer-events-none'
                }`}
              >
                {!avatarError ? (
                  <Image
                    src="/profile.jpg"
                    alt="Md. Modabbir Hossain Mahin"
                    fill
                    className="object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-green/20 text-green font-bold text-xs flex items-center justify-center">
                    MM
                  </div>
                )}
              </div>

              {/* Wordmark 1.5rem — static text, no animations */}
              <span className="font-heading font-semibold text-xl sm:text-[1.5rem] text-foam group-hover:text-green transition-colors tracking-tight">
                Mahin
              </span>
            </button>
          </div>

          {/* Center: Desktop Nav Links (1rem text size, generous spacing) */}
          <div className="hidden lg:flex items-center gap-2 relative" ref={navContainerRef}>
            {MAIN_NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id || (item.id === 'publications' && activeSection === 'research')
              return (
                <a
                  key={item.id}
                  ref={(el) => {
                    if (el) {
                      navItemRefs.current.set(item.id, el)
                    }
                  }}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className={`relative px-4 py-2 text-[1rem] font-medium min-h-[44px] inline-flex items-center transition-all duration-300 ease-out will-change-transform ${
                    isActive
                      ? 'text-foam font-semibold scale-[1.04]'
                      : 'text-mute hover:text-foam hover:scale-[1.02]'
                  }`}
                >
                  <span className="nav-hover-pill" />
                  <span className="relative z-10">{item.title}</span>
                </a>
              )
            })}

            {/* Sliding Indicator */}
            <span
              className="absolute bottom-1 h-[3px] bg-gradient-to-r from-green via-teal to-orange rounded-full active-indicator-glow pointer-events-none"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                transition: 'left 520ms cubic-bezier(0.2, 0.8, 0.2, 1), width 420ms cubic-bezier(0.2, 0.8, 0.2, 1)',
                backgroundSize: '200% 100%',
                animation: 'gradient-flow 4s ease infinite, indicator-pulse 2.6s ease-in-out infinite',
              }}
            />

            {/* More Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsMoreOpen((prev) => !prev)}
                aria-expanded={isMoreOpen}
                aria-haspopup="true"
                aria-label="More navigation items"
                role="button"
                type="button"
                className="relative px-4 py-2 text-[1rem] font-medium inline-flex items-center gap-1.5 focus-visible:outline-none min-h-[44px] transition-all duration-300 ease-out will-change-transform text-mute hover:text-foam hover:scale-[1.02]"
              >
                <span className="nav-hover-pill" />
                <span className="relative z-10 flex items-center gap-1.5">More</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ease-out ${
                    isMoreOpen ? 'rotate-180 text-orange' : ''
                  }`}
                />
              </button>

              {isMoreOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-52 rounded-2xl p-2 bg-[var(--bg)] border border-[var(--glass-border)] backdrop-blur-2xl shadow-2xl flex flex-col gap-1 z-50 animate-drop-in"
                >
                  {MORE_NAV_ITEMS.map((item, idx) => {
                    const isActive = activeSection === item.id
                    return (
                      <a
                        key={item.id}
                        href={item.href}
                        role="menuitem"
                        onClick={(e) => {
                          setIsMoreOpen(false)
                          handleSmoothScroll(e, item.href)
                        }}
                        style={{ animationDelay: `${idx * 35}ms` }}
                        className={`relative px-4 py-3 rounded-xl text-[0.95rem] font-medium transition-all duration-260 ease-out flex items-center justify-between min-h-[44px] overflow-hidden ${
                          isActive
                            ? 'bg-green/15 text-green font-semibold'
                            : 'text-mute hover:text-foam hover:bg-white/8 hover:translate-x-0.5'
                        }`}
                      >
                        <span className="relative z-10">{item.title}</span>
                        {isActive && <span className="w-2 h-2 rounded-full bg-green shadow-[0_0_10px_rgba(61,220,151,0.6)]" />}
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Actions: Theme Toggle & Download CV */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <a
              href="/cv.pdf"
              download
              className="hidden sm:inline-flex relative items-center justify-center px-6 py-3 rounded-full text-sm font-semibold bg-orange text-[#22110a] hover:bg-orange-hover transition-all duration-300 ease-out shadow-[0_8px_24px_-12px_rgba(255,138,61,0.8)] min-h-[44px] hover:scale-[1.04] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 overflow-hidden isolation-isolate"
            >
              <span className="relative z-10">Download CV</span>
              <span className="shine-layer" />
            </a>

            {/* Mobile Hamburger Button */}
            <button
              data-mobile-menu-btn
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              role="button"
              type="button"
              className="lg:hidden relative w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-foam hover:text-green rounded-full focus-visible:outline-none transition-all duration-300 ease-out hover:bg-white/8 hover:scale-105 active:scale-95"
            >
              <span className="sr-only">
                {isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              </span>
              <div className="relative w-6 h-6 flex items-center justify-center">
                <X className={`w-6 h-6 absolute transition-all duration-300 ease-out ${isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'}`} />
                <Menu className={`w-6 h-6 absolute transition-all duration-300 ease-out ${isMobileMenuOpen ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Scroll Progress Line at Bottom Edge */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 overflow-hidden">
          <div
            className="h-full scroll-progress-animated transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      {/* Mobile Drawer Panel - separate from header stacking context */}
      {drawerMounted && (
        <div
          id="mobile-navigation-drawer"
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className={`lg:hidden fixed inset-x-0 top-[64px] sm:top-[80px] bottom-0 z-[65] flex flex-col will-change-transform transition-transform duration-400 cubic-bezier(0.2, 0.8, 0.2, 1) ${
            isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain bg-[var(--bg)] backdrop-blur-2xl border-t border-[var(--glass-border)] shadow-2xl">
            <div className="max-w-[560px] mx-auto px-5 sm:px-6 py-6 sm:py-8 flex flex-col gap-2">
              {ALL_MOBILE_ITEMS.map((item, idx) => {
                const isActive = activeSection === item.id || (item.id === 'publications' && activeSection === 'research')
                const entranceDelay = isMobileMenuOpen ? idx * 45 + 80 : 0
                return (
                  <a
                    key={item.id}
                    ref={idx === 0 ? firstFocusableRef : undefined}
                    href={item.href}
                    onClick={(e) => {
                      handleSmoothScroll(e, item.href)
                    }}
                    style={{
                      animation: isMobileMenuOpen
                        ? `stagger-item-rise 480ms cubic-bezier(0.2, 0.8, 0.2, 1) ${entranceDelay}ms both`
                        : undefined,
                    }}
                    className={`group relative px-5 py-4 rounded-2xl text-lg font-medium transition-all duration-300 ease-out min-h-[52px] flex items-center justify-between overflow-hidden ${
                      isActive
                        ? 'bg-green/15 text-green font-semibold shadow-[inset_0_0_0_1px_rgba(61,220,151,0.3)]'
                        : 'text-mute hover:text-foam hover:bg-white/7 hover:translate-x-1'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ease-out ${
                        isActive ? 'bg-green scale-125 shadow-[0_0_10px_rgba(61,220,151,0.7)]' : 'bg-mute/40 scale-75 group-hover:bg-foam/60 group-hover:scale-100'
                      }`} />
                      <span className="transition-transform duration-300 ease-out group-hover:translate-x-0.5">{item.title}</span>
                    </span>
                    {isActive && <span className="w-2.5 h-2.5 rounded-full bg-green shadow-[0_0_12px_rgba(61,220,151,0.6)] animate-pulse" />}
                  </a>
                )
              })}
            </div>
          </div>

          {/* Mobile Drawer Footer - CV download */}
          <div className="border-t border-[var(--glass-border)] bg-[var(--nav-bg)] backdrop-blur-xl">
            <div className="max-w-[560px] mx-auto px-5 sm:px-6 py-4 sm:py-5">
              <a
                href="/cv.pdf"
                download
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full relative py-4 rounded-full text-center font-semibold bg-orange text-[#22110a] hover:bg-orange-hover transition-all duration-300 ease-out min-h-[52px] flex items-center justify-center text-base shadow-[0_10px_32px_-14px_rgba(255,138,61,0.9)] hover:scale-[1.015] hover:-translate-y-0.5 active:scale-[0.99] overflow-hidden isolation-isolate"
                style={{
                  animation: isMobileMenuOpen
                    ? 'stagger-item-rise 520ms cubic-bezier(0.2, 0.8, 0.2, 1) 580ms both'
                    : undefined,
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="transition-transform duration-300 ease-out">⬇</span>
                  Download CV
                </span>
                <span className="shine-layer" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
