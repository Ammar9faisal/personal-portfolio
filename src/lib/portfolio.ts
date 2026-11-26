import type { Project, VerifiedLink } from "../data/portfolio";

export function verifiedUrl(link?: VerifiedLink): string | undefined {
  if (link?.verified !== true) return;
  try {
    const url = new URL(link.url);
    if (url.protocol === "https:" && !url.username && !url.password) return url.href;
  } catch { /* Missing or malformed destinations remain unavailable. */ }
}

export function projectLinks(project: Project) {
  return ([['github', 'GitHub'], ['demo', 'Live demo'], ['devpost', 'Devpost']] as const).flatMap(([key, label]) => {
    const href = verifiedUrl(project.links?.[key]);
    return href ? [{ key, label, href }] : [];
  });
}

export function filterProjects(projects: Project[], query: string, status: string) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return projects.filter(project => {
    const text = [project.name, project.category, project.summary, project.detail, project.context,
      project.problem, project.contribution, project.outcome, ...project.stack, ...(project.workflow || []),
      ...(project.challenges || []).flatMap(item => [item.challenge, item.solution])].join(' ').toLowerCase();
    return (status === "All projects" || project.status === status) && terms.every(term => text.includes(term));
  });
}

export function projectsForSkill(skill: string, projects: Project[]) {
  const name = skill.toLowerCase();
  return projects.filter(project => project.status === "Completed" && project.stack.some(tech => {
    const item = tech.toLowerCase();
    return item === name || item.startsWith(`${name} `);
  }));
}

export function verifiedEmail(email?: { address: string; verified: true }) {
  if (email?.verified && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.address)) return `mailto:${email.address}`;
}
