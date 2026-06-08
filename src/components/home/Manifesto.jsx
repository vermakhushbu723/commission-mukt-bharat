import { DEMANDS } from '../../data/manifesto'

export default function Manifesto() {
  return (
    <section id="manifesto" className="bg-ink text-paper py-20 sm:py-28 md:py-36 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] paper-grain pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-16 max-w-2xl mx-auto reveal">
          <div className="eyebrow text-gold mb-5">Five Demands Against the Commission Economy</div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-2">The Manifesto.</h2>
          <span className="title-rule center mb-6" aria-hidden="true" />
          <p className="text-base sm:text-lg text-paper/75">
            Five demands to end unfair commissions on food-delivery and cab-booking apps — fair pay for drivers,
            honest bills for customers. Read it once. Read it twice. Then send it to someone who needs to read it.
          </p>
        </div>

        <ol className="max-w-4xl mx-auto divide-y divide-paper/15 border-y border-paper/15">
          {DEMANDS.map((demand, index) => {
            // Alternate the giant numerals saffron / green for equal tricolour billing.
            const accent = Number(demand.n) % 2 === 0 ? 'text-green' : 'text-gold'
            return (
              <li
                key={demand.n}
                className="grid grid-cols-[auto_1fr] gap-6 sm:gap-10 py-8 sm:py-10 items-start reveal"
                style={{ '--reveal-delay': `${index * 70}ms` }}
              >
                <div className={`font-display text-5xl sm:text-6xl md:text-7xl ${accent} leading-none`}>
                  {demand.n}
                </div>
                <p className="text-base sm:text-lg leading-relaxed text-paper/90 pt-2">
                  {demand.segments.map((seg, i) =>
                    seg.strong ? (
                      <strong key={i} className="font-semibold text-gold">
                        {seg.text}
                      </strong>
                    ) : (
                      <span key={i}>{seg.text}</span>
                    ),
                  )}
                </p>
              </li>
            )
          })}
        </ol>

        <div className="text-center mt-12">
          <a
            className="group condensed text-sm font-semibold tracking-wider border-2 border-green text-green px-7 py-4 rounded-sm hover:bg-green hover:text-paper transition inline-flex items-center gap-2"
            href="/articles/the-five-demands-explained"
          >
            READ THE FULL EXPLAINER <span aria-hidden="true" className="arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
