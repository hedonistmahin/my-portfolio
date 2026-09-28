import { Project } from '@/lib/schemas'
import { Section } from './Section'

interface ProjectsSectionProps {
  projects: Project[]
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <Section id="projects" title="Selected projects">
      <div className="projs">
        {projects.map((proj) => (
          <article key={proj.slug} className="proj glass">
            <h3>{proj.title}</h3>
            <p>{proj.description}</p>
            <div className="links">
              {proj.liveUrl && (
                <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer">
                  Live demo
                </a>
              )}
              {proj.githubUrl && (
                <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
