import Marquee from './ui/Marquee'
import { ARTICLES } from '../data/articles'

// Auto-scrolling left→right slider of article cards for the top of the Journal page.
// Pauses on hover (see .marquee-pause in index.css) so a card can be read & clicked.
const fade = (dir) => ({
  background: `linear-gradient(to ${dir}, var(--color-paper, #fafaf7), transparent)`,
})

export default function ArticlesTicker() {
  return (
    <section
      aria-label="Latest essays — slider"
      className="relative bg-paper-soft border-b-2 border-ink/10 overflow-hidden"
    >
      {/* tiranga top strip */}
      <div aria-hidden="true" className="tiranga-strip absolute inset-x-0 top-0 h-[3px] z-20" />

      {/* heading bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-1 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="lens-pulse w-1.5 h-1.5 rounded-full bg-green"
            style={{ boxShadow: '0 0 7px rgba(19,136,8,0.95)' }}
          />
          <span
            className="text-[0.62rem] font-bold tracking-[0.18em] uppercase text-ink/70"
            style={{ fontFamily: 'var(--font-condensed)' }}
          >
            Latest essays · Fresh off the press
          </span>
        </div>
        <span className="hidden sm:inline condensed text-[0.62rem] tracking-[0.16em] uppercase text-ink/40">
          Hover to pause →
        </span>
      </div>

      {/* slider */}
      <div className="relative py-5">
        <div aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={fade('right')} />
        <div aria-hidden="true" className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={fade('left')} />

        <Marquee
          items={ARTICLES}
          duration={48}
          className="marquee-pause"
          renderItem={(a, i) => (
            <a
              key={`${a.slug}-${i}`}
              href={`/articles/${a.slug}`}
              className="group/card mx-2.5 flex w-[260px] sm:w-[300px] shrink-0 flex-col bg-paper border-2 border-ink rounded-sm p-5 shadow-[4px_4px_0_0_rgba(35,35,35,0.85)] hover:shadow-[6px_6px_0_0_rgba(255,153,51,0.35)] hover:border-gold transition whitespace-normal"
            >
              <div className="flex items-center gap-2 condensed text-[0.6rem] text-ink/70 mb-3 uppercase tracking-[0.14em]">
                <span className="text-green-ink font-semibold">{a.category}</span>
                <span aria-hidden="true">·</span>
                <span>{a.readTime}</span>
              </div>
              <h3 className="font-display text-base sm:text-lg leading-tight mb-3 line-clamp-3 group-hover/card:text-gold-ink transition">
                {a.title}
              </h3>
              <span className="mt-auto condensed text-[0.68rem] font-semibold tracking-wider inline-flex items-center gap-2 text-ink group-hover/card:text-gold-ink transition">
                READ THE ESSAY <span aria-hidden="true" className="arrow">→</span>
              </span>
            </a>
          )}
        />
      </div>
    </section>
  )
}
