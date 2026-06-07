/* Waving tricolour flag with a 24-spoke Ashoka Chakra, used as hero decor. */
const SPOKES = Array.from({ length: 24 }, (_, i) => i * 15)

export default function IndianFlag({ delay = 0 }) {
  return (
    <svg viewBox="0 0 120 140" className="w-full h-full overflow-visible">
      <rect x="2" y="0" width="3" height="140" fill="#0a0302" />
      <g className="flag-wave" style={{ animationDelay: `${delay}s`, transformOrigin: '5px 10px' }}>
        <path d="M5,4 Q35,2 65,8 Q95,14 115,6 L115,29 Q95,37 65,31 Q35,25 5,27 Z" fill="#FF9933" />
        <path d="M5,27 Q35,25 65,31 Q95,37 115,29 L115,52 Q95,60 65,54 Q35,48 5,50 Z" fill="#FFFFFF" />
        <path d="M5,50 Q35,48 65,54 Q95,60 115,52 L115,74 Q95,82 65,76 Q35,70 5,72 Z" fill="#138808" />
        <g transform="translate(60, 40.5)">
          <circle r="6.5" fill="none" stroke="#000080" strokeWidth="1" />
          {SPOKES.map((deg) => (
            <line
              key={deg}
              x1="0"
              y1="0"
              x2="0"
              y2="-6"
              stroke="#000080"
              strokeWidth="0.5"
              transform={`rotate(${deg})`}
            />
          ))}
          <circle r="0.9" fill="#000080" />
        </g>
      </g>
    </svg>
  )
}
