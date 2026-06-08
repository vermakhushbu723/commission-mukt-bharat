// The honest counterpart to the membership section — who this movement is NOT for.
const DISQUALIFY = [
  'You profit from hidden fees — and want them to stay hidden.',
  'You think a heavy platform commission on a small restaurant is "just business."',
  'You believe surge pricing and convenience fees are always fair.',
  'You want to use this movement for a political seat or a brand campaign.',
  "You're here to defend the middleman's cut, not the worker's wage.",
]

export default function WhoShouldNotJoin() {
  return (
    <section
      id="who-should-not-join"
      className="py-20 sm:py-28 md:py-32 bg-ink text-paper relative overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(to bottom, rgba(255,153,51,0.15) 0%, rgba(255,153,51,0.04) 16%, transparent 34%, transparent 66%, rgba(19,136,8,0.06) 84%, rgba(19,136,8,0.18) 100%)',
      }}
    >
      <div className="absolute inset-0 opacity-[0.04] paper-grain pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-12 max-w-2xl mx-auto reveal">
          <div className="eyebrow text-gold mb-5">Be honest with yourself</div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl mb-2">
            Who should <em className="text-gold">not</em> join us.
          </h2>
          <span className="title-rule center mb-6" aria-hidden="true" />
          <p className="text-base sm:text-lg text-paper/75">
            This movement isn't for everyone. If the lines below sound like you, we respectfully say — this isn't your
            place.
          </p>
        </div>

        <ul className="max-w-3xl mx-auto divide-y divide-paper/15 border-y border-paper/15">
          {DISQUALIFY.map((d, i) => (
            <li
              key={i}
              className="reveal flex gap-4 py-5 items-start"
              style={{ '--reveal-delay': `${i * 60}ms` }}
            >
              <span className="font-display text-2xl text-gold leading-none mt-0.5" aria-hidden="true">
                ✕
              </span>
              <p className="text-base sm:text-lg text-paper/90 leading-relaxed">{d}</p>
            </li>
          ))}
        </ul>

        <p className="text-center text-base sm:text-lg text-paper/80 mt-10 max-w-xl mx-auto reveal">
          Everyone else — riders, gig workers, food-app partners, small businesses and fair-minded customers —{' '}
          <strong className="text-gold">you belong here.</strong>
        </p>
      </div>
    </section>
  )
}
