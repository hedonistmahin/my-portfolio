import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import {
  ProfileSchema,
  EducationSchema,
  ThesisSchema,
  PublicationsSchema,
  ExperienceSchema,
  SkillsSchema,
  ProjectsSchema,
  ReferencesSchema,
  ContactSchema,
  NewsSchema,
  BlogPostFrontmatterSchema,
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
} from './schemas'

const contentDir = path.join(process.cwd(), 'content')

function readJsonFile<T>(filename: string, schema: { parse: (data: unknown) => T }): T {
  const filePath = path.join(contentDir, filename)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Content file not found: ${filePath}`)
  }
  const fileContents = fs.readFileSync(filePath, 'utf-8').trim().replace(/^\uFEFF/, '')
  if (!fileContents) {
    return schema.parse([])
  }
  const json = JSON.parse(fileContents)
  return schema.parse(json)
}

export function getProfile(): Profile {
  return readJsonFile('profile.json', ProfileSchema)
}

export function getEducation(): EducationItem[] {
  return readJsonFile('education.json', EducationSchema)
}

export function getThesis(): Thesis {
  return readJsonFile('thesis.json', ThesisSchema)
}

export function getPublications(): Publication[] {
  return readJsonFile('publications.json', PublicationsSchema)
}

export function getExperience(): ExperienceItem[] {
  return readJsonFile('experience.json', ExperienceSchema)
}

export function getSkills(): SkillCategory[] {
  return readJsonFile('skills.json', SkillsSchema)
}

export function getProjects(): Project[] {
  return readJsonFile('projects.json', ProjectsSchema)
}

export function getProjectBySlug(slug: string): Project | undefined {
  const projects = getProjects()
  return projects.find((p) => p.slug === slug)
}

export function getReferences(): Reference[] {
  return readJsonFile('references.json', ReferencesSchema)
}

export function getContact(): Contact {
  return readJsonFile('contact.json', ContactSchema)
}

export function getNews(): NewsItem[] {
  return readJsonFile('news.json', NewsSchema)
}

export interface BlogPost {
  slug: string
  frontmatter: {
    title: string
    date: string
    excerpt: string
    tags?: string[]
  }
  content: string
}

export function getBlogPosts(): BlogPost[] {
  const blogDir = path.join(contentDir, 'blog')
  if (!fs.existsSync(blogDir)) {
    return []
  }
  const files = fs.readdirSync(blogDir)
  const posts: BlogPost[] = []

  for (const filename of files) {
    if (filename.endsWith('.md') || filename.endsWith('.mdx')) {
      const slug = filename.replace(/\.mdx?$/, '')
      const fullPath = path.join(blogDir, filename)
      const fileContents = fs.readFileSync(fullPath, 'utf-8')
      if (!fileContents || !fileContents.trim()) continue
      const { data, content } = matter(fileContents)
      const parsedFrontmatter = BlogPostFrontmatterSchema.parse(data)
      posts.push({
        slug,
        frontmatter: parsedFrontmatter,
        content,
      })
    }
  }

  return posts.sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1))
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const posts = getBlogPosts()
  return posts.find((p) => p.slug === slug)
}
