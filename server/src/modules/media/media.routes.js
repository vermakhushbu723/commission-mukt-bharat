import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { validate } from '../../middleware/validate.js'
import { requireAuth } from '../../middleware/auth.js'
import { writeLimiter } from '../../middleware/rateLimit.js'
import * as c from './media.controller.js'

const router = Router()

router.post('/presign', requireAuth, writeLimiter, validate(c.presignSchema), asyncHandler(c.presign))

export default router
