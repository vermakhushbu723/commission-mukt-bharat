import { useState } from 'react'
import MembersTicker from '../components/home/MembersTicker'
import CommunityPosts from '../components/CommunityPosts'
import { ARTICLES } from '../data/articles'

export default function ArticlesPage() {
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const filtered = q
    ? ARTICLES.filter((a) =>
        [a.title, a.excerpt, a.category].some((field) => field.toLowerCase().includes(q)),
      )
    : ARTICLES

  return (
    <main id="main-content" className="min-h-screen bg-transparent text-ink relative">
      <MembersTicker />

      <section className="py-16 sm:py-24 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* ---------- Header ---------- */}
          <div className="reveal">
            <div className="eyebrow text-green-ink mb-5">The Journal</div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] mb-2">
              Articles &amp; <em className="text-gold-ink">Essays.</em>
            </h1>
            <span className="title-rule mb-6" aria-hidden="true" />
            <p className="text-base sm:text-lg text-ink/75 mb-10 max-w-2xl">
              Long-form writing on the movement's origin, the five demands, and the everyday economics of
              corruption in 2026. Read once. Read twice. Then send it to someone who needs to.
            </p>

            {/* ---------- Search ---------- */}
            <form role="search" className="mb-8 flex gap-3 max-w-xl" onSubmit={(e) => e.preventDefault()}>
              <input
                type="search"
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search essays…"
                aria-label="Search essays"
                className="flex-1 bg-paper-soft border-2 border-ink rounded-sm px-4 py-3 min-h-[44px] text-base focus:outline-none focus:border-green focus:ring-2 focus:ring-green/40 transition"
              />
              <button
                type="submit"
                className="btn-sheen condensed text-sm font-semibold tracking-wider bg-green text-paper px-6 py-3 min-h-[44px] rounded-sm hover:bg-green-ink transition shadow-[0_4px_14px_rgba(19,136,8,0.3)]"
              >
                Search
              </button>
            </form>
          </div>

          {/* ---------- List ---------- */}
          {filtered.length > 0 ? (
            <ul className="border-t border-rule">
              {filtered.map((article, i) => (
                <li
                  key={article.slug}
                  className="article-in border-b border-rule"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <a
                    className="group block py-8 -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-sm hover:bg-paper-soft transition"
                    href={`/articles/${article.slug}`}
                  >
                    <div className="flex flex-wrap items-center gap-3 condensed text-[0.7rem] text-ink/70 mb-3">
                      <time dateTime={article.date}>{article.dateLabel}</time>
                      <span aria-hidden="true">·</span>
                      <span>{article.readTime}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-green-ink font-semibold">{article.category}</span>
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-3 group-hover:text-gold-ink transition">
                      {article.title}
                    </h2>
                    <p className="text-ink/75 leading-relaxed max-w-2xl">{article.excerpt}</p>
                    <div className="mt-4 condensed text-xs font-semibold text-ink group-hover:text-gold-ink transition inline-flex items-center gap-2">
                      READ THE ESSAY <span aria-hidden="true" className="arrow">→</span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="border-t border-rule pt-12 text-center">
              <p className="font-display text-2xl sm:text-3xl mb-3">
                Nothing <em className="text-gold-ink">here yet.</em>
              </p>
              <p className="text-ink/70">
                No essays match “{query}”. Try another word, or{' '}
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-green-ink underline hover:text-ink transition"
                >
                  clear the search
                </button>
                .
              </p>
            </div>
          )}

          {/* ---------- Community: post an article + per-post comments ---------- */}
          <CommunityPosts />
        </div>
      </section>
    </main>
  )
}
