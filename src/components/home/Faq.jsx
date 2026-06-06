import { FAQS } from '../../data/faqs'
import { SITE } from '../../data/site'

export default function Faq() {
  return (
    <section id="faq" className="py-20 sm:py-28 md:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 max-w-2xl mx-auto reveal">
          <div className="eyebrow text-green-ink mb-5">Frequently Asked</div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl mb-2">
            About the <em className="text-gold-ink">movement.</em>
          </h2>
          <span className="title-rule center mb-6" aria-hidden="true" />
          <p className="text-base sm:text-lg text-ink/75">
            The eight questions we get asked most often, answered in the same order Google asks them.
          </p>
        </div>

        <ul className="divide-y divide-rule border-y border-rule">
          {FAQS.map((faq) => (
            <li key={faq.q}>
              <details className="group py-5 sm:py-6">
                <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
                  <h3 className="font-display text-xl sm:text-2xl leading-tight group-open:text-gold-ink transition">
                    {faq.q}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="condensed text-gold-ink text-xl shrink-0 mt-1 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="mt-3 text-ink/80 leading-relaxed">{faq.a}</div>
              </details>
            </li>
          ))}
        </ul>

        <p className="text-center text-sm text-ink/70 mt-10 max-w-xl mx-auto">
          Still have a question? Write to{' '}
          <a href={`mailto:${SITE.emails.contact}`} className="text-blue-ink underline hover:text-ink transition">
            {SITE.emails.contact}
          </a>{' '}
          — we read everything.
        </p>
      </div>
    </section>
  )
}
