import Link from 'next/link'
import { getBlogPosts } from '@/lib/content'
import { GlassCard } from '@/components/ui/GlassCard'
import { ArrowLeft } from 'lucide-react'

export default function BlogListPage() {
  const posts = getBlogPosts()

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="wrap max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-mute hover:text-foam transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Portfolio
        </Link>

        <h1 className="text-4xl font-heading mb-3">Blog & Articles</h1>
        <p className="text-mute mb-8">
          Thoughts and writings on explainable AI, federated learning, and machine learning research.
        </p>

        {posts.length === 0 ? (
          <GlassCard className="p-8 text-center text-mute">
            No articles published yet. Check back soon!
          </GlassCard>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <GlassCard key={post.slug} className="p-6">
                <span className="text-xs text-orange font-mono">{post.frontmatter.date}</span>
                <h2 className="text-2xl font-heading font-medium mt-1 mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-green transition-colors">
                    {post.frontmatter.title}
                  </Link>
                </h2>
                <p className="text-mute text-sm mb-4">{post.frontmatter.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-green text-sm font-medium hover:underline"
                >
                  Read full article →
                </Link>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
