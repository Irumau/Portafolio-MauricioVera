import { Router } from 'express'
import { login, getMe } from '../controllers/authController.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { validate } from '../middleware/validate.js'
import { loginSchema } from '../schemas/authSchema.js'
import { loginLimiter } from '../middleware/rateLimit.js'

const router = Router()

router.post('/login', loginLimiter, validate({ body: loginSchema }), login)
router.get('/me', requireAuth, getMe)

export default router