// import visionImg from '../../assets/Vision.png'
import { SITE } from '../../data/site'
import visionImg from '../../assets/Movementvision.jpeg'

export default function Vision() {
  return (
    <section id="vision" className="py-20 sm:py-28 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-center">
        <div className="reveal">
          <div className="eyebrow text-green-ink mb-6">Chapter One · Our Vision</div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl mb-2 leading-[0.95]">
            Bharat Free From Hidden <em className="text-gold-ink">Commissions.</em>
          </h2>
          <span className="title-rule mb-8" aria-hidden="true" />
          <p className="text-base sm:text-lg leading-relaxed text-ink/80 mb-8 max-w-xl">
            Every order, every ride, every delivery now hides a stack of charges — platform fee, surge charge,
            convenience fee, handling fee. You pay ₹313 so an app can keep ₹173, while the restaurant, the driver and
            you are left asking the same question: <strong className="text-ink">who actually profits?</strong>
          </p>
          <div className="border-l-4 border-gold pl-5 max-w-xl">
            <div className="eyebrow text-gold-ink mb-2">Our Mission</div>
            <p className="text-base sm:text-lg leading-relaxed text-ink/85">
              Build a Bharat with fair pricing and transparent services — every time. No hidden platform fees, no surge
              loot, no convenience-fee games. Small businesses, drivers and customers, together for one simple promise:
              a fair bill, for a fair Bharat.
            </p>
          </div>
        </div>

        <aside className="reveal reveal-zoom relative" style={{ '--reveal-delay': '120ms' }}>
          <div className="relative aspect-[1600/877] bg-ink border-2 border-ink rounded-sm overflow-hidden shadow-[6px_6px_0_0_rgba(35,35,35,0.85)]">
            <img
              src={visionImg}
              alt="Commission-Mukt Bharat infographic: food-delivery, cab and quick-commerce apps stack platform, surge and convenience fees onto a ₹313 bill while the restaurant and driver receive only ₹140 — citizens demanding fair, transparent pricing"
              width={1600}
              height={877}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
          <div className="absolute -bottom-5 left-4 right-4 sm:right-auto sm:w-72 bg-paper border-2 border-ink rounded-sm px-4 py-3 flex items-center justify-between">
            <div className="condensed text-[0.7rem] text-ink/70">Customers &amp; Vendors · Demanding Fair Bills</div>
            <div className="font-display text-sm text-ink">{SITE.foundedDate}</div>
          </div>
        </aside>
      </div>
    </section>
  )
}
