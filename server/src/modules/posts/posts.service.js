import { Post } from '../../models/Post.js'
import { Comment } from '../../models/Comment.js'
import { Like } from '../../models/Like.js'
import { notFound, forbidden } from '../../utils/errors.js'

export async function createPost(authorId, { title, body, media, anonymous }) {
  return Post.create({ author: authorId, title, body, media: media || [], anonymous: !!anonymous })
}

// Cursor feed: createdAt-descending, cursor is the createdAt ISO of the last seen post.
export async function listFeed({ cursor, limit = 10 }) {
  const query = { status: 'active' }
  if (cursor) query.createdAt = { $lt: new Date(cursor) }

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .limit(limit + 1)
    .populate('author', 'username displayName avatarUrl role')

  const hasMore = posts.length > limit
  const page = hasMore ? posts.slice(0, limit) : posts
  const nextCursor = hasMore ? page[page.length - 1].createdAt.toISOString() : null
  return { posts: page, nextCursor }
}

export async function getPost(id) {
  const post = await Post.findOne({ _id: id, status: 'active' }).populate(
    'author',
    'username displayName avatarUrl role',
  )
  if (!post) throw notFound('Post not found')
  return post
}

export async function updatePost(id, viewer, patch) {
  const post = await Post.findById(id)
  if (!post || post.status !== 'active') throw notFound('Post not found')
  if (String(post.author) !== String(viewer.id) && viewer.role !== 'admin') {
    throw forbidden('Not your post')
  }
  if (patch.title !== undefined) post.title = patch.title
  if (patch.body !== undefined) post.body = patch.body
  if (patch.anonymous !== undefined) post.anonymous = patch.anonymous
  await post.save()
  return post.populate('author', 'username displayName avatarUrl role')
}

export async function removePost(id, viewer) {
  const post = await Post.findById(id)
  if (!post || post.status !== 'active') throw notFound('Post not found')
  if (String(post.author) !== String(viewer.id) && viewer.role !== 'admin') {
    throw forbidden('Not your post')
  }
  post.status = 'removed'
  await post.save()
  // Soft-remove the thread + likes too.
  await Comment.updateMany({ post: id }, { status: 'removed' })
  await Like.deleteMany({ targetType: 'post', target: id })
}
