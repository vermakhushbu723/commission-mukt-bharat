import { useEffect, useRef, useState } from 'react'
import Comments from './Comments'

// Reader-submitted articles. No backend in this static build — posts (and their
// images, stored as data URLs) live in localStorage; each post keeps its own
// comment thread via a per-post storage key.
const POSTS_KEY = 'cmb-posts'
const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024 // 1.5 MB — keep localStorage happy
const MAX_VIDEO_BYTES = 6 * 1024 * 1024 // 6 MB — larger clips may not persist across reloads

const FIELD =
  'w-full bg-paper border-2 border-ink/25 rounded-sm px-4 py-3 text-ink placeholder:text-ink/40 focus:border-green focus:outline-none focus:ring-2 focus:ring-green/40 transition'

function loadPosts() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(POSTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'A'
}

/* ---------- the "write an article" composer ---------- */
function Composer({ onPublish }) {
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [image, setImage] = useState(null)
  const [video, setVideo] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef(null)
  const videoRef = useRef(null)

  function onFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError('Image is too large — please use one under 1.5 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result)
      setError('')
    }
    reader.readAsDataURL(file)
  }

  function onVideoFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('video/')) {
      setError('Please choose a video file.')
      return
    }
    if (file.size > MAX_VIDEO_BYTES) {
      setError('Video is too large — please use a clip under 6 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setVideo(reader.result)
      setError('')
    }
    reader.readAsDataURL(file)
  }

  function removeImage() {
    setImage(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  function removeVideo() {
    setVideo(null)
    if (videoRef.current) videoRef.current.value = ''
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (title.trim().length < 3) {
      setError('Please add a title (at least 3 characters).')
      return
    }
    if (body.trim().length < 5) {
      setError('Please write a little more in the body.')
      return
    }
    onPublish({
      name: name.trim() || 'Anonymous Citizen',
      title: title.trim(),
      body: body.trim(),
      image,
      video,
    })
    setName('')
    setTitle('')
    setBody('')
    removeImage()
    removeVideo()
    setError('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-paper-soft border-2 border-ink rounded-sm p-5 sm:p-7 shadow-[6px_6px_0_0_rgba(35,35,35,0.85)] mb-12"
    >
      <div className="eyebrow text-green-ink mb-4">Write an article</div>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name (optional)"
        aria-label="Your name"
        className={`${FIELD} mb-3`}
      />
      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value)
          if (error) setError('')
        }}
        placeholder="Article title"
        aria-label="Article title"
        className={`${FIELD} mb-3 font-display text-lg`}
      />
      <textarea
        value={body}
        onChange={(e) => {
          setBody(e.target.value)
          if (error) setError('')
        }}
        rows={5}
        placeholder="Tell your story — a commission you fought, a receipt you demanded, an idea for the movement…"
        aria-label="Article body"
        className={`${FIELD} mb-3`}
      />

      {/* Upload buttons — image and/or video */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-ink/30 rounded-sm px-4 py-3 hover:border-green transition">
          <span className="condensed text-xs font-semibold tracking-wider bg-ink text-paper px-4 py-2 rounded-sm">
            📷 UPLOAD IMAGE
          </span>
          <span className="text-xs text-ink/55">JPG/PNG · ≤ 1.5 MB</span>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
        </label>
        <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer border-2 border-dashed border-ink/30 rounded-sm px-4 py-3 hover:border-green transition">
          <span className="condensed text-xs font-semibold tracking-wider bg-ink text-paper px-4 py-2 rounded-sm">
            🎬 UPLOAD VIDEO
          </span>
          <span className="text-xs text-ink/55">MP4 · ≤ 6 MB</span>
          <input ref={videoRef} type="file" accept="video/*" onChange={onVideoFile} className="hidden" />
        </label>
      </div>

      {/* Image preview */}
      {image && (
        <div className="relative mb-3 border-2 border-ink rounded-sm overflow-hidden">
          <img src={image} alt="Selected preview" className="w-full max-h-72 object-cover" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 condensed text-[0.65rem] font-semibold tracking-wider bg-ink/85 text-paper px-3 py-1.5 rounded-sm hover:bg-red-700 transition"
          >
            REMOVE IMAGE
          </button>
        </div>
      )}

      {/* Video preview */}
      {video && (
        <div className="relative mb-3 border-2 border-ink rounded-sm overflow-hidden bg-black">
          <video src={video} controls className="w-full max-h-72" />
          <button
            type="button"
            onClick={removeVideo}
            className="absolute top-2 right-2 condensed text-[0.65rem] font-semibold tracking-wider bg-ink/85 text-paper px-3 py-1.5 rounded-sm hover:bg-red-700 transition"
          >
            REMOVE VIDEO
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

      <button
        type="submit"
        className="btn-sheen condensed text-sm font-semibold tracking-wider bg-green text-paper px-6 py-3 rounded-sm hover:bg-green-ink transition inline-flex items-center gap-2 shadow-[0_4px_14px_rgba(19,136,8,0.3)]"
      >
        PUBLISH ARTICLE <span aria-hidden="true" className="arrow">→</span>
      </button>
    </form>
  )
}

/* ---------- a single reader-submitted post + its comments ---------- */
function Post({ post }) {
  const hasMedia = Boolean(post.image || post.video)

  return (
    <article className="bg-paper border-2 border-ink rounded-sm overflow-hidden shadow-[6px_6px_0_0_rgba(35,35,35,0.85)] hover:shadow-[8px_8px_0_0_rgba(35,35,35,0.9)] transition-shadow">
      {/* Top: media (left) + content (right) */}
      <div className={hasMedia ? 'grid md:grid-cols-[minmax(0,42%)_1fr]' : ''}>
        {hasMedia && (
          <div className="relative border-b-2 md:border-b-0 md:border-r-2 border-ink bg-paper-soft self-stretch flex flex-col">
            {post.image && (
              <img src={post.image} alt={post.title} className="w-full h-44 sm:h-full object-cover" />
            )}
            {post.video && (
              <video src={post.video} controls className="w-full h-44 sm:h-full object-cover bg-black" />
            )}
            <span className="absolute top-3 left-3 condensed text-[0.6rem] font-bold tracking-[0.16em] uppercase bg-ink/85 text-paper px-2.5 py-1 rounded-sm">
              ✦ Reader submission
            </span>
          </div>
        )}

        <div className="p-4 sm:p-5 min-w-0">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div
              aria-hidden="true"
              className="shrink-0 w-8 h-8 rounded-full border-2 border-ink bg-gold/15 text-[0.65rem] font-display flex items-center justify-center"
            >
              {initials(post.name)}
            </div>
            <div className="leading-tight min-w-0">
              <div className="font-display text-sm truncate">{post.name}</div>
              <div className="condensed text-[0.6rem] tracking-wider text-ink/50">
                {post.dateLabel}{!hasMedia && ' · Reader submission'}
              </div>
            </div>
          </div>

          <h3 className="font-display text-xl sm:text-2xl leading-tight mb-2 text-balance">{post.title}</h3>
          <p className="text-sm sm:text-base text-ink/80 leading-relaxed whitespace-pre-wrap break-words">{post.body}</p>
        </div>
      </div>

      {/* Per-post comments + replies (full width) */}
      <div className="px-4 sm:px-5 pb-4 bg-paper-soft/60">
        <Comments storageKey={`cmb-post-comments-${post.id}`} compact />
      </div>
    </article>
  )
}

export default function CommunityPosts() {
  const [posts, setPosts] = useState(loadPosts)
  const idRef = useRef(0)

  useEffect(() => {
    try {
      window.localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
    } catch {
      /* storage full (large images) or unavailable — keep posts in memory only */
    }
  }, [posts])

  function publish(data) {
    const now = new Date()
    const post = {
      id: `p${now.getTime()}-${idRef.current++}`,
      dateLabel: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      ...data,
    }
    setPosts((prev) => [post, ...prev])
  }

  return (
    <section aria-label="Community articles" className="border-t-2 border-ink/15 pt-12 mt-16">
      <div className="reveal is-visible mb-8">
        <div className="eyebrow text-green-ink mb-4">From the community</div>
        <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-2">
          Post your <em className="text-gold-ink">article.</em>
        </h2>
        <span className="title-rule mb-5" aria-hidden="true" />
        <p className="text-sm sm:text-base text-ink/70 max-w-xl">
          Share your own story with the movement — add a photo or a video if you have one. Every post gets its own
          comment thread, so readers can reply right below it.
        </p>
      </div>

      <Composer onPublish={publish} />

      {posts.length > 0 ? (
        <ul className="space-y-10">
          {posts.map((post) => (
            <li key={post.id}>
              <Post post={post} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-ink/60 text-sm border-2 border-dashed border-rule rounded-sm py-12 text-center">
          No reader articles yet. Be the first to publish one above.
        </p>
      )}
    </section>
  )
}
