import { useState } from 'react'
import Logo from '../ui/Logo'
import { GlobeIcon, MenuIcon, CloseIcon, ChevronDownMini } from '../ui/Icons'
import { SITE, NAV_LINKS } from '../../data/site'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
]

function Brand() {
  return (
    <a
      className="flex items-center gap-3 group"
      aria-label="Commission-Mukt Bharat — Home"
      href="/"
    >
      <Logo variant="light" className="h-14 sm:h-16 w-auto" />
      <span className="sr-only">Commission-Mukt Bharat · {SITE.nameHindi}</span>
    </a>
  )
}

function LanguageSelector() {
  const [open, setOpen] = useState(false)
  const [lang, setLang] = useState(LANGUAGES[0])

  return (
    <div className="relative" onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-2.5 py-2 condensed text-xs font-medium tracking-wider rounded-sm border border-transparent text-ink hover:text-gold hover:border-ink/20 transition"
      >
        <GlobeIcon size={14} />
        <span className="hidden sm:inline">{lang.label}</span>
        <span className="sm:hidden uppercase">{lang.code}</span>
        <ChevronDownMini className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-1 min-w-[8rem] bg-paper border border-ink/15 rounded-sm shadow-lg overflow-hidden z-50"
        >
          {LANGUAGES.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={l.code === lang.code}
                onClick={() => {
                  setLang(l)
                  setOpen(false)
                }}
                className={`w-full text-left px-3 py-2 condensed text-xs tracking-wider transition hover:bg-paper-soft hover:text-gold-ink ${
                  l.code === lang.code ? 'text-gold-ink' : 'text-ink'
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-ink/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 sm:gap-4">
        <Brand />

        <nav className="hidden lg:flex items-center gap-5 xl:gap-6" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              className="nav-link condensed text-[0.85rem] font-medium hover:text-green-ink transition"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <LanguageSelector />
          <a
            className="btn-sheen group hidden sm:inline-flex items-center gap-1.5 condensed text-xs font-semibold tracking-wider bg-green text-paper px-3.5 sm:px-4 py-3 min-h-[44px] rounded-sm hover:bg-green-ink transition whitespace-nowrap shadow-[0_4px_14px_rgba(19,136,8,0.3)]"
            href="#join"
          >
            JOIN THE MOVEMENT <span aria-hidden="true" className="arrow">→</span>
          </a>
          <a
            className="hidden xl:inline-flex items-center condensed text-xs font-semibold tracking-wider border-2 border-ink text-ink px-3.5 py-3 min-h-[44px] rounded-sm hover:bg-ink hover:text-paper transition whitespace-nowrap"
            href="/issues"
          >
            RAISE AN ISSUE <span aria-hidden="true">→</span>
          </a>
          <button
            type="button"
            className="lg:hidden p-2 -mr-1 text-ink"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="lg:hidden border-t border-ink/10 bg-paper">
          <nav
            className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col"
            aria-label="Mobile"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="condensed text-base font-medium tracking-wide py-2.5 border-b border-ink/5 hover:text-gold transition"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              <a
                href="#join"
                onClick={() => setMenuOpen(false)}
                className="btn-sheen condensed text-sm font-semibold tracking-wider bg-green text-paper px-4 py-3 rounded-sm text-center hover:bg-green-ink transition"
              >
                JOIN THE MOVEMENT →
              </a>
              <a
                href="/issues"
                onClick={() => setMenuOpen(false)}
                className="condensed text-sm font-semibold tracking-wider border-2 border-ink text-ink px-4 py-3 rounded-sm text-center hover:bg-ink hover:text-paper transition"
              >
                RAISE AN ISSUE →
              </a>
            </div>
          </nav>
        </div>
      )}

      {/* tricolour accent line */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 flex h-[3px]">
        <div className="flex-1 bg-gold" />
        <div className="flex-1 bg-paper" />
        <div className="flex-1 bg-green" />
      </div>
    </header>
  )
}
