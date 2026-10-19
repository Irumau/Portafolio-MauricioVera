import { z } from 'zod'

// Los nombres de los campos están en inglés para coincidir con el frontend
// (ver frontend/src/services/projectsService.js). Los mensajes de error quedan en español
// porque son los que se muestran en el panel.

// ── Piezas reutilizables ────────────────────────────────────────────

// URL opcional: acepta un link http(s), o vacío/null para "sin link".
// Los formularios mandan "" cuando el input queda vacío, por eso se acepta y se guarda como null.
const optionalUrl = (message) =>
  z
    .union([z.url({ protocol: /^https?$/, error: message }), z.literal(''), z.null()])
    .transform((value) => value || null)

// Lista de tecnologías: recorta espacios y quita repetidas ("React" y "react" cuentan como una).
const techList = z
  .array(z.string().trim().min(1, 'Hay una tecnología vacía').max(30, 'Cada tecnología puede tener hasta 30 caracteres'))
  .max(15, 'Podés cargar hasta 15 tecnologías')
  .transform((list) => {
    const seen = new Set()
    return list.filter((name) => {
      const key = name.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  })

// ── Campos del proyecto (sin valores por defecto) ───────────────────
// Se definen una sola vez y se reutilizan para crear y para editar.
const fields = {
  title: z
    .string({ error: 'El título es obligatorio' })
    .trim()
    .min(1, 'El título es obligatorio')
    .max(100, 'El título puede tener hasta 100 caracteres'),
  summary: z.string().trim().max(160, 'El resumen puede tener hasta 160 caracteres'),
  description: z.string().trim().max(10000, 'La descripción es demasiado larga'),
  tech: techList,
  repoUrl: optionalUrl('El link del repositorio no es válido'),
  demoUrl: optionalUrl('El link de la demo no es válido'),
  featured: z.boolean({ error: 'Destacado tiene que ser true o false' }),
  status: z.enum(['draft', 'published'], { error: 'El estado tiene que ser "draft" o "published"' }),
  order: z.number({ error: 'El orden tiene que ser un número' }).int('El orden tiene que ser un número entero').min(0),
}

// ── Crear: POST /api/admin/projects ─────────────────────────────────
// Solo el título es obligatorio; el resto toma un valor por defecto.
export const createProjectSchema = z.object({
  title: fields.title,
  summary: fields.summary.default(''),
  description: fields.description.default(''),
  tech: fields.tech.default([]),
  repoUrl: fields.repoUrl.default(null),
  demoUrl: fields.demoUrl.default(null),
  featured: fields.featured.default(false),
  status: fields.status.default('draft'),
  order: fields.order.optional(),
})

// ── Editar: PATCH /api/admin/projects/:id ───────────────────────────
// Todos los campos son opcionales y SIN valores por defecto,
// así un PATCH que solo manda { title } no pisa el resto de los datos.
export const updateProjectSchema = z
  .object(fields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    error: 'No mandaste ningún campo para actualizar',
  })

// ── Reordenar: PATCH /api/admin/projects/order ──────────────────────
export const reorderProjectsSchema = z
  .array(
    z.object({
      id: z.number().int().positive(),
      order: fields.order,
    }),
  )
  .min(1, 'Mandá al menos un proyecto para reordenar')

// ── Parámetros de la URL ────────────────────────────────────────────
// req.params siempre llega como texto: "3" → 3. "abc" falla.
export const idParamSchema = z.object({
  id: z.coerce.number({ error: 'El id tiene que ser un número' }).int().positive('El id tiene que ser positivo'),
})
