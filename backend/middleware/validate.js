import { z } from 'zod'

/*
  Middleware de validación con Zod.

  Uso en las rutas:
    router.get('/:id',   validate({ params: idParamSchema }), getProyectoById)
    router.post('/',     validate({ body: createProjectSchema }), createProyecto)
    router.patch('/:id', validate({ params: idParamSchema, body: updateProjectSchema }), updateProyecto)

  Si algo no pasa la validación, responde 400 y el controller nunca se ejecuta.
  Si todo está bien, deja los datos limpios en req.validated:
    req.validated.params  → ej. { id: 3 }   (ya convertido a número)
    req.validated.body    → el body limpio  (sin campos extra, con defaults aplicados)
*/
export const validate = (schemas) => (req, res, next) => {
  const errors = {}
  const validated = {}

  for (const part of ['params', 'body']) {
    const schema = schemas[part]
    if (!schema) continue

    const result = schema.safeParse(req[part] ?? {})

    if (result.success) {
      validated[part] = result.data
    } else {
      const { formErrors, fieldErrors } = z.flattenError(result.error)
      errors[part] = formErrors.length ? { _errors: formErrors, ...fieldErrors } : fieldErrors
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Datos inválidos',
      success: false,
      errors,
    })
  }

  req.validated = validated
  next()
}
