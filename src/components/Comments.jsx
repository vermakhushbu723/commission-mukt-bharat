import { useEffect, useRef, useState } from 'react'

// Client-only threaded comments. No backend in this static build — comments live in
// React state and persist to localStorage so they survive reloads. Each thread is
// isolated by `storageKey`, so every article/post keeps its own conversation.

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

function loadComments(storageKey, seed) {
  if (typeof window === 'undefined') return seed
  try {
    const raw = window.localStorage.getItem(storageKey)
    return raw ? JSON.parse(raw) : seed
  } catch {
    return seed
  }
}

/* ---------- a single comment form (used for top-level + replies) ---------- */
function CommentForm({ onSubmit, onCancel, compact = false, isReply = false, autoFocus = false }) {
  const [name, setName] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    if (autoFocus && ref.current) ref.current.focus()
  }, [autoFocus])

  function handleSubmit(e) {
    e.preventDefault()
    if (body.trim().length < 2) {
      setError('Please write a comment.')
      return
    }
    onSubmit({ name: name.trim() || 'Anonymous Citizen', body: body.trim() })
    setName('')
    setBody('')
    setError('')
  }

  const field =
    'w-full bg-paper border-2 border-ink/25 rounded-sm px-4 py-2.5 text-ink placeholder:text-ink/40 focus:border-green focus:outline-none focus:ring-2 focus:ring-green/40 transition'

  return (
    <form onSubmit={handleSubmit} className={compact ? 'mt-3' : 'mb-10'}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name (optional)"
        aria-label="Your name"
        className={`${field} mb-2`}
      />
      <textarea
        ref={ref}
        value={body}
        onChange={(e) => {
          setBody(e.target.value)
          if (error) setError('')
        }}
        rows={compact ? 2 : 3}
        placeholder={isReply ? 'Write a reply…' : 'Add a comment — keep it sharp, keep it civil.'}
        aria-label={isReply ? 'Your reply' : 'Your comment'}
        className={field}
      />
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
      <div className="flex items-center gap-2 mt-2.5">
        <button
          type="submit"
          className="btn-sheen condensed text-xs font-semibold tracking-wider bg-green text-paper px-5 py-2.5 rounded-sm hover:bg-green-ink transition shadow-[0_4px_14px_rgba(19,136,8,0.3)]"
        >
          {isReply ? 'REPLY' : 'POST COMMENT'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="condensed text-xs font-semibold tracking-wider text-ink/60 px-3 py-2.5 rounded-sm hover:text-ink transition"
          >
            CANCEL
          </button>
        )}
      </div>
    </form>
  )
}

/* ---------- a comment node + its replies (recursive) ---------- */
function Comment({ node, depth, onReply }) {
  const [replying, setReplying] = useState(false)

  return (
    <li className="article-in">
      <div className="flex gap-3">
        <div
          aria-hidden="true"
          className="shrink-0 w-9 h-9 rounded-full border-2 border-ink bg-paper-soft text-[0.7rem] font-display flex items-center justify-center"
        >
          {initials(node.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display text-base leading-none">{node.name}</span>
            <span className="condensed text-[0.65rem] tracking-wider text-ink/50">{node.time}</span>
          </div>
          <p className="text-sm sm:text-base text-ink/85 leading-relaxed mt-1.5 whitespace-pre-wrap break-words">
            {node.body}
          </p>

          {depth < 3 && (
            <button
              type="button"
              onClick={() => setReplying((v) => !v)}
              className="condensed text-[0.7rem] font-semibold tracking-wider text-green-ink hover:text-ink transition mt-2"
            >
              {replying ? 'CANCEL' : 'REPLY'}
            </button>
          )}

          {replying && (
            <CommentForm
              compact
              isReply
              autoFocus
              onSubmit={(data) => {
                onReply(node.id, data)
                setReplying(false)
              }}
              onCancel={() => setReplying(false)}
            />
          )}

          {node.replies?.length > 0 && (
            <ul className="mt-5 space-y-5 border-l-2 border-rule pl-4 sm:pl-5">
              {node.replies.map((child) => (
                <Comment key={child.id} node={child} depth={depth + 1} onReply={onReply} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  )
}

/* ---------- recursively insert a reply under the matching id ---------- */
function addReply(nodes, parentId, reply) {
  return nodes.map((n) => {
    if (n.id === parentId) return { ...n, replies: [...n.replies, reply] }
    if (n.replies?.length) return { ...n, replies: addReply(n.replies, parentId, reply) }
    return n
  })
}

function countAll(nodes) {
  return nodes.reduce((sum, n) => sum + 1 + countAll(n.replies || []), 0)
}

export default function Comments({ storageKey = 'cmb-comments', seed = [], compact = false }) {
  const [comments, setComments] = useState(() => loadComments(storageKey, seed))
  const idRef = useRef(0)

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(comments))
    } catch {
      /* storage may be unavailable (private mode) — fail silently */
    }
  }, [storageKey, comments])

  const newId = () => `c${Date.now()}-${idRef.current++}`

  const addComment = (data) =>
    setComments((prev) => [{ id: newId(), time: 'just now', replies: [], ...data }, ...prev])

  const reply = (parentId, data) =>
    setComments((prev) => addReply(prev, parentId, { id: newId(), time: 'just now', replies: [], ...data }))

  const total = countAll(comments)

  if (compact) {
    return (
      <section aria-label="Comments" className="mt-6 pt-5 border-t border-rule">
        <div className="flex items-center gap-2 mb-4">
          <span className="condensed text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-green-ink">
            💬 Comments
          </span>
          <span className="condensed text-[0.7rem] tracking-wider text-ink/45">
            {total} {total === 1 ? 'comment' : 'comments'}
          </span>
        </div>
        <CommentForm onSubmit={addComment} compact />
        {comments.length > 0 && (
          <ul className="space-y-6 mt-6">
            {comments.map((node) => (
              <Comment key={node.id} node={node} depth={0} onReply={reply} />
            ))}
          </ul>
        )}
      </section>
    )
  }

  return (
    <section aria-label="Comments" className="border-t-2 border-ink/15 pt-12 mt-16">
      <div className="reveal is-visible">
        <div className="eyebrow text-green-ink mb-4">Discussion</div>
        <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-2">
          Join the <em className="text-gold-ink">conversation.</em>
        </h2>
        <p className="text-sm text-ink/70 mb-8">
          {total} {total === 1 ? 'comment' : 'comments'} · Be sharp, be civil, name names where it counts.
        </p>

        <CommentForm onSubmit={addComment} />

        {comments.length > 0 ? (
          <ul className="space-y-8">
            {comments.map((node) => (
              <Comment key={node.id} node={node} depth={0} onReply={reply} />
            ))}
          </ul>
        ) : (
          <p className="text-ink/60 text-sm border-2 border-dashed border-rule rounded-sm py-10 text-center">
            No comments yet. Be the first to speak up.
          </p>
        )}
      </div>
    </section>
  )
}
