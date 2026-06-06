/* Silhouette of a packed rally crowd — replaces the original /hero/crowd.svg.
   Heads are placed deterministically (a sine sweep), with a few raised fists
   and protest placards so it reads as a swarm, not a fence. */
const COUNT = 64

function buildCrowd() {
  const heads = []
  for (let i = 0; i < COUNT; i++) {
    const x = (i + 0.5) * (1200 / COUNT)
    // deterministic head height variation
    const lift = 8 * Math.sin(i * 1.7) + 5 * Math.sin(i * 0.6)
    const top = 46 - lift
    const r = 9 + 2.2 * Math.sin(i * 2.3)
    heads.push({ x, top, r, fist: i % 9 === 3, placard: i % 13 === 6 })
  }
  return heads
}

const CROWD = buildCrowd()

export default function CrowdSilhouette({ className = '', style }) {
  return (
    <svg
      viewBox="0 0 1200 120"
      className={className}
      style={style}
      aria-hidden="true"
      preserveAspectRatio="xMidYMax slice"
    >
      <g fill="#0a0302">
        {CROWD.map((p, i) => (
          <g key={i}>
            {/* shoulders */}
            <path d={`M${p.x - p.r * 2.1} 120 Q${p.x} ${p.top + p.r * 2.4} ${p.x + p.r * 2.1} 120 Z`} />
            {/* head */}
            <circle cx={p.x} cy={p.top} r={p.r} />
            {/* raised fist */}
            {p.fist && (
              <>
                <rect x={p.x - 3} y={p.top - 34} width="6" height="30" rx="3" />
                <circle cx={p.x} cy={p.top - 36} r="6" />
              </>
            )}
            {/* placard on a pole */}
            {p.placard && (
              <>
                <rect x={p.x + 8} y={p.top - 52} width="3" height="52" />
                <rect x={p.x - 14} y={p.top - 64} width="44" height="22" rx="2" fill="#FF9933" />
              </>
            )}
          </g>
        ))}
      </g>
    </svg>
  )
}
