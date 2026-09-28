export interface SectionConfig {
  id: string
  title: string
  component?: string
  enabled: boolean
  order: number
  isExternalRoute?: boolean
  href?: string
}

export const SECTION_REGISTRY: SectionConfig[] = [
  {
    id: 'about',
    title: 'About',
    component: 'AboutSection',
    enabled: true,
    order: 1,
  },
  {
    id: 'education',
    title: 'Education',
    component: 'EducationSection',
    enabled: true,
    order: 2,
  },
  {
    id: 'research',
    title: 'Research',
    component: 'PublicationsSection',
    enabled: true,
    order: 3,
  },
  {
    id: 'experience',
    title: 'Experience',
    component: 'ExperienceSection',
    enabled: true,
    order: 4,
  },
  {
    id: 'skills',
    title: 'Skills',
    component: 'SkillsSection',
    enabled: true,
    order: 5,
  },
  {
    id: 'projects',
    title: 'Projects',
    component: 'ProjectsSection',
    enabled: true,
    order: 6,
  },
  {
    id: 'references',
    title: 'References',
    component: 'ReferencesSection',
    enabled: true,
    order: 7,
  },
  {
    id: 'blog',
    title: 'Blog',
    enabled: true,
    order: 8,
    isExternalRoute: true,
    href: '/blog',
  },
  {
    id: 'news',
    title: 'News',
    component: 'NewsSection',
    enabled: false,
    order: 9,
  },
  {
    id: 'contact',
    title: 'Contact',
    component: 'ContactSection',
    enabled: true,
    order: 10,
  },
]

export function getEnabledSections(): SectionConfig[] {
  return SECTION_REGISTRY.filter((section) => section.enabled && section.component).sort(
    (a, b) => a.order - b.order
  )
}
