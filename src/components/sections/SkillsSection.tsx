import { SkillCategory } from '@/lib/schemas'
import { Section } from './Section'
import { GlassCard } from '@/components/ui/GlassCard'

interface SkillsSectionProps {
  skills: SkillCategory[]
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <Section id="skills" title="Technical skills">
      <GlassCard className="skills">
        <dl>
          {skills.map((item, index) => (
            <div key={index}>
              <dt>{item.category}</dt>
              <dd>{item.skills.join(', ')}</dd>
            </div>
          ))}
        </dl>
      </GlassCard>
    </Section>
  )
}
