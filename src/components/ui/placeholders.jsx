/* The original site shipped three photographs (hero poster, rally banner,
   revolutionaries tribute) that aren't available offline. These designed,
   on-brand SVG/CSS stand-ins keep the layout complete and intentional. */
import Logo from './Logo'
import ParliamentSilhouette from './ParliamentSilhouette'
import CrowdSilhouette from './CrowdSilhouette'

function Tricolour({ className = '' }) {
  return (
    <div className={`flex w-full overflow-hidden ${className}`} aria-hidden="true">
      <div className="h-full flex-1" style={{ background: '#FF9933' }} />
      <div className="h-full flex-1" style={{ background: '#FFFFFF' }} />
      <div className="h-full flex-1" style={{ background: '#138808' }} />
    </div>
  )
}

/* Hero "Official Poster" — a dramatic rally bill. */
export function PosterPlaceholder({ className = '' }) {
  return (
    <div
      className={`absolute inset-0 flex flex-col items-center justify-center text-center overflow-hidden ${className}`}
      aria-hidden="true"
      style={{ background: 'radial-gradient(ellipse at 50% 28%, #20201d 0%, #161513 55%, #0b0b0a 100%)' }}
    >
      <div
        className="absolute inset-x-0 top-0 h-2/3 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,225,180,0.38) 0%, transparent 68%)' }}
      />
      <div className="relative mb-3 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
        <Logo variant="light" className="h-16 sm:h-20 w-auto" />
      </div>
      <div className="condensed text-gold text-[0.62rem] sm:text-[0.78rem] font-semibold tracking-[0.2em] leading-tight">
        COMMISSION-MUKT
        <br />
        BHARAT
      </div>
      <div className="condensed text-paper/70 text-[0.5rem] sm:text-[0.6rem] tracking-[0.18em] uppercase mt-2 px-3">
        Towards a Corruption-Free India
      </div>
      <Tricolour className="absolute bottom-0 inset-x-0 h-2" />
    </div>
  )
}

/* Vision section — "The People's Banner" rally scene. */
export function VisionPlaceholder({ className = '' }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
      style={{ background: 'linear-gradient(180deg, #f6e3b0 0%, #efa64e 38%, #b85a18 78%, #3a1606 100%)' }}
    >
      <div
        className="absolute left-1/2 -translate-x-1/2 top-[12%] w-40 h-40 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,240,210,0.9) 0%, rgba(255,210,140,0.2) 55%, transparent 72%)' }}
      />
      <ParliamentSilhouette
        className="absolute bottom-[30%] left-1/2 -translate-x-1/2 w-[150%] max-w-none h-auto"
        style={{ opacity: 0.85 }}
      />
      <CrowdSilhouette className="absolute bottom-0 inset-x-0 w-full h-[38%]" />
      <div className="absolute bottom-[34%] left-1/2 -translate-x-1/2 -rotate-2">
        <div className="bg-ink text-paper condensed text-[0.6rem] sm:text-xs font-semibold tracking-[0.18em] uppercase px-3 py-1 border border-gold/60 shadow-lg whitespace-nowrap">
          The People's Banner
        </div>
      </div>
    </div>
  )
}

/* Revolutionaries tribute poster. */
const TRIBUTE_NAMES = [
  'Bhagat Singh',
  'C. S. Azad',
  'R. P. Bismil',
  'Ashfaqulla Khan',
  'B. R. Ambedkar',
  'Rani Lakshmibai',
  'Sardar Patel',
  'S. C. Bose',
]
const CHAKRA_SPOKES = Array.from({ length: 24 }, (_, i) => i * 15)

export function RevolutionariesPlaceholder({ className = '' }) {
  return (
    <svg viewBox="0 0 1024 528" className={`w-full h-auto ${className}`} role="img" aria-label="Revolutionaries of India tribute poster" style={{ background: '#f4f2ea' }}>
      {/* tricolour band */}
      <rect x="0" y="0" width="1024" height="14" fill="#FF9933" />
      <rect x="0" y="14" width="1024" height="14" fill="#ffffff" />
      <rect x="0" y="28" width="1024" height="14" fill="#138808" />
      <rect x="0" y="486" width="1024" height="14" fill="#FF9933" />
      <rect x="0" y="500" width="1024" height="14" fill="#ffffff" />
      <rect x="0" y="514" width="1024" height="14" fill="#138808" />

      {/* Ashoka chakra */}
      <g transform="translate(512 96)" stroke="#1a2a6c" fill="none">
        <circle r="40" strokeWidth="4" />
        <circle r="5" fill="#1a2a6c" stroke="none" />
        {CHAKRA_SPOKES.map((deg) => (
          <line key={deg} x1="0" y1="0" x2="0" y2="-38" strokeWidth="2" transform={`rotate(${deg})`} />
        ))}
      </g>

      {/* title */}
      <text
        x="512"
        y="172"
        textAnchor="middle"
        fontFamily="Oswald, Arial Narrow, sans-serif"
        fontSize="34"
        fontWeight="700"
        letterSpacing="6"
        fill="#232323"
      >
        REVOLUTIONARIES OF INDIA
      </text>

      {/* portrait busts */}
      {TRIBUTE_NAMES.map((name, i) => {
        const cx = 96 + i * 119
        const cy = 300
        const cap = i % 3 === 0
        return (
          <g key={name}>
            <circle cx={cx} cy={cy} r="52" fill="#d8c69b" stroke="#232323" strokeWidth="3" />
            <clipPath id={`bust-${i}`}>
              <circle cx={cx} cy={cy} r="52" />
            </clipPath>
            <g clipPath={`url(#bust-${i})`} fill="#2a1c10">
              <path d={`M${cx - 46} ${cy + 56} Q${cx} ${cy + 6} ${cx + 46} ${cy + 56} Z`} />
              <circle cx={cx} cy={cy - 8} r="22" />
              {cap && <path d={`M${cx - 24} ${cy - 18} Q${cx} ${cy - 44} ${cx + 24} ${cy - 18} Z`} />}
            </g>
            <text
              x={cx}
              y={cy + 78}
              textAnchor="middle"
              fontFamily="Oswald, Arial Narrow, sans-serif"
              fontSize="15"
              fontWeight="600"
              fill="#232323"
            >
              {name}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
