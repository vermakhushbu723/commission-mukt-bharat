import Marquee from '../ui/Marquee'
import { ANNOUNCEMENTS } from '../../data/marquees'

export default function AnnouncementBar() {
  return (
    <div className="bg-ink text-paper">
      {/* tricolour accent strip */}
      <div className="flex h-1" aria-hidden="true">
        <div className="flex-1" style={{ background: '#FF9933' }} />
        <div className="flex-1" style={{ background: '#FFFFFF' }} />
        <div className="flex-1" style={{ background: '#138808' }} />
      </div>
      <div className="border-b border-rule-on-ink py-2">
        <Marquee
          items={ANNOUNCEMENTS}
          renderItem={(text, i) => (
            <span key={i} className="condensed text-xs sm:text-sm inline-flex items-center gap-4 px-6">
              <span className="text-gold">✦</span>
              <span>{text}</span>
            </span>
          )}
        />
      </div>
    </div>
  )
}
