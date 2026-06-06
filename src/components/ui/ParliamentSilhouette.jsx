/* Stylised silhouette of a grand domed parliament — replaces the original
   /hero/parliament.svg backdrop. Drawn as one dark fill so it reads as a
   silhouette behind the rally's smoke and floodlights. */
const COLUMNS = Array.from({ length: 23 }, (_, i) => 170 + i * 38)

export default function ParliamentSilhouette({ className = '', style }) {
  return (
    <svg viewBox="0 0 1200 320" className={className} style={style} aria-hidden="true" preserveAspectRatio="xMidYMax meet">
      <g fill="#0a0302">
        {/* base platform + steps */}
        <rect x="80" y="292" width="1040" height="28" />
        <rect x="120" y="278" width="960" height="16" />
        {/* main hall */}
        <rect x="150" y="176" width="900" height="104" />
        {/* colonnade */}
        {COLUMNS.map((x) => (
          <rect key={x} x={x} y="196" width="14" height="84" />
        ))}
        <rect x="150" y="186" width="900" height="12" />
        {/* central drum + dome */}
        <rect x="520" y="120" width="160" height="60" />
        <path d="M520 122 Q600 36 680 122 Z" />
        <rect x="592" y="70" width="16" height="22" />
        <circle cx="600" cy="60" r="12" />
        <rect x="598" y="20" width="4" height="34" />
        {/* tiny tricolour bar on the finial */}
        <rect x="602" y="22" width="26" height="14" fill="#FF9933" />
        {/* flanking domes */}
        <rect x="300" y="150" width="90" height="30" />
        <path d="M300 152 Q345 110 390 152 Z" />
        <rect x="810" y="150" width="90" height="30" />
        <path d="M810 152 Q855 110 900 152 Z" />
      </g>
    </svg>
  )
}
