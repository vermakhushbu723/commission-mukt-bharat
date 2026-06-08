import Marquee from '../ui/Marquee'
import MemberAvatar from '../ui/MemberAvatar'
import { MEMBERS } from '../../data/members'

const fade = (dir) => ({
  background: `linear-gradient(to ${dir}, var(--paper-soft, #ecedf2), transparent)`,
})

export default function MembersTicker() {
  return (
    <div
      className="relative bg-paper-soft border-y border-ink/10 overflow-hidden py-2"
      role="region"
      aria-label="Latest 24 members of Commission-Mukt Bharat"
    >
      {/* tiranga strips top & bottom */}
      <div aria-hidden="true" className="tiranga-strip absolute inset-x-0 top-0 h-[3px] z-20" />
      <div aria-hidden="true" className="tiranga-strip absolute inset-x-0 bottom-0 h-[3px] z-20" />

      <div aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none" style={fade('right')} />
      <div aria-hidden="true" className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none" style={fade('left')} />

      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden sm:flex items-center gap-2 bg-ink text-paper px-2.5 py-1 rounded-sm shadow-md">
        <span className="lens-pulse w-1.5 h-1.5 rounded-full bg-green" style={{ boxShadow: '0 0 7px rgba(19,136,8,0.95)' }} />
        <span className="text-[0.6rem] font-bold tracking-[0.18em] uppercase" style={{ fontFamily: 'var(--font-condensed)' }}>
          Live · Joining now
        </span>
      </div>

      <Marquee
        items={MEMBERS}
        duration={120}
        renderItem={(m, i) => (
          <span
            key={`${m.id}-${i}`}
            className="inline-flex items-center gap-2.5 px-3 py-1 mx-1 rounded-full bg-paper border border-ink/10 whitespace-nowrap"
            title={`REQ / ${m.id} · ${m.name} · ${m.location}`}
          >
            <MemberAvatar initials={m.initials} variant={m.variant} />
            <span className="flex flex-col leading-tight">
              <span className="text-[0.78rem] font-medium text-ink">{m.name}</span>
              <span
                className="text-[0.6rem] text-ink/55 tracking-[0.12em] uppercase"
                style={{ fontFamily: 'var(--font-condensed)' }}
              >
                {m.location}
              </span>
            </span>
          </span>
        )}
      />
    </div>
  )
}
