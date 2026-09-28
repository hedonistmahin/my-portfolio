import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBlogPosts, getBlogPostBySlug } from '@/lib/content'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { GlassCard } from '@/components/ui/GlassCard'
import { ArrowLeft } from 'lucide-react'

// Dynamic params এবং Dynamic rendering হ্যান্ডলিং
export const dynamic = 'force-static'
export const dynamicParams = false

export async function generateStaticParams() {
  try {
    const posts = getBlogPosts() || []

    // যদি কোনো পোস্ট না থাকে, তবে একটি ফলব্যাক স্লগ রিটার্ন করবে যেন বিল্ড না আটকে যায়
    if (!posts || posts.length === 0) {
      return [{ slug: 'default' }]
    }

    return posts.map((post) => ({
      slug: String(post.slug),
    }))
  } catch (error) {
    console.error('Error loading blog posts for generateStaticParams:', error)
    return [{ slug: 'default' }]
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params
  const post = getBlogPostBySlug(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen py-16 px-4">
      <div className="wrap max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-mute hover:text-foam transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        <article>
          <header className="mb-8">
            <span className="text-xs text-orange font-mono">{post.frontmatter.date}</span>
            <h1 className="text-3xl sm:text-4xl font-heading font-medium mt-2 mb-4">
              {post.frontmatter.title}
            </h1>
            {post.frontmatter.tags && (
              <div className="flex flex-wrap gap-2">
                {post.frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-mute"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          <GlassCard className="p-8 prose prose-invert max-w-none">
            <MDXRemote source={post.content} />
          </GlassCard>
        </article>
      </div>
    </main>
  )
}