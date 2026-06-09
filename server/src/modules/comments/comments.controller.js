import { z } from 'zod'
import * as comments from './comments.service.js'
import * as likes from '../../modules/likes/likes.service.js'
import { serializeComment } from '../../utils/serialize.js'

export const addCommentSchema = z.object({
  body: z.string().trim().min(2).max(4000),
  parentId: z.string().optional(),
  anonymous: z.boolean().optional(),
})

export async function add(req, res) {
  const comment = await comments.addComment(req.params.id, req.user.id, req.body)
  res.status(201).json({ comment: serializeComment(comment, { viewer: req.user, liked: false }) })
}

export async function list(req, res) {
  const docs = await comments.listForPost(req.params.id)
  const likedIds = await likes.likedSet(req.user?.id, 'comment', docs.map((d) => d._id))
  res.json({
    comments: docs.map((d) =>
      serializeComment(d, { viewer: req.user, liked: likedIds.has(String(d._id)) }),
    ),
  })
}

export async function remove(req, res) {
  await comments.removeComment(req.params.id, req.user)
  res.json({ ok: true })
}

export async function likeComment(req, res) {
  const likeCount = await likes.like(req.user.id, 'comment', req.params.id)
  res.json({ liked: true, likeCount })
}

export async function unlikeComment(req, res) {
  const likeCount = await likes.unlike(req.user.id, 'comment', req.params.id)
  res.json({ liked: false, likeCount })
}
