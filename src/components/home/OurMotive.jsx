// Who the movement actually fights for — the people behind every order.
const MOTIVES = [
  {
    n: '01',
    title: "Riders' Empowerment",
    body: 'The riders who power every order deserve fair pay — not a shrinking cut after platform commissions, surge math and silent deductions. We stand for transparent payouts, safety, and dignity on the road.',
    accent: 'text-gold-ink',
  },
  {
    n: '02',
    title: 'Gig Workers',
    body: 'The gig economy runs on millions of workers with no safety net. We push for fair earnings, clear terms, and an end to the opaque fees buried in the fine print of every app.',
    accent: 'text-green-ink',
  },
  {
    n: '03',
    title: 'Food Apps & Partners',
    body: 'Restaurants and food-app partners lose a heavy slice to platform and convenience fees. We demand fair commissions so honest kitchens survive and good food stays affordable for everyone.',
    accent: 'text-gold-ink',
  },
]

export default function OurMotive() {
  return (
    <section id="motive" className="py-20 sm:py-28 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 max-w-2xl mx-auto reveal">
          <div className="eyebrow text-green-ink mb-5">Who we fight for</div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl mb-2">
            Our <em className="text-gold-ink">motive.</em>
          </h2>
          <span className="title-rule center mb-6" aria-hidden="true" />
          <p className="text-base sm:text-lg text-ink/75">
            Empower the people behind every order — the riders, workers and small partners who do the work while the
            commission quietly disappears.
          </p>
        </div>

        <ul className="grid md:grid-cols-3 gap-6">
          {MOTIVES.map((m, i) => (
            <li
              key={m.n}
              className="reveal hover-lift bg-paper-soft border-2 border-ink rounded-sm p-6 sm:p-7 shadow-[6px_6px_0_0_rgba(35,35,35,0.85)]"
              style={{ '--reveal-delay': `${i * 80}ms` }}
            >
              <div className={`font-display text-4xl sm:text-5xl ${m.accent} leading-none mb-3`}>{m.n}</div>
              <h3 className="font-display text-2xl mb-2 leading-tight">{m.title}</h3>
              <p className="text-sm sm:text-base text-ink/75 leading-relaxed">{m.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
