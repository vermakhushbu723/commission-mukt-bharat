// The honest membership test — who this movement is for, and who it is not.
const SHOULD_JOIN = [
  "You've watched a ₹150 meal become a ₹313 bill — and wondered where the rest went.",
  'You run a restaurant, kirana or small business losing up to a third of every order to platform commissions.',
  "You're a delivery rider or cab driver tired of shrinking payouts and silent deactivation.",
  'You believe a bill should be honest — every fee named, every rupee explained.',
  'You want fair pricing and transparent platforms — not a discount that vanishes next week.',
]

const SHOULD_NOT_JOIN = [
  'You profit from unfair fees — and want them to stay that way.',
  'You think a heavy commission on a small restaurant is “just business.”',
  'You believe surge pricing and hidden convenience fees are always fair.',
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-14 max-w-2xl mx-auto reveal">
          <div className="eyebrow text-gold mb-5">Be honest with yourself</div>
          <h2 className="heading-section mb-2 leading-[1.02]">
            Who should <em className="text-green">join</em> — and who{' '}
            <em className="text-gold">should not</em>.
          </h2>
          <span className="title-rule center mb-6" aria-hidden="true" />
          <p className="text-base sm:text-lg text-paper/75">
            This movement draws a clear line. Read both sides — then find where you stand.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
          {/* Who should join */}
          <div className="reveal">
            <div className="flex items-center gap-3 mb-5">
              <span className="font-display text-2xl text-green leading-none" aria-hidden="true">
                ✓
              </span>
              <h3 className="condensed text-lg font-semibold tracking-wide uppercase text-green">
                Who should join us
              </h3>
            </div>
            <ul className="divide-y divide-paper/15 border-y border-paper/15">
              {SHOULD_JOIN.map((d, i) => (
                <li
                  key={i}
                  className="reveal flex gap-4 py-5 items-start"
                  style={{ '--reveal-delay': `${i * 60}ms` }}
                >
                  <span className="font-display text-xl text-green leading-none mt-0.5" aria-hidden="true">
                    ✓
                  </span>
                  <p className="text-base sm:text-lg text-paper/90 leading-relaxed">{d}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Who should not join */}
          <div className="reveal" style={{ '--reveal-delay': '120ms' }}>
            <div className="flex items-center gap-3 mb-5">
              <span className="font-display text-2xl text-gold leading-none" aria-hidden="true">
                ✕
              </span>
              <h3 className="condensed text-lg font-semibold tracking-wide uppercase text-gold">
                Who should not join us
              </h3>
            </div>
            <ul className="divide-y divide-paper/15 border-y border-paper/15">
              {SHOULD_NOT_JOIN.map((d, i) => (
                <li
                  key={i}
                  className="reveal flex gap-4 py-5 items-start"
                  style={{ '--reveal-delay': `${i * 60}ms` }}
                >
                  <span className="font-display text-xl text-gold leading-none mt-0.5" aria-hidden="true">
                    ✕
                  </span>
                  <p className="text-base sm:text-lg text-paper/90 leading-relaxed">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-base sm:text-lg text-paper/80 mt-12 max-w-xl mx-auto reveal">
          Riders, gig workers, food-app partners, small businesses and fair-minded customers —{' '}
          <strong className="text-gold">you belong here.</strong>
        </p>
      </div>
    </section>
  )
}
