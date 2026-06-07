/* Generic infinite marquee. Renders `items` twice inside an animated track,
   so a translateX(-50%) loop is perfectly seamless. */
export default function Marquee({
  items,
  renderItem,
  fast = false,
  duration,
  baseClass = 'marquee-track',
  trackClassName = '',
  className = '',
  ariaLabel,
}) {
  const doubled = [...items, ...items]
  return (
    <div className={`overflow-hidden ${className}`} aria-label={ariaLabel} role={ariaLabel ? 'region' : undefined}>
      <div
        className={`${baseClass} ${fast ? 'marquee-track-fast' : ''} ${trackClassName}`.trim()}
        style={duration ? { animationDuration: `${duration}s` } : undefined}
      >
        {doubled.map((item, i) => renderItem(item, i))}
      </div>
    </div>
  )
}
