// We are a citizens' movement, not a party. This section makes that unmistakable.
const NOT = [
  { k: 'Not a political party', d: "We don't contest elections or carry anyone's flag." },
  { k: 'Not a vote bank', d: 'Your support buys fair pricing — never a candidate.' },
  { k: 'Not for sale', d: 'No corporate donor, no sponsor, no hidden paymaster.' },
  { k: "Not anyone's PR", d: 'We answer to citizens, riders and workers — no one else.' },
]

export default function NonPolitical() {
  return (
    <section id="non-political" className="py-20 sm:py-28 md:py-32 bg-paper-soft border-y-2 border-ink/15">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="eyebrow text-green-ink mb-5 reveal">No party · No politics</div>
        <h2 className="text-5xl sm:text-6xl md:text-7xl mb-2 reveal">
          A <em className="text-gold-ink">non-political</em> movement.
        </h2>
        <span className="title-rule center mb-6" aria-hidden="true" />
        <p className="text-base sm:text-lg text-ink/75 max-w-2xl mx-auto mb-12 reveal">
          Commission-Mukt Bharat is a citizens' movement — not a political party. We don't contest elections, we don't
          trade your support for votes, and we have no leader to crown. Our only agenda is fair pricing and transparent
          services for riders, gig workers, small businesses and customers alike. Politics divides; a fair bill unites.
        </p>
        <ul className="grid sm:grid-cols-2 gap-4 text-left max-w-3xl mx-auto">
          {NOT.map((n, i) => (
            <li
              key={n.k}
              className="reveal flex gap-3 bg-paper border-2 border-ink rounded-sm p-5"
              style={{ '--reveal-delay': `${i * 70}ms` }}
            >
              <span className="font-display text-xl text-gold-ink leading-none mt-0.5" aria-hidden="true">
                ✕
              </span>
              <div>
                <div className="font-display text-lg leading-tight">{n.k}</div>
                <div className="text-sm text-ink/70 mt-1">{n.d}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
