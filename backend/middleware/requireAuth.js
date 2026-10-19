import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  const header = req.headers.authorization   // "Bearer eyJhbGci..."

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Necesitás iniciar sesión', success: false })
  }

  const token = header.slice(7)   // saca "Bearer " (7 caracteres)

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ message: 'La sesión expiró o no es válida', success: false })
  }
}