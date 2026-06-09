// Anonymous-aware serialization. The real `author` is always stored; whether the
// viewer sees it depends on the anonymous flag + who is viewing.
//
// Visibility rules for an anonymous post/comment:
//   - admin            → sees real author (moderation/accountability)
//   - the author       → sees their own real author
//   - everyone else    → sees "Anonymous Citizen", no id/avatar leaked

const ANON = { id: null, username: null, displayName: 'Anonymous Citizen', avatarUrl: null, anonymous: true }

function authorView(authorDoc, isAnonymous, viewer) {
  const viewerId = viewer ? String(viewer.id || viewer._id) : null
  const viewerIsAdmin = viewer?.role === 'admin'
  const authorId = authorDoc ? String(authorDoc._id || authorDoc.id) : null

  if (isAnonymous && !viewerIsAdmin && viewerId !== authorId) {
    return ANON
  }
  if (!authorDoc) return ANON
  return {
    id: authorId,
    username: authorDoc.username || null,
    displayName: authorDoc.displayName || 'Citizen',
    avatarUrl: authorDoc.avatarUrl || null,
    anonymous: isAnonymous,
  }
}

export function serializeUser(u) {
  if (!u) return null
  return {
    id: String(u._id || u.id),
    phone: u.phone,
    username: u.username || null,
    displayName: u.displayName || null,
    avatarUrl: u.avatarUrl || null,
    role: u.role,
    verified: u.verified,
    profileComplete: Boolean(u.username && u.displayName),
  }
}

export function serializePost(post, { viewer, liked = false } = {}) {
  return {
    id: String(post._id),
    author: authorView(post.author, post.anonymous, viewer),
    title: post.title,
    body: post.body,
    media: post.media || [],
    likeCount: post.likeCount || 0,
    commentCount: post.commentCount || 0,
    liked,
    createdAt: post.createdAt,
    isOwner: Boolean(viewer && post.author && String(post.author._id || post.author) === String(viewer.id)),
  }
}

export function serializeComment(c, { viewer, liked = false } = {}) {
  return {
    id: String(c._id),
    postId: String(c.post),
    parentId: c.parent ? String(c.parent) : null,
    depth: c.depth || 0,
    author: authorView(c.author, c.anonymous, viewer),
    body: c.body,
    likeCount: c.likeCount || 0,
    liked,
    createdAt: c.createdAt,
    isOwner: Boolean(viewer && c.author && String(c.author._id || c.author) === String(viewer.id)),
  }
}
