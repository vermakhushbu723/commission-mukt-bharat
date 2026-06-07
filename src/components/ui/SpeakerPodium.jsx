/* The hero's centrepiece: a tricolour parade float flying a large, waving
   Indian flag with the brand banner. (Replaces the earlier satirical figure.) */
const CHAKRA_SPOKES = Array.from({ length: 24 }, (_, i) => i * 15)

export default function SpeakerPodium() {
  return (
    <svg viewBox="0 0 400 340" className="w-full h-auto overflow-visible" aria-hidden="true">
      {/* warm glow */}
      <ellipse cx="200" cy="130" rx="190" ry="120" fill="rgba(255,225,180,0.18)" style={{ filter: 'blur(20px)' }} />

      {/* ---- tall flagpole + big waving tricolour ---- */}
      <g transform="translate(118, 10)">
        {/* pole */}
        <rect x="-4" y="0" width="8" height="232" rx="4" fill="#0a0302" />
        <circle cx="0" cy="0" r="8" fill="#FF9933" />
        <circle cx="0" cy="0" r="3" fill="#fafaf7" />

        {/* flag — three bands + Ashoka chakra, gently waving */}
        <g className="flag-wave" style={{ transformOrigin: '0px 12px' }}>
          <path d="M4,8 Q46,1 92,10 Q138,19 182,8 L182,42 Q138,53 92,42 Q46,33 4,42 Z" fill="#FF9933" />
          <path d="M4,42 Q46,33 92,42 Q138,53 182,42 L182,76 Q138,87 92,76 Q46,67 4,76 Z" fill="#FFFFFF" />
          <path d="M4,76 Q46,67 92,76 Q138,87 182,76 L182,110 Q138,121 92,110 Q46,101 4,110 Z" fill="#138808" />
          <g transform="translate(92, 59)" stroke="#0a2a6c" fill="none">
            <circle r="14" strokeWidth="1.8" />
            {CHAKRA_SPOKES.map((deg) => (
              <line key={deg} x1="0" y1="0" x2="0" y2="-13" strokeWidth="0.9" transform={`rotate(${deg})`} />
            ))}
            <circle r="1.8" fill="#0a2a6c" stroke="none" />
          </g>
        </g>
      </g>

      {/* ---- parade float / cart ---- */}
      <g fill="#0a0302">
        <rect x="40" y="240" width="320" height="38" rx="2" />
        <rect x="40" y="278" width="320" height="14" />
        <circle cx="104" cy="298" r="22" />
        <circle cx="316" cy="298" r="22" />
        <circle cx="104" cy="298" r="9" fill="#1a0805" />
        <circle cx="316" cy="298" r="9" fill="#1a0805" />
      </g>

      {/* tricolour skirt along the float front */}
      <g>
        <rect x="40" y="240" width="320" height="4" fill="#FF9933" />
        <rect x="40" y="288" width="320" height="4" fill="#138808" />
        <rect x="56" y="250" width="288" height="22" rx="2" fill="#FF9933" />
        <text
          x="200"
          y="266"
          textAnchor="middle"
          fontFamily="Oswald, Arial Narrow, sans-serif"
          fontSize="13"
          fontWeight="700"
          letterSpacing="2.5"
          fill="#fafaf7"
        >
          COMMISSION-MUKT BHARAT · 2026
        </text>
      </g>
    </svg>
  )
}
