// The movement's deeper vision — what a Commission-Mukt Bharat actually looks like.
// Dark section: keeps the tricolour billing (gold / green) and reveal-on-scroll.
const PILLARS = [
  {
    n: '01',
    title: 'Total Transparency',
    body: 'Every public rupee — sanctioned, spent, or quietly “adjusted” — should be traceable by any citizen. Budgets in the open. Tenders in the open. Receipts on demand.',
    accent: 'text-gold',
  },
  {
    n: '02',
    title: 'Zero Commissions',
    body: 'No cut to register a complaint. No bribe to clear a file. No kickback to simply be heard. What is yours by right should never carry a price tag.',
    accent: 'text-green',
  },
  {
    n: '03',
    title: 'Citizens in Charge',
    body: 'Accountability driven by people, not parties. A Bharat where ordinary citizens ask the hard questions — loudly, repeatedly, and in writing — and expect real answers.',
    accent: 'text-gold',
  },
  {
    n: '04',
    title: 'Corruption Made Costly',
    body: 'Make graft the most expensive habit in Indian public life. When every leaked rupee invites a thousand questions, the quiet scam stops being quiet — and stops being safe.',
    accent: 'text-green',
  },
]

export default function OurVision() {
  return (
    <section
      id="vision-deep"
      className="bg-ink text-paper py-20 sm:py-28 md:py-36 relative overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(to bottom, rgba(255,153,51,0.15) 0%, rgba(255,153,51,0.04) 16%, transparent 34%, transparent 66%, rgba(19,136,8,0.06) 84%, rgba(19,136,8,0.18) 100%)',
      }}
    >
      <div className="absolute inset-0 opacity-[0.04] paper-grain pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Heading */}
        <div className="text-center mb-14 sm:mb-16 max-w-2xl mx-auto reveal">
          <div className="eyebrow text-gold mb-5">Our Vision</div>
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-2 leading-[0.95]">
            The Bharat we're <em className="text-gold">building.</em>
          </h2>
          <span className="title-rule center mb-6" aria-hidden="true" />
          <p className="text-base sm:text-lg text-paper/75 leading-relaxed">
            Commission-Mukt Bharat is not a political party, an NGO, or a donation drive. It is a citizens' movement
            with one stubborn idea: a nation where honesty is the default and a commission is the exception — not the
            other way around.
          </p>
        </div>

        {/* Pillars */}
        <ol className="grid sm:grid-cols-2 gap-px bg-paper/15 border border-paper/15 rounded-sm overflow-hidden max-w-5xl mx-auto">
          {PILLARS.map((p, index) => (
            <li
              key={p.n}
              className="bg-ink p-7 sm:p-9 reveal"
              style={{ '--reveal-delay': `${index * 80}ms` }}
            >
              <div className={`font-display text-4xl sm:text-5xl ${p.accent} leading-none mb-4`}>{p.n}</div>
              <h3 className="font-display text-2xl sm:text-3xl mb-3">{p.title}</h3>
              <p className="text-sm sm:text-base leading-relaxed text-paper/80">{p.body}</p>
            </li>
          ))}
        </ol>

        {/* Closing statement */}
        <div className="max-w-3xl mx-auto text-center mt-14 sm:mt-16 reveal">
          <p className="font-display text-2xl sm:text-3xl md:text-4xl leading-snug">
            We're not asking for a <em className="text-gold">cleaner</em> system.
            <br className="hidden sm:block" /> We're building the <em className="text-green">habit</em> of demanding one.
          </p>
          <div className="mt-10">
            <a
              className="btn-sheen group condensed text-sm font-semibold tracking-wider bg-green text-paper px-8 py-4 rounded-sm hover:bg-green-ink transition inline-flex items-center gap-2 shadow-[0_6px_18px_rgba(19,136,8,0.3)]"
              href="/join"
            >
              STAND WITH US <span aria-hidden="true" className="arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
