import { Publication } from '@/lib/schemas'
import { Section } from './Section'
import { Tag } from '@/components/ui/Tag'

interface PublicationsSectionProps {
  publications: Publication[]
}

export function PublicationsSection({ publications }: PublicationsSectionProps) {
  const indexedCount = publications.filter((p) => p.status === 'indexed').length
  const acceptedCount = publications.filter((p) => p.status === 'accepted').length

  const subtitle = `${indexedCount === 1 ? 'One paper is' : `${indexedCount} papers are`} indexed in IEEE Xplore. ${acceptedCount} more are accepted at 2026 IEEE conferences.`

  return (
    <Section id="research" title="Research and publications" subtitle={subtitle}>
      <div className="pubs">
        {publications.map((pub, index) => {
          const isIndexed = pub.status === 'indexed'
          const tagLabel = isIndexed
            ? 'Indexed in IEEE Xplore'
            : pub.status === 'accepted'
            ? `Accepted ${pub.year}`
            : `Under Review ${pub.year}`

          return (
            <article key={index} className="pub glass">
              <Tag variant={isIndexed ? 'green' : 'orange'}>{tagLabel}</Tag>
              <h3>{pub.title}</h3>
              <p>{pub.venue}</p>
            </article>
          )
        })}
      </div>
    </Section>
  )
}
