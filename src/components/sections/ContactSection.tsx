'use client'

import { useState } from 'react'
import { Contact } from '@/lib/schemas'
import { Section } from './Section'
import { GlassCard } from '@/components/ui/GlassCard'
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Copy,
  Check,
  Download,
  Send,
  ExternalLink,
} from 'lucide-react'

interface ContactSectionProps {
  contact: Contact
}

type CopyState = 'idle' | 'copied'

function useCopyToClipboard() {
  const [status, setStatus] = useState<CopyState>('idle')

  const copy = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand('copy')
        } finally {
          textArea.remove()
        }
      }
      setStatus('copied')
      window.setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('idle')
    }
  }

  return { status, copy }
}

function EmailBox({ email }: { email: string }) {
  const { status, copy } = useCopyToClipboard()

  return (
    <div className="relative w-full group">
      <div
        className="absolute -inset-px rounded-2xl bg-gradient-to-r from-green/40 via-[#17a3a3]/30 to-orange/40 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"
        aria-hidden="true"
      />
      <div className="relative flex flex-col sm:flex-row items-stretch gap-3 p-4 sm:p-3 rounded-2xl bg-gradient-to-br from-green/10 via-white/5 to-orange/10 border border-green/25 backdrop-blur-xl">
        <div className="flex items-center gap-3 flex-1 min-w-0 pl-2">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-green to-[#17a3a3] flex items-center justify-center shadow-[0_0_20px_rgba(61,220,151,0.35)]">
            <Mail className="w-5 h-5 text-[#04231a]" strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-mute/80 mb-0.5">
              Email Address
            </p>
            <p
              className="font-mono text-[0.95rem] sm:text-base font-semibold text-foam truncate select-all"
              title={email}
            >
              {email}
            </p>
          </div>
        </div>

        <div className="flex items-stretch gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => copy(email)}
            aria-label={status === 'copied' ? 'Email copied to clipboard' : 'Copy email to clipboard'}
            className={`relative flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-5 min-h-[48px] rounded-xl font-semibold text-sm overflow-hidden transition-all duration-300 ease-out will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] ${
              status === 'copied'
                ? 'bg-green text-[#04231a] shadow-[0_8px_24px_-10px_rgba(61,220,151,0.75)] scale-[1.02]'
                : 'bg-white/7 border border-white/15 text-foam hover:bg-white/12 hover:border-green/45 hover:text-green hover:scale-[1.03] active:scale-[0.99]'
            }`}
          >
            <span className="shine-layer" aria-hidden="true" />
            {status === 'copied' ? (
              <>
                <Check className="w-[18px] h-[18px]" strokeWidth={2.8} />
                <span className="relative z-10">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" strokeWidth={2} />
                <span className="relative z-10">Copy</span>
              </>
            )}
          </button>

          <a
            href={`mailto:${email}`}
            className="flex-1 sm:flex-none relative inline-flex items-center justify-center gap-2 px-5 sm:px-6 min-h-[48px] rounded-xl font-semibold text-sm bg-gradient-to-br from-orange to-[#ff7422] text-[#22110a] hover:from-orange-hover hover:to-[#ff893d] shadow-[0_10px_28px_-12px_rgba(255,138,61,0.9)] transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-0.5 active:scale-[0.99] active:translate-y-0 overflow-hidden isolation-isolate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
            aria-label="Send email via default mail client"
          >
            <span className="shine-layer" aria-hidden="true" />
            <span className="relative z-10 inline-flex items-center gap-2">
              <Send className="w-4 h-4" strokeWidth={2.2} />
              Email Me
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}

interface ContactItemCardProps {
  icon: React.ReactNode
  iconBgClass: string
  iconShadowClass: string
  label: string
  value: string
  href?: string
  isExternal?: boolean
  externalAriaLabel?: string
}

function ContactItemCard({
  icon,
  iconBgClass,
  iconShadowClass,
  label,
  value,
  href,
  isExternal,
  externalAriaLabel,
}: ContactItemCardProps) {
  const content = (
    <div className="relative flex items-start gap-4 p-4 rounded-xl bg-white/4 border border-white/10 backdrop-blur-lg transition-all duration-350 ease-out group hover:bg-white/7 hover:border-green/35 hover:shadow-[0_14px_38px_-18px_rgba(61,220,151,0.45)] hover:-translate-y-1">
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${iconBgClass} ${iconShadowClass}`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider text-mute/75 mb-1">
          {label}
        </p>
        <div className="flex items-center gap-2 min-w-0">
          <p
            className={`text-[0.93rem] font-medium text-foam truncate ${
              href ? 'group-hover:text-green transition-colors duration-300' : ''
            }`}
            title={value}
          >
            {value}
          </p>
          {href && isExternal && (
            <ExternalLink
              className="w-3.5 h-3.5 flex-shrink-0 text-mute/60 group-hover:text-green/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
              strokeWidth={2}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        aria-label={externalAriaLabel}
        className="block min-h-0"
      >
        {content}
      </a>
    )
  }

  return content
}

export function ContactSection({ contact }: ContactSectionProps) {
  return (
    <Section id="contact">
      <GlassCard className="contact overflow-visible">
        <div className="space-y-5 sm:space-y-6">
          <div>
            <h2>{contact.heading}</h2>
            <p className="sub !mb-0" style={{ color: 'var(--mute)' }}>
              {contact.subheading}
            </p>
          </div>

          <EmailBox email={contact.email} />

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              className="btn gl"
              href="/cv.pdf"
              download
              aria-label="Download curriculum vitae PDF"
            >
              <span className="shine-layer" aria-hidden="true" />
              <span className="relative z-10 inline-flex items-center gap-2">
                <Download className="w-4 h-4" strokeWidth={2} />
                Download CV
              </span>
            </a>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4">
          <ContactItemCard
            icon={<Phone className="w-[18px] h-[18px] text-[#22110a]" strokeWidth={2.2} />}
            iconBgClass="bg-gradient-to-br from-orange to-[#ff7422]"
            iconShadowClass="shadow-[0_0_18px_rgba(255,138,61,0.45)]"
            label="Phone"
            value={contact.phone}
            href={`tel:${contact.phoneFormatted}`}
            externalAriaLabel={`Call ${contact.phone}`}
          />

          <ContactItemCard
            icon={<MapPin className="w-[18px] h-[18px] text-white" strokeWidth={2.2} />}
            iconBgClass="bg-gradient-to-br from-[#17a3a3] to-[#0d7d7d]"
            iconShadowClass="shadow-[0_0_18px_rgba(23,163,163,0.5)]"
            label="Address"
            value={contact.address}
          />

          <ContactItemCard
            icon={<Github className="w-[18px] h-[18px] text-white" strokeWidth={2} />}
            iconBgClass="bg-gradient-to-br from-[#1f2937] to-[#0f172a]"
            iconShadowClass="shadow-[0_0_18px_rgba(31,41,55,0.55)]"
            label="GitHub"
            value={contact.githubHandle}
            href={contact.github}
            isExternal
            externalAriaLabel={`Open GitHub profile: ${contact.githubHandle} (opens in new tab)`}
          />

          <ContactItemCard
            icon={<Linkedin className="w-[18px] h-[18px] text-white" strokeWidth={2.2} />}
            iconBgClass="bg-gradient-to-br from-[#0a66c2] to-[#004182]"
            iconShadowClass="shadow-[0_0_18px_rgba(10,102,194,0.55)]"
            label="LinkedIn"
            value={contact.linkedinHandle}
            href={contact.linkedin}
            isExternal
            externalAriaLabel={`Open LinkedIn profile: ${contact.linkedinHandle} (opens in new tab)`}
          />
        </div>
      </GlassCard>
    </Section>
  )
}
