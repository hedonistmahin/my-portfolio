import Link from 'next/link'
import {
  getProfile,
  getEducation,
  getThesis,
  getPublications,
  getExperience,
  getSkills,
  getProjects,
  getReferences,
  getContact,
  getNews,
  getBlogPosts,
} from '@/lib/content'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { SectionRenderer } from '@/components/sections/SectionRenderer'
import { Pathway } from '@/components/ui/Pathway'
import { GlassCard } from '@/components/ui/GlassCard'

export default function HomePage() {
  const profile = getProfile()
  const education = getEducation()
  const thesis = getThesis()
  const publications = getPublications()
  const experience = getExperience()
  const skills = getSkills()
  const projects = getProjects()
  const references = getReferences()
  const contact = getContact()
  const news = getNews()
  const blogPosts = getBlogPosts()

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen">
        <Pathway />
        <HeroSection profile={profile} publications={publications} />
        <main className="relative z-10">
          <SectionRenderer
            profile={profile}
            education={education}
            thesis={thesis}
            publications={publications}
            experience={experience}
            skills={skills}
            projects={projects}
            references={references}
            contact={contact}
            news={news}
          />

          {/* Render Latest Writing Strip ONLY when at least 1 post exists */}
          {blogPosts.length > 0 && (
            <section id="blog-strip">
              <div className="wrap">
                <h2>Latest writing</h2>
                <div className="grid gap-4 mt-6">
                  {blogPosts.slice(0, 3).map((post) => (
                    <GlassCard key={post.slug} className="p-6">
                      <span className="text-xs text-orange font-mono">
                        {post.frontmatter.date}
                      </span>
                      <h3 className="text-xl font-heading font-semibold mt-1">
                        <Link href={`/blog/${post.slug}`} className="hover:text-green">
                          {post.frontmatter.title}
                        </Link>
                      </h3>
                      <p className="text-mute text-sm mt-2">
                        {post.frontmatter.excerpt}
                      </p>
                    </GlassCard>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
      <Footer />
    </>
  )
}
