import { Like } from '../../models/Like.js'
import { Post } from '../../models/Post.js'
import { Comment } from '../../models/Comment.js'

const modelFor = { post: Post, comment: Comment }

// Toggle-safe like/unlike. Returns the new likeCount. The unique index on Like
// guarantees idempotency under races (duplicate insert just throws E11000).
export async function like(userId, targetType, targetId) {
  try {
    await Like.create({ user: userId, targetType, target: targetId })
    await modelFor[targetType].updateOne({ _id: targetId }, { $inc: { likeCount: 1 } })
  } catch (err) {
    if (err?.code !== 11000) throw err // already liked — no-op
  }
  return currentCount(targetType, targetId)
}

export async function unlike(userId, targetType, targetId) {
  const removed = await Like.findOneAndDelete({ user: userId, targetType, target: targetId })
  if (removed) {
    await modelFor[targetType].updateOne(
      { _id: targetId, likeCount: { $gt: 0 } },
      { $inc: { likeCount: -1 } },
    )
  }
  return currentCount(targetType, targetId)
}

async function currentCount(targetType, targetId) {
  const doc = await modelFor[targetType].findById(targetId).select('likeCount')
  return doc?.likeCount || 0
}

// Which of the given target ids has this user liked? Returns a Set of id strings.
export async function likedSet(userId, targetType, targetIds) {
  if (!userId || !targetIds.length) return new Set()
  const likes = await Like.find({ user: userId, targetType, target: { $in: targetIds } }).select('target')
  return new Set(likes.map((l) => String(l.target)))
}
