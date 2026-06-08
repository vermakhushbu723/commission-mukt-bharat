import { useMemo, useState } from 'react'
import { ISSUES, ISSUE_CATEGORIES, CATEGORY_LABELS } from '../data/issues'
import { SITE } from '../data/site'

const PAGE_SIZE = 6
const SORTS = [
  { key: 'top', label: 'Top' },
  { key: 'hot', label: 'Hot' },
  { key: 'new', label: 'New' },
]

/* ---------- inline icons (lucide-style, currentColor) ---------- */
const Ic = ({ children, size = 16, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
)
const ThumbsUp = (p) => (
  <Ic {...p}>
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    <path d="M7 10v12" />
  </Ic>
)
const ThumbsDown = (p) => (
  <Ic {...p}>
    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
    <path d="M17 14V2" />
  </Ic>
)
const MapPin = (p) => (
  <Ic {...p}>
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </Ic>
)
const Flame = (p) => (
  <Ic {...p}>
    <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />
  </Ic>
)
const TrendingUp = (p) => (
  <Ic {...p}>
    <path d="M16 7h6v6" />
    <path d="m22 7-8.5 8.5-5-5L2 17" />
  </Ic>
)
const Sparkles = (p) => (
  <Ic {...p}>
    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
  </Ic>
)
const Chevron = ({ dir = 'right', ...p }) => (
  <Ic {...p}>{dir === 'left' ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}</Ic>
)

/* ---------- helpers ---------- */
function severityBadge(score) {
  if (score >= 9) return { label: 'Critical', cls: 'bg-red-700 text-paper' }
  if (score >= 7) return { label: 'Serious', cls: 'bg-gold-ink text-paper' }
  if (score >= 4) return { label: 'Moderate', cls: 'bg-gold text-ink' }
  return { label: 'Minor', cls: 'bg-green/15 text-green-ink' }
}
const net = (i) => i.upvotes - i.downvotes
const hotScore = (i) => net(i) / (1 + (new Date('2026-06-06') - new Date(i.date)) / 86400000)
const initials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

function MiniList({ icon, title, hint, accent, items, numbered }) {
  return (
    <section
      aria-label={title}
      className="bg-paper-soft border-2 border-ink rounded-sm shadow-[6px_6px_0_0_rgba(35,35,35,0.85)] overflow-hidden"
    >
      <div className="flex items-center gap-2 bg-ink text-paper px-4 py-2.5">
        <span className={accent}>{icon}</span>
        <span className="condensed text-xs font-bold tracking-[0.18em] uppercase">{title}</span>
        <span className="ml-auto condensed text-[0.58rem] tracking-wider uppercase text-paper/55">{hint}</span>
      </div>
      <ul className="px-4">
        {items.map((i, idx) => (
          <li key={i.id} className="border-b border-ink/10 last:border-0">
            <a className="group flex items-start gap-2.5 py-2.5" href={`/issues/${i.id}/${i.slug}`}>
              {numbered && (
                <span className={`font-display text-lg leading-none w-4 shrink-0 text-center ${accent}`} aria-hidden="true">
                  {idx + 1}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-sm leading-snug text-ink/90 group-hover:text-gold-ink transition line-clamp-2">
                  {i.title}
                </span>
                <span className="mt-1 flex items-center gap-2 text-[0.65rem] text-ink/55">
                  <span className="condensed uppercase tracking-wider">{CATEGORY_LABELS[i.category]}</span>
                  <span className="inline-flex items-center gap-1">
                    <ThumbsUp size={11} /> {net(i)}
                  </span>
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function IssuesPage() {
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('top')
  const [page, setPage] = useState(1)
  const [votes, setVotes] = useState({}) // id -> 'up' | 'down'

  const sorted = useMemo(() => {
    const filtered = category === 'all' ? ISSUES : ISSUES.filter((i) => i.category === category)
    const cmp = {
      top: (a, b) => net(b) - net(a),
      hot: (a, b) => hotScore(b) - hotScore(a),
      new: (a, b) => new Date(b.date) - new Date(a.date),
    }[sort]
    return [...filtered].sort(cmp)
  }, [category, sort])

  const topList = useMemo(() => [...ISSUES].sort((a, b) => net(b) - net(a)).slice(0, 5), [])
  const hotList = useMemo(() => [...ISSUES].sort((a, b) => hotScore(b) - hotScore(a)).slice(0, 5), [])
  const newList = useMemo(() => [...ISSUES].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5), [])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const changeCategory = (key) => {
    setCategory(key)
    setPage(1)
  }
  const changeSort = (key) => {
    setSort(key)
    setPage(1)
  }
  const vote = (id, dir) => setVotes((prev) => ({ ...prev, [id]: prev[id] === dir ? undefined : dir }))

  return (
    <main id="main-content" className="min-h-screen bg-transparent text-ink relative">
      <section className="py-10 sm:py-14">
        <div className="max-w-3xl xl:max-w-[88rem] mx-auto px-4 sm:px-6">
          {/* ---------- Header ---------- */}
          <header className="mb-6 flex items-start justify-between gap-4 flex-wrap reveal">
            <div>
              <div className="eyebrow text-green-ink mb-2">Voice of the citizens · the real cost of every order &amp; ride</div>
              <h1 className="font-display text-4xl sm:text-5xl leading-[0.95]">
                All <em className="text-gold-ink">Issues.</em>
              </h1>
              <span className="title-rule" aria-hidden="true" />
            </div>
            <a
              className="btn-sheen condensed text-sm font-semibold tracking-wider bg-green text-paper px-5 py-2.5 rounded-sm hover:bg-green-ink transition inline-flex items-center gap-2 shadow-[0_4px_14px_rgba(19,136,8,0.3)]"
              href={`mailto:${SITE.emails.contact}?subject=Raise%20an%20issue`}
            >
              + RAISE AN QUERY
            </a>
          </header>

          {/* ---------- Category filter ---------- */}
          <nav className="flex flex-wrap gap-2 mb-6" aria-label="Issue categories">
            {[{ key: 'all', label: 'All' }, ...ISSUE_CATEGORIES].map((c) => {
              const active = category === c.key
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => changeCategory(c.key)}
                  aria-pressed={active}
                  className={`condensed text-xs font-semibold tracking-wider px-3 py-1.5 rounded-sm border-2 uppercase transition ${
                    active ? 'bg-gold text-ink border-gold' : 'border-ink/20 text-ink/70 hover:border-ink'
                  }`}
                >
                  {c.label}
                </button>
              )
            })}
          </nav>

          {/* ---------- Sort tabs ---------- */}
          <div className="flex gap-2 mb-5" role="tablist" aria-label="Sort issues">
            {SORTS.map((s) => {
              const active = sort === s.key
              return (
                <button
                  key={s.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => changeSort(s.key)}
                  className={`condensed text-xs font-semibold tracking-wider px-3 py-1.5 rounded-sm border-2 uppercase transition ${
                    active ? 'bg-ink text-paper border-ink' : 'border-ink/20 text-ink/70 hover:border-ink'
                  }`}
                >
                  {s.label}
                </button>
              )
            })}
          </div>

          {/* ---------- 3-column layout ---------- */}
          <div className="border-t-2 border-ink/15 pt-6 xl:flex xl:gap-7 xl:items-start">
            {/* Hot (left) */}
            <aside className="hidden xl:block w-[270px] shrink-0 self-start sticky top-24" aria-label="Hot issues">
              <MiniList
                icon={<Flame size={15} />}
                title="Hot"
                hint="Heating up"
                accent="text-gold-ink"
                items={hotList}
                numbered
              />
            </aside>

            {/* Feed (center) */}
            <div className="xl:flex-1 xl:min-w-0">
              {pageItems.length > 0 ? (
                <div className="space-y-4">
                  {pageItems.map((issue, i) => {
                    const sev = severityBadge(issue.severity)
                    const v = votes[issue.id]
                    const up = issue.upvotes + (v === 'up' ? 1 : 0)
                    const down = issue.downvotes + (v === 'down' ? 1 : 0)
                    return (
                      <article
                        key={issue.id}
                        className="article-in bg-paper-soft border-2 border-ink/15 hover:border-ink rounded-sm p-5 transition"
                        style={{ animationDelay: `${i * 60}ms` }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="condensed text-[0.6rem] font-semibold tracking-wider text-ink/70 border border-ink/20 rounded-sm px-1.5 py-0.5 uppercase">
                            {CATEGORY_LABELS[issue.category]}
                          </span>
                          <span
                            className={`condensed inline-flex items-center gap-1 text-[0.6rem] font-bold tracking-wider px-1.5 py-0.5 rounded-sm uppercase ${sev.cls}`}
                          >
                            <span>{issue.severity}/10</span>
                            <span className="opacity-80">· {sev.label}</span>
                          </span>
                        </div>

                        <h2 className="font-display text-lg sm:text-xl leading-tight mb-1">
                          <a className="hover:text-gold-ink transition" href={`/issues/${issue.id}/${issue.slug}`}>
                            {issue.title}
                          </a>
                        </h2>
                        <p className="text-sm text-ink/75 mb-3 line-clamp-2">{issue.excerpt}</p>

                        <div className="flex items-center justify-between gap-3 flex-wrap pt-3 border-t border-rule">
                          <div className="flex items-center gap-2 text-xs text-ink/70">
                            <div
                              className="shrink-0 w-7 h-7 rounded-full border border-ink bg-paper text-[0.6rem] font-display flex items-center justify-center"
                              aria-hidden="true"
                            >
                              {initials(issue.author)}
                            </div>
                            <span className="font-medium text-ink/85">{issue.author}</span>
                            <span className="condensed text-[0.6rem] tracking-wider text-gold-ink border border-gold/40 rounded-sm px-1.5 py-0.5">
                              ✦ {issue.authorId}
                            </span>
                            <span aria-hidden="true">·</span>
                            <time dateTime={issue.date}>{issue.dateLabel}</time>
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs text-ink/60">
                            <MapPin size={13} /> {issue.location}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap mt-3">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              aria-pressed={v === 'up'}
                              aria-label="Support this issue"
                              onClick={() => vote(issue.id, 'up')}
                              className={`inline-flex items-center gap-1.5 condensed font-semibold tracking-wider rounded-sm border-2 transition text-xs px-2.5 py-1 ${
                                v === 'up'
                                  ? 'border-green bg-green text-paper'
                                  : 'border-ink/30 text-ink hover:border-ink'
                              }`}
                            >
                              <ThumbsUp size={14} />
                              <span className="tabular-nums">{up}</span>
                            </button>
                            <button
                              type="button"
                              aria-pressed={v === 'down'}
                              aria-label="Downvote this issue"
                              onClick={() => vote(issue.id, 'down')}
                              className={`inline-flex items-center gap-1.5 condensed font-semibold tracking-wider rounded-sm border-2 transition text-xs px-2.5 py-1 ${
                                v === 'down'
                                  ? 'border-gold-ink bg-gold-ink text-paper'
                                  : 'border-ink/30 text-ink/70 hover:border-ink hover:text-ink'
                              }`}
                            >
                              <ThumbsDown size={14} />
                              <span className="tabular-nums">{down}</span>
                            </button>
                          </div>
                          <a
                            href={`mailto:?subject=${encodeURIComponent(issue.title)}`}
                            className="inline-flex items-center gap-1.5 condensed font-semibold tracking-wider rounded-sm border-2 border-ink/30 text-ink/70 hover:border-ink hover:text-ink transition text-xs px-2.5 py-1"
                          >
                            SHARE
                          </a>
                        </div>
                      </article>
                    )
                  })}
                </div>
              ) : (
                <div className="border-2 border-dashed border-rule rounded-sm py-16 text-center">
                  <p className="font-display text-2xl mb-2">
                    No issues <em className="text-gold-ink">here yet.</em>
                  </p>
                  <p className="text-ink/70 text-sm">
                    Nothing under “{CATEGORY_LABELS[category] || 'this filter'}”. Be the first to raise one.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="mt-10 flex flex-col items-center gap-3" aria-label="Pagination">
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      disabled={safePage === 1}
                      onClick={() => setPage(safePage - 1)}
                      aria-label="Previous page"
                      className="condensed text-xs font-semibold rounded-sm border-2 inline-flex items-center justify-center min-w-[2.25rem] h-9 px-2 transition disabled:opacity-30 disabled:cursor-not-allowed border-ink/20 text-ink/70 enabled:hover:border-ink"
                    >
                      <Chevron dir="left" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPage(n)}
                        aria-current={n === safePage ? 'page' : undefined}
                        className={`condensed text-xs font-semibold rounded-sm border-2 inline-flex items-center justify-center min-w-[2.25rem] h-9 px-2 transition ${
                          n === safePage ? 'bg-ink text-paper border-ink' : 'border-ink/20 text-ink/70 hover:border-ink'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={safePage === totalPages}
                      onClick={() => setPage(safePage + 1)}
                      aria-label="Next page"
                      className="condensed text-xs font-semibold rounded-sm border-2 inline-flex items-center justify-center min-w-[2.25rem] h-9 px-2 transition disabled:opacity-30 disabled:cursor-not-allowed border-ink/20 text-ink/70 enabled:hover:border-ink"
                    >
                      <Chevron dir="right" />
                    </button>
                  </div>
                  <p className="condensed text-[0.7rem] uppercase tracking-[0.18em] text-ink/45">
                    Page {safePage} of {totalPages}
                  </p>
                </nav>
              )}
            </div>

            {/* Top + New (right) */}
            <aside className="hidden xl:block w-[290px] shrink-0 self-start sticky top-24 space-y-6" aria-label="Top and new issues">
              <MiniList
                icon={<TrendingUp size={15} />}
                title="Top"
                hint="Most backed"
                accent="text-gold-ink"
                items={topList}
                numbered
              />
              <MiniList
                icon={<Sparkles size={15} />}
                title="New"
                hint="Just raised"
                accent="text-green-ink"
                items={newList}
              />
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}
