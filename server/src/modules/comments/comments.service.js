import { Comment } from '../../models/Comment.js'
import { Post } from '../../models/Post.js'
import { Like } from '../../models/Like.js'
import { notFound, forbidden, badRequest } from '../../utils/errors.js'

const MAX_DEPTH = 3 // matches the frontend's 3-level reply nesting

export async function addComment(postId, authorId, { body, parentId, anonymous }) {
  const post = await Post.findOne({ _id: postId, status: 'active' })
  if (!post) throw notFound('Post not found')

  let parent = null
  let ancestors = []
  let depth = 0
  if (parentId) {
    parent = await Comment.findOne({ _id: parentId, post: postId, status: 'active' })
    if (!parent) throw notFound('Parent comment not found')
    if (parent.depth + 1 > MAX_DEPTH) throw badRequest('Maximum reply depth reached', 'MAX_DEPTH')
    ancestors = [...parent.ancestors, parent._id]
    depth = parent.depth + 1
  }

  const comment = await Comment.create({
    post: postId,
    author: authorId,
    anonymous: !!anonymous,
    body,
    parent: parent?._id || null,
    ancestors,
    depth,
  })
  await Post.updateOne({ _id: postId }, { $inc: { commentCount: 1 } })
  return comment.populate('author', 'username displayName avatarUrl role')
}

// Returns the flat list of active comments for a post, oldest-first. The client
// rebuilds the tree from parentId (cheap; threads are small).
export async function listForPost(postId) {
  const post = await Post.findOne({ _id: postId, status: 'active' }).select('_id')
  if (!post) throw notFound('Post not found')
  return Comment.find({ post: postId, status: 'active' })
    .sort({ createdAt: 1 })
    .populate('author', 'username displayName avatarUrl role')
}

export async function removeComment(id, viewer) {
  const comment = await Comment.findById(id)
  if (!comment || comment.status !== 'active') throw notFound('Comment not found')
  if (String(comment.author) !== String(viewer.id) && viewer.role !== 'admin') {
    throw forbidden('Not your comment')
  }
  comment.status = 'removed'
  await comment.save()
  await Post.updateOne({ _id: comment.post, commentCount: { $gt: 0 } }, { $inc: { commentCount: -1 } })
  await Like.deleteMany({ targetType: 'comment', target: id })
}
