import { Reference } from '@/lib/schemas'
import { Section } from './Section'
import { GlassCard } from '@/components/ui/GlassCard'

interface ReferencesSectionProps {
  references: Reference[]
}

export function ReferencesSection({ references }: ReferencesSectionProps) {
  return (
    <Section id="references" title="References">
      <div className="refs">
        {references.map((ref, index) => (
          <GlassCard key={index} className="ref">
            <h3>{ref.name}</h3>
            <p className="role">{ref.role}</p>
            <dl>
              <dt>Department</dt>
              <dd>{ref.department}</dd>
              <dt>University</dt>
              <dd>{ref.university}</dd>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${ref.email}`}>{ref.email}</a>
              </dd>
              <dt>Qualification</dt>
              <dd>{ref.qualification}</dd>
              {ref.focus && (
                <>
                  <dt>Focus</dt>
                  <dd>{ref.focus}</dd>
                </>
              )}
            </dl>
          </GlassCard>
        ))}
      </div>
    </Section>
  )
}
