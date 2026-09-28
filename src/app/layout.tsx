import type { Metadata, Viewport } from 'next'
import { DM_Sans, Newsreader } from 'next/font/google'
import './globals.css'
import { Blobs } from '@/components/ui/Blobs'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { getProfile, getContact } from '@/lib/content'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600'],
  display: 'swap',
})

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mahin-portfolio.vercel.app'
const profile = getProfile()
const contact = getContact()

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#04161c' },
    { media: '(prefers-color-scheme: light)', color: '#eef8f5' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} | ${profile.title}`,
    template: `%s | ${profile.name}`,
  },
  description:
    'Portfolio of Md. Modabbir Hossain Mahin, CSE graduate and AI researcher working on explainable AI, federated learning and clinical decision support.',
  keywords: [
    'Md. Modabbir Hossain Mahin',
    'AI Researcher',
    'Explainable AI',
    'Federated Learning',
    'Clinical Decision Support',
    'Lecturer Applicant',
    'State University of Bangladesh',
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    title: `${profile.name} | AI Researcher`,
    description:
      'Explainable AI, federated learning and clinical decision support.',
    url: siteUrl,
    siteName: profile.name,
    type: 'website',
    images: [
      {
        url: `${siteUrl}/profile.jpg`,
        width: 800,
        height: 800,
        alt: `Portrait of ${profile.name}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} | AI Researcher`,
    description:
      'Explainable AI, federated learning and clinical decision support.',
    images: [`${siteUrl}/profile.jpg`],
  },
  alternates: {
    canonical: siteUrl,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    email: contact.email,
    alumniOf: 'State University of Bangladesh',
    sameAs: [contact.github, contact.linkedin],
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${newsreader.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <Blobs />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
