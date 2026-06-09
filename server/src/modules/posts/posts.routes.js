import { Router } from 'express'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { validate } from '../../middleware/validate.js'
import { requireAuth, optionalAuth } from '../../middleware/auth.js'
import { writeLimiter } from '../../middleware/rateLimit.js'
import * as p from './posts.controller.js'
import * as cm from '../comments/comments.controller.js'

const router = Router()

// Feed + single post are readable logged-out (optionalAuth → liked/isOwner flags
// resolve when a token is present).
router.get('/', optionalAuth, validate(p.feedQuerySchema, 'query'), asyncHandler(p.feed))
router.post('/', requireAuth, writeLimiter, validate(p.createPostSchema), asyncHandler(p.create))
router.get('/:id', optionalAuth, asyncHandler(p.getOne))
router.patch('/:id', requireAuth, validate(p.updatePostSchema), asyncHandler(p.update))
router.delete('/:id', requireAuth, asyncHandler(p.remove))

router.post('/:id/like', requireAuth, writeLimiter, asyncHandler(p.likePost))
router.delete('/:id/like', requireAuth, asyncHandler(p.unlikePost))

// Per-post comment thread.
router.get('/:id/comments', optionalAuth, asyncHandler(cm.list))
router.post(
  '/:id/comments',
  requireAuth,
  writeLimiter,
  validate(cm.addCommentSchema),
  asyncHandler(cm.add),
)

export default router
