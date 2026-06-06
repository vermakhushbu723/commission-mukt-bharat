import { useEffect, useRef, useState } from 'react'

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Counts up to a numeric target the first time it scrolls into view.
   Non-numeric values (e.g. "∞") render as-is. Preserves Indian thousands
   grouping and any trailing suffix like "+". */
export default function CountUp({ value, duration = 1600, className = '' }) {
  const ref = useRef(null)
  const match = String(value).match(/^(\D*)([\d,]+)(.*)$/)
  const hasNumber = !!match
  const target = hasNumber ? Number(match[2].replace(/,/g, '')) : 0
  const prefix = hasNumber ? match[1] : ''
  const suffix = hasNumber ? match[3] : ''

  // Reduced-motion users see the final number immediately (no in-effect setState).
  const [display, setDisplay] = useState(() => (hasNumber && prefersReduced() ? target : 0))

  useEffect(() => {
    if (!hasNumber || prefersReduced()) return
    const el = ref.current
    if (!el) return

    let raf = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        io.unobserve(el)
        const start = performance.now()
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - t, 3)
          setDisplay(Math.round(target * eased))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [hasNumber, target, duration])

  return (
    <span ref={ref} className={className}>
      {hasNumber ? `${prefix}${display.toLocaleString('en-IN')}${suffix}` : value}
    </span>
  )
}
