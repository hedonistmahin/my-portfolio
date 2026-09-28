import { z } from 'zod'

export const ResearchInterestSchema = z.object({
  name: z.string(),
  highlight: z.boolean().default(false),
})

export const ProfileSchema = z.object({
  name: z.string(),
  initials: z.string(),
  title: z.string(),
  bioLead: z.string(),
  aboutParagraphs: z.array(z.string()),
  researchInterests: z.array(ResearchInterestSchema),
  heroFacts: z.object({
    cgpa: z.string(),
    studentsTutored: z.string(),
    clubMembersLed: z.string(),
  }),
  heroChips: z.array(z.string()),
})

export const EducationItemSchema = z.object({
  period: z.string(),
  degree: z.string(),
  institution: z.string(),
  details: z.string(),
})

export const EducationSchema = z.array(EducationItemSchema)

export const ThesisSchema = z.object({
  tag: z.string(),
  title: z.string(),
  description: z.string(),
  supervisor: z.string(),
})

export const PublicationSchema = z.object({
  title: z.string(),
  venue: z.string(),
  year: z.number(),
  status: z.enum(['indexed', 'accepted', 'under-review']),
  link: z.string().optional(),
  doi: z.string().optional(),
  pdf: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export const PublicationsSchema = z.array(PublicationSchema)

export const HighlightItemSchema = z.union([
  z.string(),
  z.object({
    text: z.string(),
    icon: z.string().optional(),
  }),
])

export const ExperienceItemSchema = z.object({
  period: z.string(),
  role: z.string(),
  organization: z.string().optional(),
  highlights: z.array(HighlightItemSchema),
})

export const ExperienceSchema = z.array(ExperienceItemSchema)

export const SkillCategorySchema = z.object({
  category: z.string(),
  skills: z.array(z.string()),
})

export const SkillsSchema = z.array(SkillCategorySchema)

export const ProjectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  detail: z.string().optional(),
})

export const ProjectsSchema = z.array(ProjectSchema)

export const ReferenceSchema = z.object({
  name: z.string(),
  role: z.string(),
  department: z.string(),
  university: z.string(),
  email: z.string().email(),
  qualification: z.string(),
  focus: z.string().optional(),
})

export const ReferencesSchema = z.array(ReferenceSchema)

export const ContactSchema = z.object({
  heading: z.string(),
  subheading: z.string(),
  email: z.string().email(),
  phone: z.string(),
  phoneFormatted: z.string(),
  address: z.string(),
  github: z.string().url(),
  githubHandle: z.string(),
  linkedin: z.string().url(),
  linkedinHandle: z.string(),
})

export const NewsItemSchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string(),
  summary: z.string(),
  link: z.string().optional(),
})

export const NewsSchema = z.array(NewsItemSchema)

export const BlogPostFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()).optional(),
})

export type Profile = z.infer<typeof ProfileSchema>
export type EducationItem = z.infer<typeof EducationItemSchema>
export type Thesis = z.infer<typeof ThesisSchema>
export type Publication = z.infer<typeof PublicationSchema>
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>
export type SkillCategory = z.infer<typeof SkillCategorySchema>
export type Project = z.infer<typeof ProjectSchema>
export type Reference = z.infer<typeof ReferenceSchema>
export type Contact = z.infer<typeof ContactSchema>
export type NewsItem = z.infer<typeof NewsItemSchema>
export type BlogPostFrontmatter = z.infer<typeof BlogPostFrontmatterSchema>
