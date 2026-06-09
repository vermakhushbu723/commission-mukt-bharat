import { RevolutionariesPlaceholder } from '../ui/placeholders'

export default function Revolutionaries() {
  return (
    <section aria-labelledby="revolutionaries-heading" className="py-16 sm:py-24 md:py-28 border-y-2 border-ink bg-paper-soft">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 max-w-2xl mx-auto reveal">
          <div className="eyebrow text-green-ink mb-5">In their footsteps</div>
          <h2 id="revolutionaries-heading" className="heading-section mb-2">
            Revolutionaries <em className="text-gold-ink">of India.</em>
          </h2>
          <span className="title-rule center mb-5" aria-hidden="true" />
          <p className="text-base sm:text-lg text-ink/75">
            Honoring the courage of India's revolutionaries and the fairer nation they fought for. Their legacy lives
            on through a generation determined to stand up for fair pricing, fair pay and an honest bill.
          </p>
        </div>

        <figure className="m-0 reveal" style={{ '--reveal-delay': '100ms' }}>
          <a
            aria-label="Become a member of Commission-Mukt Bharat"
            className="group block relative overflow-hidden rounded-sm border-2 border-ink shadow-[8px_8px_0_0_rgba(35,35,35,0.85)] focus:outline-none focus-visible:ring-4 focus-visible:ring-gold/60 transition-shadow hover:shadow-[10px_10px_0_0_rgba(35,35,35,0.9)]"
            href="/join"
          >
            <RevolutionariesPlaceholder className="transition-transform duration-700 ease-out group-hover:scale-[1.015]" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-gradient-to-t from-ink/85 to-transparent px-4 pt-12 pb-4 text-paper condensed text-xs sm:text-sm font-semibold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300"
            >
              Join the movement <span>→</span>
            </span>
          </a>
          <figcaption className="mt-4 text-center condensed text-[0.72rem] sm:text-xs text-ink/60">
            Swatantrata · Samata · Bandhuta · Nyaya — Freedom, Equality, Fraternity, Justice
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
