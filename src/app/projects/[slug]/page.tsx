import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjects, getProjectBySlug } from '@/lib/content'
import { GlassCard } from '@/components/ui/GlassCard'
import { ArrowLeft, ExternalLink, Github } from 'lucide-react'

export async function generateStaticParams() {
  const projects = getProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params
  const project = getProjectBySlug(resolvedParams.slug)

  if (!project) {
    notFound()
  }

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="wrap max-w-3xl mx-auto">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-mute hover:text-foam transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>

        <GlassCard className="p-8">
          <h1 className="text-3xl font-heading mb-4">{project.title}</h1>
          <p className="text-mute text-lg leading-relaxed mb-6">
            {project.description}
          </p>

          <div className="flex gap-4 border-t border-white/10 pt-6">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-green text-deep font-semibold text-sm hover:bg-green-hover transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-foam text-sm hover:bg-white/20 transition-colors"
              >
                <Github className="w-4 h-4" /> View Source on GitHub
              </a>
            )}
          </div>
        </GlassCard>
      </div>
    </main>
  )
}
