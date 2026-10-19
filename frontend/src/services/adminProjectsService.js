import { request } from './api.js'

// Rutas del panel. Todas mandan el token (auth: true).
export const adminProjects = {
  list: ({ signal } = {}) => request('/admin/projects', { signal, auth: true }),
  create: (data) => request('/admin/projects', { method: 'POST', body: data, auth: true }),
  update: (id, data) => request(`/admin/projects/${id}`, { method: 'PATCH', body: data, auth: true }),
  remove: (id) => request(`/admin/projects/${id}`, { method: 'DELETE', auth: true }),

  // Portada: el archivo viaja como multipart/form-data en el campo "cover"
  uploadCover: (id, file) => {
    const form = new FormData()
    form.append('cover', file)
    return request(`/admin/projects/${id}/cover`, { method: 'POST', body: form, auth: true })
  },
  removeCover: (id) => request(`/admin/projects/${id}/cover`, { method: 'DELETE', auth: true }),
}
