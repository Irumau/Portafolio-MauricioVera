import { rateLimit } from 'express-rate-limit'

// Limita los intentos de login: 5 intentos FALLIDOS cada 15 minutos por IP.
// skipSuccessfulRequests: los logins correctos no cuentan, así que a vos no te molesta.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: true,  // manda RateLimit-* en la respuesta (cuántos intentos quedan)
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      message: 'Demasiados intentos fallidos. Probá de nuevo en 15 minutos.',
      success: false,
    })
  },
})
