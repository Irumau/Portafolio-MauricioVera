import { z } from 'zod'

// POST /api/auth/login
export const loginSchema = z.object({
  // Primero limpia (espacios y mayúsculas) y después valida el formato,
  // así " YO@Mail.com " se acepta como "yo@mail.com".
  email: z
    .string({ error: 'Ingresá un email válido' })
    .trim()
    .toLowerCase()
    .pipe(z.email('Ingresá un email válido')),
  password: z.string({ error: 'La contraseña es obligatoria' }).min(1, 'La contraseña es obligatoria'),
})
