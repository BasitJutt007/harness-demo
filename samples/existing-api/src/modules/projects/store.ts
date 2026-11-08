import { randomUUID } from 'node:crypto';
import { paginate } from '../../lib/pagination.ts';
import type { CreateProject, ListProjectsQuery, Project, ProjectPage, UpdateProject } from './schema.ts';

const projects = new Map<string, Project>();
const sortKey = (project: Project): string => `${project.createdAt}|${project.id}`;
export function listProjects(query: ListProjectsQuery): ProjectPage {
  const values = [...projects.values()].filter((project) => query.status === undefined || project.status === query.status);
  return paginate(values, query, sortKey);
}
export function getProject(id: string): Project | undefined { return projects.get(id); }
export function createProject(input: CreateProject): Project {
  const now = new Date().toISOString();
  const project: Project = { id: randomUUID(), ...input, createdAt: now, updatedAt: now };
  projects.set(project.id, project); return project;
}
export function updateProject(id: string, patch: UpdateProject): Project | undefined {
  const current = projects.get(id); if (current === undefined) return undefined;
  const updated: Project = { ...current, ...patch, updatedAt: new Date().toISOString() };
  projects.set(id, updated); return updated;
}
export function deleteProject(id: string): boolean { return projects.delete(id); }
