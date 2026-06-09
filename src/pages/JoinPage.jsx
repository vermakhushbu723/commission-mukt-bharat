import { useState } from 'react'
import { SITE } from '../data/site'

const CONCERNS = [
  'Paying high commission to e-commerce',
  'Buying food at higher rates',
  'Earning less due to various commissions',
  'Want to make India commission-free',
  'Anything else',
]
const OTHER_INDEX = CONCERNS.length - 1

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[6-9]\d{9}$/ // 10-digit Indian mobile

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar', 'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu', 'Delhi',
  'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

const FIELD =
  'w-full bg-paper border-2 border-ink/25 rounded-sm px-4 py-3 text-ink placeholder:text-ink/40 focus:border-green focus:outline-none focus:ring-2 focus:ring-green/40 transition'

function Label({ children, htmlFor, required }) {
  return (
    <label htmlFor={htmlFor} className="condensed text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-ink/70 mb-1.5 block">
      {children} {required && <span className="text-gold-ink">*</span>}
    </label>
  )
}

export default function JoinPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', state: '', agree: false })
  const [standards, setStandards] = useState(() => new Set())
  const [other, setOther] = useState('')
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const toggleStandard = (index) =>
    setStandards((prev) => {
      const next = new Set(prev)
      next.has(index) ? next.delete(index) : next.add(index)
      return next
    })

  function validate() {
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Please enter your full name.'
    if (!EMAIL_RE.test(form.email)) next.email = 'Please enter a valid email address.'
    if (!PHONE_RE.test(form.phone.replace(/\s|-/g, ''))) next.phone = 'Enter a valid 10-digit mobile number.'
    if (form.city.trim().length < 2) next.city = 'Please enter your city.'
    if (!form.state) next.state = 'Please select your state.'
    if (!form.agree) next.agree = 'Please accept to continue.'
    return next
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (e.currentTarget.website?.value) return // honeypot
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length === 0) {
      // No backend in this static build — show confirmation.
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <main id="main-content" className="min-h-screen bg-transparent text-ink relative">
      <section className="py-16 sm:py-20 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Heading */}
          <div className="text-center mb-12 reveal is-visible">
            <div className="eyebrow text-green-ink mb-5">Membership · Free & lifelong</div>
            <h1 className="heading-section mb-2">
              Join the <em className="text-gold-ink">movement.</em>
            </h1>
            <span className="title-rule center mb-6" aria-hidden="true" />
            <p className="text-base sm:text-lg text-ink/75 max-w-xl mx-auto">
              Add your name to <strong className="text-ink">{SITE.memberCount}</strong> citizens building a
              Commission-Mukt Bharat. No fees, no donors, no fine print.
            </p>
          </div>

          {submitted ? (
            <div className="bg-paper-soft border-2 border-ink rounded-sm p-8 sm:p-12 text-center shadow-[6px_6px_0_0_rgba(35,35,35,0.85)]">
              <div className="font-display text-6xl text-green mb-4" aria-hidden="true">✓</div>
              <h2 className="font-display text-3xl sm:text-4xl mb-3">
                Welcome aboard, <em className="text-gold-ink">{form.name.split(' ')[0]}.</em>
              </h2>
              <p className="text-ink/75 max-w-md mx-auto leading-relaxed mb-8">
                You're now part of Commission-Mukt Bharat. We'll reach out at{' '}
                <strong className="text-ink break-all">{form.email}</strong> with your next steps. No spam — promise.
              </p>
              <a
                href="/"
                className="btn-sheen condensed text-sm font-semibold tracking-wider bg-green text-paper px-8 py-4 rounded-sm hover:bg-green-ink transition inline-flex items-center gap-2 shadow-[0_6px_18px_rgba(19,136,8,0.3)]"
              >
                ← BACK TO HOME
              </a>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={handleSubmit}
              className="bg-paper-soft border-2 border-ink rounded-sm p-6 sm:p-10 shadow-[6px_6px_0_0_rgba(35,35,35,0.85)]"
            >
              {/* honeypot */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <Label htmlFor="name" required>Full name</Label>
                  <input id="name" type="text" value={form.name} onChange={set('name')} placeholder="e.g. Asha Sharma" className={FIELD} autoComplete="name" />
                  {errors.name && <p className="text-xs text-red-600 mt-1.5">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="email" required>Email</Label>
                  <input id="email" type="email" value={form.email} onChange={set('email')} placeholder="you@example.in" className={FIELD} autoComplete="email" />
                  {errors.email && <p className="text-xs text-red-600 mt-1.5">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone" required>Mobile number</Label>
                  <input id="phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="10-digit mobile" className={FIELD} autoComplete="tel" inputMode="numeric" />
                  {errors.phone && <p className="text-xs text-red-600 mt-1.5">{errors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="city" required>City</Label>
                  <input id="city" type="text" value={form.city} onChange={set('city')} placeholder="e.g. Lucknow" className={FIELD} autoComplete="address-level2" />
                  {errors.city && <p className="text-xs text-red-600 mt-1.5">{errors.city}</p>}
                </div>

                <div>
                  <Label htmlFor="state" required>State / UT</Label>
                  <select id="state" value={form.state} onChange={set('state')} className={FIELD}>
                    <option value="">Select your state…</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-xs text-red-600 mt-1.5">{errors.state}</p>}
                </div>
              </div>

              {/* Standards */}
              <fieldset className="mt-8">
                <legend className="condensed text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-ink/70 mb-3">
                  Your motive to join us <span className="normal-case tracking-normal text-ink/45">(optional)</span>
                </legend>
                <div className="grid sm:grid-cols-2 gap-3">
                  {CONCERNS.map((label, index) => {
                    const active = standards.has(index)
                    return (
                      <button
                        key={label}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleStandard(index)}
                        className={`text-left flex items-center gap-3 border-2 rounded-sm px-4 py-3 transition ${
                          active ? 'border-green bg-green/10' : 'border-ink/20 bg-paper hover:border-ink'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center text-xs shrink-0 ${
                            active ? 'bg-green border-green text-paper' : 'border-ink/40 text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                        <span className="font-display text-base leading-tight">{label}</span>
                      </button>
                    )
                  })}
                </div>

                {standards.has(OTHER_INDEX) && (
                  <textarea
                    value={other}
                    onChange={(e) => setOther(e.target.value)}
                    rows={2}
                    placeholder="Anything else — describe…"
                    aria-label="Describe anything else"
                    className={`${FIELD} mt-3`}
                  />
                )}
              </fieldset>

              {/* Consent */}
              <label className="flex items-start gap-3 mt-8 cursor-pointer">
                <input type="checkbox" checked={form.agree} onChange={set('agree')} className="mt-1 w-5 h-5 accent-green shrink-0" />
                <span className="text-sm text-ink/75 leading-relaxed">
                  I want a commission-mukt Bharat and agree to receive updates. My Membership is free and I can leave
                  anytime.
                </span>
              </label>
              {errors.agree && <p className="text-xs text-red-600 mt-1.5">{errors.agree}</p>}

              <button
                type="submit"
                className="btn-sheen w-full mt-8 condensed text-sm font-semibold tracking-wider bg-green text-paper px-8 py-4 rounded-sm hover:bg-green-ink transition inline-flex items-center justify-center gap-2 shadow-[0_6px_18px_rgba(19,136,8,0.3)]"
              >
                JOIN THE MOVEMENT <span aria-hidden="true" className="arrow">→</span>
              </button>
              <p className="text-xs text-ink/55 mt-4 text-center">
                Free, lifelong, and revocable only by you. No fees. {SITE.weekJoins} joined this week.
              </p>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}
