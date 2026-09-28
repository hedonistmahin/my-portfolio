import { EducationItem, Thesis } from '@/lib/schemas'
import { Section } from './Section'
import { Timeline } from './Timeline'
import { GlassCard } from '@/components/ui/GlassCard'
import { Tag } from '@/components/ui/Tag'

interface EducationSectionProps {
  education: EducationItem[]
  thesis: Thesis
}

export function EducationSection({ education, thesis }: EducationSectionProps) {
  const timelineItems = education.map((edu) => ({
    period: edu.period,
    title: edu.degree,
    subtitle: `${edu.institution}. ${edu.details}`,
  }))

  return (
    <Section id="education" title="Education">
      <Timeline items={timelineItems} variant="green" />
      <GlassCard className="thesis mt-[30px]">
        <Tag>{thesis.tag}</Tag>
        <h3>{thesis.title}</h3>
        <p>{thesis.description}</p>
        <p className="sup">Supervisor: {thesis.supervisor}</p>
      </GlassCard>
    </Section>
  )
}
