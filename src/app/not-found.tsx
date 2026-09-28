import Link from 'next/link'
import { GlassCard } from '@/components/ui/GlassCard'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="min-h-screen py-24 px-4 flex items-center justify-center">
      <GlassCard className="p-10 max-w-md text-center">
        <h1 className="text-4xl font-heading mb-3">404 - Page Not Found</h1>
        <p className="text-mute mb-6 text-sm">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-green text-deep font-semibold text-sm hover:bg-green-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </Link>
      </GlassCard>
    </main>
  )
}
