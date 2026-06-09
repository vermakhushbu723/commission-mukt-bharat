import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { requireAuth } from '../../middleware/auth.js'
import { writeLimiter } from '../../middleware/rateLimit.js'
import * as cm from './comments.controller.js'

// Operations on an existing comment by id (post-scoped create/list live under
// /posts/:id/comments in posts.routes.js).
const router = Router()

router.delete('/:id', requireAuth, asyncHandler(cm.remove))
router.post('/:id/like', requireAuth, writeLimiter, asyncHandler(cm.likeComment))
router.delete('/:id/like', requireAuth, asyncHandler(cm.unlikeComment))

export default router
