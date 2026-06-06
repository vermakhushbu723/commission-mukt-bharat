import { ARTICLES } from '../../data/articles'

export default function Articles() {
  return (
    <section id="articles" className="py-20 sm:py-28 md:py-32 bg-paper-soft border-y-2 border-ink/15">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 reveal">
          <div>
            <div className="eyebrow text-green-ink mb-5">The Journal</div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl leading-tight mb-2">
              Latest <em className="text-gold-ink">essays.</em>
            </h2>
            <span className="title-rule" aria-hidden="true" />
          </div>
          <a
            className="group condensed text-sm font-semibold tracking-wider hover:text-gold-ink transition inline-flex items-center gap-2"
            href="/articles"
          >
            ALL ARTICLES <span aria-hidden="true" className="arrow">→</span>
          </a>
        </div>

        <ul className="grid md:grid-cols-3 gap-6">
          {ARTICLES.map((article, index) => (
            <li key={article.slug} className="reveal" style={{ '--reveal-delay': `${index * 90}ms` }}>
              <a
                className="hover-lift block h-full bg-paper border-2 border-ink rounded-sm p-6 sm:p-7 hover:border-gold hover:shadow-[6px_6px_0_0_rgba(255,153,51,0.25)] group"
                href={`/articles/${article.slug}`}
              >
                <div className="flex flex-wrap items-center gap-2 condensed text-[0.65rem] text-ink/70 mb-4">
                  <time dateTime={article.date}>{article.dateLabel}</time>
                  <span>·</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl leading-tight mb-3 group-hover:text-gold-ink transition">
                  {article.title}
                </h3>
                <p className="text-sm text-ink/70 leading-relaxed">{article.excerpt}</p>
                <div className="mt-5 condensed text-xs font-semibold inline-flex items-center gap-2 group-hover:text-gold-ink transition">
                  READ <span aria-hidden="true" className="arrow">→</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
