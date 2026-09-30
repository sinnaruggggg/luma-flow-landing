import ProjectCard from './ProjectCard.jsx';

// variant="featured"는 홈 화면의 비대칭 배치용입니다. 기본값은 기존 2열 그리드 그대로입니다.
export function ProjectGrid({ projects = [], variant }) {
  return (
    <div className={`project-grid${variant ? ` project-grid--${variant}` : ''}`} role="list">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export default ProjectGrid;
