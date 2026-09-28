import { Profile } from '@/lib/schemas'
import { Section } from './Section'
import { GlassCard } from '@/components/ui/GlassCard'

interface AboutSectionProps {
  profile: Profile
}

export function AboutSection({ profile }: AboutSectionProps) {
  return (
    <Section id="about" title="About">
      <div className="about">
        <div>
          {profile.aboutParagraphs.map((para, index) => (
            <p key={index}>{para}</p>
          ))}
        </div>
        <GlassCard className="panel">
          <h3>Research interests</h3>
          <div className="tags">
            {profile.researchInterests.map((interest) => (
              <span key={interest.name} className={interest.highlight ? 'o' : undefined}>
                {interest.name}
              </span>
            ))}
          </div>
        </GlassCard>
      </div>
    </Section>
  )
}
