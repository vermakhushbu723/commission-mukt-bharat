import Logo from '../ui/Logo'
import { BrandIcon } from '../ui/Icons'
import NewsletterForm from './NewsletterForm'
import { SITE, SOCIAL_LINKS, FOOTER_COLUMNS, FOOTER_BOTTOM_LINKS } from '../../data/site'

function FooterBrand() {
  return (
    <a className="inline-flex items-center gap-3 group" aria-label="Commission-Mukt Bharat — Home" href="#main-content">
      <Logo variant="dark" className="h-20 w-auto" />
      <span className="sr-only">Commission-Mukt Bharat · {SITE.nameHindi} · {SITE.established}</span>
    </a>
  )
}

export default function Footer() {
  return (
    <footer
      className="relative bg-ink text-paper pt-12 sm:pt-16 pb-6 sm:pb-8"
      style={{
        backgroundImage:
          'linear-gradient(to bottom, rgba(255,153,51,0.16) 0%, rgba(255,153,51,0.04) 14%, transparent 32%, transparent 70%, rgba(19,136,8,0.07) 88%, rgba(19,136,8,0.20) 100%)',
      }}
    >
      {/* tricolour accent line */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 flex h-1">
        <div className="flex-1 bg-gold" />
        <div className="flex-1 bg-paper" />
        <div className="flex-1 bg-green" />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* The Dispatch */}
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 sm:gap-8 lg:gap-16 items-start pb-8 sm:pb-10 mb-8 sm:mb-10 border-b border-rule-on-ink">
          <div>
            <div className="eyebrow text-gold mb-3">The Dispatch</div>
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl leading-tight mb-3">
              One email. <em className="text-gold">When it matters.</em>
            </h3>
            <p className="text-paper/65 text-sm leading-relaxed max-w-md">
              New essays, manifesto updates, and the occasional open letter. No spam, no fundraising ladder, no
              automated drip sequence.
            </p>
          </div>
          <div className="w-full">
            <NewsletterForm />
          </div>
        </div>

        {/* Brand + columns */}
        <div className="grid grid-cols-[auto_auto] justify-center lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] lg:justify-stretch gap-x-6 gap-y-8 sm:gap-10 pb-10 sm:pb-12 border-b border-rule-on-ink">
          <div className="col-span-2 lg:col-span-1">
            <FooterBrand />
            <p className="text-paper/65 text-sm leading-relaxed mt-5 sm:mt-6 max-w-md">
              A citizens' movement against commissions, kickbacks, and quiet corruption. Headquartered wherever the
              wifi works.
            </p>
            <ul className="flex flex-wrap items-center gap-2.5 mt-5 sm:mt-6" aria-label="Social media">
              {SOCIAL_LINKS.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    title={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-11 h-11 rounded-sm border border-paper/25 text-paper/75 hover:text-ink hover:bg-gold hover:border-gold transition"
                  >
                    <BrandIcon id={s.id} size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4
                className="font-bold tracking-[0.18em] uppercase text-[0.62rem] text-paper/55 mb-4"
                style={{ fontFamily: 'var(--font-condensed)' }}
              >
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="inline-block py-1 text-sm text-paper/80 hover:text-gold transition"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 text-[0.7rem] sm:text-xs text-paper/55">
          <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:text-left">
            <div>© 2026 Commission-Mukt Bharat · All rights reserved.</div>
            <div
              className="font-bold tracking-[0.18em] uppercase text-[0.62rem] sm:text-[0.7rem]"
              style={{ fontFamily: 'var(--font-condensed)' }}
            >
              ✦ Towards a Corruption-Free India
            </div>
            <nav className="hidden sm:flex flex-wrap items-center gap-3" aria-label="Quick links">
              {FOOTER_BOTTOM_LINKS.map((link, i) => (
                <span key={link.label} className="flex items-center gap-3">
                  <a href={link.href} className="hover:text-gold transition">
                    {link.label}
                  </a>
                  {i < FOOTER_BOTTOM_LINKS.length - 1 && <span aria-hidden="true">·</span>}
                </span>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
