import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { validate } from '../../middleware/validate.js'
import { requireAuth } from '../../middleware/auth.js'
import { otpRequestLimiter, otpVerifyLimiter } from '../../middleware/rateLimit.js'
import * as c from './auth.controller.js'

const router = Router()

router.post('/otp/request', otpRequestLimiter, validate(c.requestOtpSchema), asyncHandler(c.requestOtp))
router.post('/otp/verify', otpVerifyLimiter, validate(c.verifyOtpSchema), asyncHandler(c.verifyOtp))
router.post('/refresh', validate(c.refreshSchema), asyncHandler(c.refresh))
router.post('/logout', asyncHandler(c.logout))
router.post('/profile', requireAuth, validate(c.profileSchema), asyncHandler(c.updateProfile))
router.get('/me', requireAuth, asyncHandler(c.me))

export default router
