import { SECTORS } from '../../data/sectors'
import { SITE } from '../../data/site'

export default function Join() {
  return (
    <section id="join" className="py-20 sm:py-28 md:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 max-w-2xl mx-auto reveal">
          <div className="eyebrow text-green-ink mb-5">Where commissions bite</div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl mb-2">
            Where they take{' '}
            <span className="whitespace-nowrap">
              their <em className="text-gold-ink">cut.</em>
            </span>
          </h2>
          <span className="title-rule center mb-6" aria-hidden="true" />
          <p className="text-base sm:text-lg text-ink/75">
            From your food order to your cab ride, a silent commission rides along. These are the sectors we are
            taking on.
          </p>
        </div>

        <ul className="space-y-4">
          {SECTORS.map((item, index) => (
            <li
              key={item.title}
              className="reveal grid grid-cols-[auto_1fr] gap-4 sm:gap-6 items-start bg-paper-soft border-2 border-ink rounded-sm px-5 sm:px-7 py-5 sm:py-6"
              style={{ '--reveal-delay': `${index * 80}ms` }}
            >
              <div
                aria-hidden="true"
                className="w-9 h-9 rounded-full bg-green text-paper flex items-center justify-center font-display text-lg shrink-0"
              >
                {index + 1}
              </div>
              <div>
                <div className="font-display text-xl sm:text-2xl">{item.title}</div>
                <div className="text-sm sm:text-base text-ink/70 mt-1">{item.desc}</div>
              </div>
            </li>
          ))}
        </ul>

        <div className="text-center mt-12">
          <a
            className="btn-sheen cta-pulse group condensed text-sm font-semibold tracking-wider bg-green text-paper px-8 py-4 rounded-sm hover:bg-green-ink transition inline-flex items-center gap-2 shadow-[0_6px_18px_rgba(19,136,8,0.35)]"
            href="/join"
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
