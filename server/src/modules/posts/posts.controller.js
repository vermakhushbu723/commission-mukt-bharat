import { z } from 'zod'
import * as posts from './posts.service.js'
import * as likes from '../../modules/likes/likes.service.js'
import { serializePost } from '../../utils/serialize.js'

const mediaItemSchema = z.object({
  type: z.enum(['image', 'video']),
  key: z.string().min(1),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  duration: z.number().optional(),
})

export const createPostSchema = z.object({
  title: z.string().trim().min(3).max(200),
  body: z.string().trim().min(5).max(10000),
  media: z.array(mediaItemSchema).max(4).optional(),
  anonymous: z.boolean().optional(),
})

export const updatePostSchema = z.object({
  title: z.string().trim().min(3).max(200).optional(),
  body: z.string().trim().min(5).max(10000).optional(),
  anonymous: z.boolean().optional(),
})

export const feedQuerySchema = z.object({
  cursor: z.string().datetime().optional(),
  limit: z.coerce.number().int().min(1).max(30).default(10),
})

export async function create(req, res) {
  const post = await posts.createPost(req.user.id, req.body)
  await post.populate('author', 'username displayName avatarUrl role')
  res.status(201).json({ post: serializePost(post, { viewer: req.user, liked: false }) })
}

export async function feed(req, res) {
  const { posts: page, nextCursor } = await posts.listFeed(req.query)
  const likedIds = await likes.likedSet(req.user?.id, 'post', page.map((p) => p._id))
  res.json({
    posts: page.map((p) =>
      serializePost(p, { viewer: req.user, liked: likedIds.has(String(p._id)) }),
    ),
    nextCursor,
  })
}

export async function getOne(req, res) {
  const post = await posts.getPost(req.params.id)
  const likedIds = await likes.likedSet(req.user?.id, 'post', [post._id])
  res.json({ post: serializePost(post, { viewer: req.user, liked: likedIds.has(String(post._id)) }) })
}

export async function update(req, res) {
  const post = await posts.updatePost(req.params.id, req.user, req.body)
  res.json({ post: serializePost(post, { viewer: req.user }) })
}

export async function remove(req, res) {
  await posts.removePost(req.params.id, req.user)
  res.json({ ok: true })
}

export async function likePost(req, res) {
  const likeCount = await likes.like(req.user.id, 'post', req.params.id)
  res.json({ liked: true, likeCount })
}

export async function unlikePost(req, res) {
  const likeCount = await likes.unlike(req.user.id, 'post', req.params.id)
  res.json({ liked: false, likeCount })
}
