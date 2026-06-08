import { useState } from 'react'
import { MessageCircleIcon, CloseIcon } from './ui/Icons'
import { SITE } from '../data/site'

export default function SwarmChatButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="Live Chat"
          className="fixed bottom-[88px] right-4 sm:bottom-24 sm:right-6 z-[60] w-[min(320px,calc(100vw-2rem))] bg-paper border-2 border-ink rounded-sm shadow-[6px_6px_0_0_rgba(35,35,35,0.85)] p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="eyebrow text-gold-ink">Live Chat</div>
            <button type="button" aria-label="Close chat" onClick={() => setOpen(false)} className="text-ink/60 hover:text-ink transition">
              <CloseIcon size={16} />
            </button>
          </div>
          <p className="text-sm text-ink/75 leading-relaxed mb-4">
            Live chat isn't up yet. Send a tip, an RTI reply, or a receipt — we read every word.
          </p>
          <a
            href={`mailto:${SITE.emails.contact}`}
            className="btn-sheen condensed text-xs font-semibold tracking-wider bg-ink text-paper px-4 py-2.5 rounded-sm hover:bg-gold hover:text-ink transition inline-flex items-center gap-2"
          >
            EMAIL US <span aria-hidden="true">→</span>
          </a>
        </div>
      )}

      <button
        type="button"
        aria-label="Open chat"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="btn-tiranga-ring fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] inline-flex items-center gap-2 px-3 py-3 sm:px-4 sm:py-3.5 text-paper rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)] transition min-h-[52px] min-w-[52px]"
      >
        {open ? <CloseIcon size={18} /> : <MessageCircleIcon size={18} />}
        <span
          className="hidden sm:inline text-[0.72rem] sm:text-[0.75rem] font-bold tracking-[0.18em] uppercase"
          style={{ fontFamily: 'var(--font-condensed)' }}
        >
          Live Chat
        </span>
      </button>
    </>
  )
}
