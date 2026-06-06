/* Themed initials avatar used in the live members ticker. */
export default function MemberAvatar({ initials, variant = 'gold' }) {
  const ink = variant === 'ink'
  const bg = ink ? '#232323' : '#FF9933'
  const border = ink ? '#FAFAF7' : '#232323'
  const text = ink ? '#FAFAF7' : '#232323'
  const dotBg = ink ? '#FF9933' : '#232323'
  const dotBorder = ink ? '#FAFAF7' : '#232323'

  return (
    <div
      className="relative w-9 h-9 rounded-full shrink-0 flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.18)]"
      style={{ background: bg, border: `1.5px solid ${border}` }}
      aria-hidden="true"
    >
      <span
        className="relative font-condensed font-bold tracking-wide text-[0.7rem] z-10"
        style={{ color: text, fontFamily: 'var(--font-condensed)' }}
      >
        {initials}
      </span>
      <span
        className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
        style={{ background: dotBg, border: `1px solid ${dotBorder}` }}
      />
    </div>
  )
}
