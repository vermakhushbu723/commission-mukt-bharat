import { VisionPlaceholder } from '../ui/placeholders'
import { SITE } from '../../data/site'

export default function Vision() {
  return (
    <section id="vision" className="py-20 sm:py-28 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-[1.1fr_1fr] gap-12 lg:gap-20 items-center">
        <div className="reveal">
          <div className="eyebrow text-green-ink mb-6">Chapter One</div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl mb-2 leading-[0.95]">
            Our Movement's <em className="text-gold-ink">Vision.</em>
          </h2>
          <span className="title-rule mb-8" aria-hidden="true" />
          <p className="text-base sm:text-lg leading-relaxed text-ink/80 mb-8 max-w-xl">
            We are not here to launch another opaque fund, travel first-class on the taxpayer's bill, or rebrand a
            kickback as “strategic spending.” We are here to ask — loudly, repeatedly, and in writing — where every
            public rupee went.
          </p>
          <div className="border-l-4 border-gold pl-5 max-w-xl">
            <div className="eyebrow text-gold-ink mb-2">Our Mission</div>
            <p className="text-base sm:text-lg leading-relaxed text-ink/85">
              Build a movement for a Bharat that is done paying commissions — to register a complaint, to clear a file,
              to simply be heard. Demand receipts, track every sanctioned rupee, and make corruption the most expensive
              habit in Indian public life.
            </p>
          </div>
        </div>

        <aside className="reveal reveal-zoom relative" style={{ '--reveal-delay': '120ms' }}>
          <div className="relative aspect-[4/5] border-2 border-ink rounded-sm overflow-hidden shadow-[6px_6px_0_0_rgba(35,35,35,0.85)]">
            <VisionPlaceholder />
          </div>
          <div className="absolute -bottom-5 left-4 right-4 sm:right-auto sm:w-72 bg-paper border-2 border-ink rounded-sm px-4 py-3 flex items-center justify-between">
            <div className="condensed text-[0.7rem] text-ink/70">Rally · The People's Banner</div>
            <div className="font-display text-sm text-ink">{SITE.foundedDate}</div>
          </div>
        </aside>
      </div>
    </section>
  )
}
