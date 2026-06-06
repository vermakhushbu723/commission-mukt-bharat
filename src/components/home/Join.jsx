import { useState } from 'react'
import { ELIGIBILITY } from '../../data/eligibility'
import { SITE } from '../../data/site'

function message(count) {
  if (count === 0) return 'Tap the standards that describe you. (All of them is fine.)'
  if (count === ELIGIBILITY.length) return 'All four. You belong with Commission-Mukt Bharat — welcome.'
  return `${count} of ${ELIGIBILITY.length}. Honesty over completeness — you already belong.`
}

export default function Join() {
  const [selected, setSelected] = useState(() => new Set())

  const toggle = (index) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(index) ? next.delete(index) : next.add(index)
      return next
    })

  return (
    <section id="join" className="py-20 sm:py-28 md:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 max-w-2xl mx-auto reveal">
          <div className="eyebrow text-green-ink mb-5">Membership</div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl mb-2">
            Are you eligible{' '}
            <span className="whitespace-nowrap">
              to <em className="text-gold-ink">join?</em>
            </span>
          </h2>
          <span className="title-rule center mb-6" aria-hidden="true" />
          <p className="text-base sm:text-lg text-ink/75">
            We do not check religion, caste, or gender. We do, however, have four (4) standards.
          </p>
        </div>

        <ul className="space-y-4">
          {ELIGIBILITY.map((item, index) => {
            const active = selected.has(index)
            return (
              <li key={item.req} className="reveal" style={{ '--reveal-delay': `${index * 80}ms` }}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(index)}
                  className={`hover-lift w-full text-left grid grid-cols-[auto_1fr_auto] gap-5 sm:gap-8 items-center border-2 rounded-sm px-5 sm:px-7 py-5 sm:py-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50 hover:border-gold ${
                    active ? 'border-green bg-green/10' : 'bg-paper-soft border-ink'
                  }`}
                >
                  <div className="condensed text-[0.7rem] text-ink/70 hidden sm:block w-16">{item.req}</div>
                  <div>
                    <div className="font-display text-xl sm:text-2xl">{item.title}</div>
                    <div className="text-sm sm:text-base text-ink/70 mt-1">{item.desc}</div>
                  </div>
                  <div
                    aria-hidden="true"
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center font-display text-lg transition ${
                      active ? 'bg-green border-green text-paper' : 'border-ink text-ink/25'
                    }`}
                  >
                    {active ? <span className="pop-in inline-block">✓</span> : ''}
                  </div>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="text-center mt-8 mb-6 min-h-[3rem]" aria-live="polite">
          <p className="text-sm text-ink/70 italic max-w-xl mx-auto leading-relaxed">{message(selected.size)}</p>
        </div>

        <div className="text-center mt-10">
          <a
            className="btn-sheen cta-pulse group condensed text-sm font-semibold tracking-wider bg-green text-paper px-8 py-4 rounded-sm hover:bg-green-ink transition inline-flex items-center gap-2 shadow-[0_6px_18px_rgba(19,136,8,0.35)]"
            href="#contact"
          >
            JOIN THE MOVEMENT <span aria-hidden="true" className="arrow">→</span>
          </a>
          <p className="text-sm text-ink/70 mt-4 max-w-md mx-auto leading-relaxed">
            Join <strong className="text-ink">{SITE.memberCount}</strong> citizens · {SITE.weekJoins} joined this
            week. Free, lifelong, and revocable only by you. No fees.
          </p>
        </div>
      </div>
    </section>
  )
}
