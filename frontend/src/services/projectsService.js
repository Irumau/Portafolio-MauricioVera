import { request } from './api.js'

/*
  Forma de cada proyecto que devuelve el backend:
  { id, title, slug, summary, description, tech: [], repoUrl, demoUrl,
    cover, featured, status, order, createdAt, updatedAt }
*/

// Público: solo publicados, ya ordenados por el backend (destacados primero).
export function getProjects({ signal } = {}) {
  return request('/projects', { signal })
}
