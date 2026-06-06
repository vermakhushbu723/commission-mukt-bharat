import { SITE } from '../../data/site'

export default function Contact() {
  const joinMailto = `mailto:${SITE.emails.contact}?subject=Joining%20Commission-Mukt%20Bharat`

  return (
    <section id="contact" className="py-20 sm:py-28 md:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-[1fr_1fr] gap-12 lg:gap-20">
        <div className="reveal">
          <div className="eyebrow text-gold-ink mb-5">Get in touch</div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl mb-2">
            Connect <em className="text-green-ink">with us.</em>
          </h2>
          <span className="title-rule mb-6" aria-hidden="true" />
          <p className="text-base sm:text-lg text-ink/75 mb-10 max-w-md">
            Want to join, volunteer, report a commission, or share an idea? Write to us. We read everything. We reply to most things.
          </p>
          <ul className="space-y-6 border-t border-rule">
            <li className="grid grid-cols-[7rem_1fr] gap-4 pt-6 border-b border-rule pb-6">
              <div className="condensed text-[0.7rem] text-ink/70">Email</div>
              <a href={`mailto:${SITE.emails.contact}`} className="font-medium hover:text-gold-ink transition break-all">
                {SITE.emails.contact}
              </a>
            </li>
            <li className="grid grid-cols-[7rem_1fr] gap-4 border-b border-rule pb-6">
              <div className="condensed text-[0.7rem] text-ink/70">Press</div>
              <a href={`mailto:${SITE.emails.press}`} className="font-medium hover:text-gold-ink transition break-all">
                {SITE.emails.press}
              </a>
            </li>
            <li className="grid grid-cols-[7rem_1fr] gap-4">
              <div className="condensed text-[0.7rem] text-ink/70">Headquarters</div>
              <div className="font-medium">Wherever the wifi works.</div>
            </li>
          </ul>
        </div>

        <div className="reveal reveal-zoom hover-lift bg-paper-soft border-2 border-ink rounded-sm p-8 sm:p-10 flex flex-col justify-center items-center text-center shadow-[6px_6px_0_0_rgba(35,35,35,0.85)]" style={{ '--reveal-delay': '120ms' }}>
          <div className="eyebrow text-green-ink mb-4">Drop a line</div>
          <p className="font-display text-3xl sm:text-4xl leading-tight mb-2">
            Open your <em className="text-gold-ink">mailbox.</em>
          </p>
          <p className="text-sm text-ink/70 max-w-xs mb-8 leading-relaxed">
            No forms. No captchas. Just write to us — tips, RTI replies, receipts, and ideas, all welcome.
          </p>
          <a
            href={joinMailto}
            className="btn-sheen group condensed text-sm font-semibold tracking-wider bg-green text-paper px-8 py-4 rounded-sm hover:bg-green-ink transition inline-flex items-center gap-2 shadow-[0_6px_18px_rgba(19,136,8,0.3)]"
          >
            EMAIL US <span aria-hidden="true" className="arrow">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
