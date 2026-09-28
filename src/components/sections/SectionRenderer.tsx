import { getEnabledSections, SectionConfig } from '@/config/sections'
import {
  Profile,
  EducationItem,
  Thesis,
  Publication,
  ExperienceItem,
  SkillCategory,
  Project,
  Reference,
  Contact,
  NewsItem,
} from '@/lib/schemas'
import { AboutSection } from './AboutSection'
import { EducationSection } from './EducationSection'
import { PublicationsSection } from './PublicationsSection'
import { ExperienceSection } from './ExperienceSection'
import { SkillsSection } from './SkillsSection'
import { ProjectsSection } from './ProjectsSection'
import { ReferencesSection } from './ReferencesSection'
import { ContactSection } from './ContactSection'
import { NewsSection } from './NewsSection'

interface SectionRendererProps {
  profile: Profile
  education: EducationItem[]
  thesis: Thesis
  publications: Publication[]
  experience: ExperienceItem[]
  skills: SkillCategory[]
  projects: Project[]
  references: Reference[]
  contact: Contact
  news: NewsItem[]
}

export function SectionRenderer(props: SectionRendererProps) {
  const enabledSections = getEnabledSections()

  const renderSectionComponent = (section: SectionConfig) => {
    switch (section.id) {
      case 'about':
        return <AboutSection key={section.id} profile={props.profile} />
      case 'education':
        return (
          <EducationSection
            key={section.id}
            education={props.education}
            thesis={props.thesis}
          />
        )
      case 'research':
        return (
          <PublicationsSection
            key={section.id}
            publications={props.publications}
          />
        )
      case 'experience':
        return (
          <ExperienceSection
            key={section.id}
            experience={props.experience}
          />
        )
      case 'skills':
        return <SkillsSection key={section.id} skills={props.skills} />
      case 'projects':
        return <ProjectsSection key={section.id} projects={props.projects} />
      case 'references':
        return (
          <ReferencesSection
            key={section.id}
            references={props.references}
          />
        )
      case 'news':
        return <NewsSection key={section.id} news={props.news} />
      case 'contact':
        return <ContactSection key={section.id} contact={props.contact} />
      default:
        return null
    }
  }

  return <>{enabledSections.map(renderSectionComponent)}</>
}
