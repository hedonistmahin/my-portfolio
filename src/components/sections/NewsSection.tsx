import { NewsItem } from '@/lib/schemas'
import { Section } from './Section'
import { GlassCard } from '@/components/ui/GlassCard'

interface NewsSectionProps {
  news: NewsItem[]
}

export function NewsSection({ news }: NewsSectionProps) {
  if (!news || news.length === 0) {
    return null
  }

  return (
    <Section id="news" title="Latest News">
      <div className="grid gap-4">
        {news.map((item) => (
          <GlassCard key={item.id} className="p-6">
            <span className="text-orange font-medium text-sm">{item.date}</span>
            <h3 className="text-xl font-heading font-semibold mt-1">{item.title}</h3>
            <p className="text-mute mt-2">{item.summary}</p>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-green underline text-sm"
              >
                Read more
              </a>
            )}
          </GlassCard>
        ))}
      </div>
    </Section>
  )
}
