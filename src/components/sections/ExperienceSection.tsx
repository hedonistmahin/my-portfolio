import { ExperienceItem } from '@/lib/schemas'
import { Section } from './Section'
import { Timeline, TimelineHighlight } from './Timeline'

interface ExperienceSectionProps {
  experience: ExperienceItem[]
}

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  const timelineItems = experience.map((exp) => ({
    period: exp.period,
    title: exp.role,
    subtitle: exp.organization,
    highlights: exp.highlights as (string | TimelineHighlight)[],
  }))

  return (
    <Section id="experience" title="Teaching and leadership">
      <Timeline items={timelineItems} variant="orange" />
    </Section>
  )
}
