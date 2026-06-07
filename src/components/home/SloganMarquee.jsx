import Marquee from '../ui/Marquee'
import { SLOGANS } from '../../data/marquees'

export default function SloganMarquee() {
  return (
    <div className="bg-paper-soft border-y-2 border-ink/15 py-3">
      <Marquee
        items={SLOGANS}
        fast
        renderItem={(text, i) => (
          <span key={i} className="condensed text-xs sm:text-sm inline-flex items-center gap-4 px-6">
            <span className="text-green-ink">✦</span>
            <span>{text}</span>
          </span>
        )}
      />
    </div>
  )
}
