import { labelFor, parseFilters } from '../data/projects.js';
import { withBasePath } from '../../lib/appPaths.js';

export function ProjectCard({ project }) {
  const query = new URLSearchParams(parseFilters(window.location.search)).toString();
  const meta = project.meta || [
    labelFor('industry', project.industry),
    labelFor('style', project.style),
    labelFor('budget', project.budgetRange),
  ].join(' / ');

  return (
    <div className="project-card" role="listitem">
      <a
        className="project-card-link"
        href={withBasePath(`${project.url}${query ? `?${query}` : ''}`)}
        aria-label={`${project.title} 프로젝트 자세히 보기`}
      >
        <div className="project-image">
          <img
            src={project.thumbnail}
            alt={`${project.title} 콘셉트 프로젝트 이미지`}
            loading="lazy"
            decoding="async"
          />
          <span className="project-hover-title" aria-hidden="true">
            {project.title}
          </span>
        </div>
        <div className="project-caption">
          <p className="project-meta">{meta}</p>
          <h3 className="project-title">{project.title}</h3>
          <p className="project-summary">{project.summary}</p>
        </div>
      </a>
    </div>
  );
}

export default ProjectCard;
