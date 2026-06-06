import { useState } from 'react'
import { MailIcon } from '../ui/Icons'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'success' | 'error'

  function handleSubmit(e) {
    e.preventDefault()
    // Honeypot + simple validation (no backend in this static rebuild).
    if (e.currentTarget.website?.value) return
    setStatus(EMAIL_RE.test(email) ? 'success' : 'error')
  }

  return (
    <form className="w-full" noValidate onSubmit={handleSubmit}>
      {/* honeypot for bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="flex flex-col sm:flex-row gap-2">
        <label className="flex-1 min-w-0">
          <span className="sr-only">Email address</span>
          <div className="relative">
            <MailIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-paper/55" />
            <input
              type="email"
              required
              placeholder="you@example.in"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status !== 'idle') setStatus('idle')
              }}
              className="w-full bg-paper/10 border-2 border-paper/30 rounded-sm px-4 py-3 pl-10 text-paper placeholder:text-paper/45 focus:border-green focus:outline-none focus:ring-2 focus:ring-green/50 transition"
            />
          </div>
        </label>
        <button
          type="submit"
          className="btn-sheen condensed text-sm font-semibold tracking-wider bg-green text-paper px-6 py-3 rounded-sm hover:bg-green-ink transition inline-flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(19,136,8,0.3)]"
        >
          SUBSCRIBE
        </button>
      </div>

      {status === 'success' ? (
        <p className="text-xs text-gold mt-2">You're on the list. One email, when it matters.</p>
      ) : status === 'error' ? (
        <p className="text-xs text-red-300 mt-2">Please enter a valid email address.</p>
      ) : (
        <p className="text-xs text-paper/55 mt-2">One email, when there's something to say. Unsubscribe anytime.</p>
      )}
    </form>
  )
}
