import Marquee from '../ui/Marquee'
import SpeakerPodium from '../ui/SpeakerPodium'
import ParliamentSilhouette from '../ui/ParliamentSilhouette'
import CrowdSilhouette from '../ui/CrowdSilhouette'
import { PosterPlaceholder } from '../ui/placeholders'
import CountUp from '../ui/CountUp'
import { HERO_STATS } from '../../data/site'
import { NEWS_TICKER } from '../../data/marquees'

const NOISE_URL =
  "url(\"data:image/svg+xml;utf8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'180'%20height%3D'180'%3E%3Cfilter%20id%3D'n'%3E%3CfeTurbulence%20type%3D'fractalNoise'%20baseFrequency%3D'0.9'%20numOctaves%3D'2'%20stitchTiles%3D'stitch'%2F%3E%3CfeColorMatrix%20values%3D'0%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200%200.45%200'%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D'100%25'%20height%3D'100%25'%20filter%3D'url(%23n)'%20opacity%3D'0.7'%2F%3E%3C%2Fsvg%3E\")"

const SMOKE_BG =
  'radial-gradient(ellipse at center, rgba(220,210,190,0.35) 0%, rgba(180,160,130,0.15) 35%, transparent 70%)'

const SMOKE_A = [
  { left: '-5%', width: '38%', opacity: 0.85 },
  { left: '30%', width: '32%', opacity: 0.65 },
  { left: '60%', width: '40%', opacity: 0.85 },
  { left: '95%', width: '32%', opacity: 0.7 },
  { left: '125%', width: '38%', opacity: 0.85 },
  { left: '160%', width: '32%', opacity: 0.65 },
]
const SMOKE_B = [
  { left: '5%', width: '34%', opacity: 0.6 },
  { left: '40%', width: '40%', opacity: 0.75 },
  { left: '80%', width: '34%', opacity: 0.6 },
  { left: '115%', width: '40%', opacity: 0.75 },
  { left: '150%', width: '34%', opacity: 0.6 },
]

const PARTICLES = Array.from({ length: 24 }, (_, i) => {
  const gold = i % 3 === 0
  return {
    left: `${(i * 7.3) % 100}%`,
    gold,
    delay: `${(i * 0.7).toFixed(2)}s`,
    duration: `${6 + (i % 6)}s`,
  }
})

function SmokeBlob({ left, width, opacity }) {
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: '20%',
        width,
        height: '70%',
        background: SMOKE_BG,
        filter: 'blur(30px)',
        opacity,
      }}
    />
  )
}

export default function Hero() {
  return (
    <section
      aria-label="Hero — Commission-Mukt Bharat rally"
      className="relative bg-black text-paper overflow-hidden border-b-2 border-[#ff9933]/40 min-h-[100svh] sm:min-h-[88vh] flex"
    >
      {/* ---------- Background scene ---------- */}
      <div className="absolute inset-0 scene-zoom" style={{ contain: 'paint' }} aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, #20201d 0%, #161513 45%, #0b0b0a 100%)' }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 100%, rgba(255,153,51,0.32) 0%, rgba(190,90,16,0.16) 35%, transparent 70%)',
          }}
        />
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none" />

        <ParliamentSilhouette
          className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[150%] max-w-none h-auto parallax-drift"
          style={{ filter: 'drop-shadow(0 0 60px rgba(255,153,51,0.25))', opacity: 0.78 }}
        />

        {/* floodlights */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-20 left-[8%] w-[280px] h-[120%] floodlight-1"
            style={{
              background:
                'linear-gradient(180deg, rgba(244,235,215,0.55) 0%, rgba(244,235,215,0.18) 35%, rgba(244,235,215,0) 80%)',
              filter: 'blur(30px)',
              transform: 'rotate(12deg)',
              transformOrigin: 'top center',
            }}
          />
          <div
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-[240px] h-[120%] floodlight-3"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,225,180,0.5) 0%, rgba(255,225,180,0.15) 35%, transparent 80%)',
              filter: 'blur(40px)',
              transform: 'rotate(-4deg)',
              transformOrigin: 'top center',
            }}
          />
          <div
            className="absolute -top-20 right-[6%] w-[320px] h-[120%] floodlight-2"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,153,51,0.45) 0%, rgba(255,153,51,0.15) 40%, transparent 80%)',
              filter: 'blur(36px)',
              transform: 'rotate(-14deg)',
              transformOrigin: 'top center',
            }}
          />
        </div>

        {/* smoke */}
        <div className="absolute inset-x-0 bottom-0 h-[70%] pointer-events-none overflow-hidden">
          <div className="absolute inset-0 smoke-a" style={{ width: '200%' }}>
            {SMOKE_A.map((s, i) => (
              <SmokeBlob key={i} {...s} />
            ))}
          </div>
          <div className="absolute inset-0 smoke-b opacity-70" style={{ width: '200%' }}>
            {SMOKE_B.map((s, i) => (
              <SmokeBlob key={i} {...s} />
            ))}
          </div>
        </div>

        {/* lens flares */}
        <div
          className="absolute top-[12%] right-[18%] w-72 h-72 rounded-full pointer-events-none lens-pulse"
          style={{
            background:
              'radial-gradient(circle at center, rgba(255,225,180,0.55) 0%, rgba(255,225,180,0.15) 40%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />
        <div
          className="absolute top-[40%] left-[10%] w-44 h-44 rounded-full pointer-events-none lens-pulse"
          style={{
            background:
              'radial-gradient(circle at center, rgba(255,153,51,0.45) 0%, rgba(255,153,51,0.12) 40%, transparent 70%)',
            filter: 'blur(18px)',
            animationDelay: '1.1s',
          }}
        />

        {/* crowd */}
        <CrowdSilhouette className="absolute bottom-0 inset-x-0 w-full h-[22vh] sm:h-[26vh]" />

        {/* camera flashes */}
        <div className="absolute inset-x-0 bottom-[22%] pointer-events-none">
          <div
            className="absolute left-[20%] w-3 h-3 rounded-full bg-paper camera-flash-1"
            style={{ boxShadow: '0 0 22px 6px rgba(244,235,215,0.85)' }}
          />
          <div
            className="absolute left-[55%] w-3 h-3 rounded-full bg-paper camera-flash-2"
            style={{ boxShadow: '0 0 22px 6px rgba(244,235,215,0.85)' }}
          />
          <div
            className="absolute left-[78%] w-3 h-3 rounded-full bg-paper camera-flash-3"
            style={{ boxShadow: '0 0 22px 6px rgba(244,235,215,0.85)' }}
          />
        </div>

        {/* tricolour parade float */}
        <div className="absolute right-[4%] sm:right-[5%] md:right-[6%] lg:right-[7%] bottom-[18%] w-[195px] sm:w-[330px] md:w-[430px] lg:w-[500px] max-w-[46vw] pointer-events-none">
          <SpeakerPodium />
        </div>

        {/* particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="absolute rounded-full particle-rise"
              style={{
                left: p.left,
                bottom: 0,
                width: '1px',
                height: '1px',
                background: p.gold ? 'rgba(255,160,60,0.85)' : 'rgba(244,235,215,0.6)',
                boxShadow: p.gold ? '0 0 6px rgba(255,160,60,0.6)' : '0 0 4px rgba(244,235,215,0.4)',
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
        </div>

        {/* film grain */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.14]"
          style={{ backgroundImage: NOISE_URL }}
        />
        {/* vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 28% 45%, transparent 35%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.85) 100%)',
          }}
        />
      </div>

      {/* ---------- Official poster card ---------- */}
      <div
        className="absolute top-3 right-3 sm:top-5 sm:right-5 md:top-6 md:right-6 z-20 w-[104px] sm:w-[180px] md:w-[210px] pointer-events-none"
        style={{ transform: 'rotate(2deg)' }}
      >
        <div className="float-bob bg-paper-soft border-2 border-ink rounded-sm shadow-[5px_5px_0_0_rgba(0,0,0,0.85)] p-2 sm:p-2.5">
          <div className="flex items-center justify-between condensed text-[0.55rem] sm:text-[0.65rem] text-ink/75 mb-1.5 px-0.5">
            <span>Official Poster · No. 001</span>
            <span className="text-gold tracking-widest hidden sm:inline">★ ★ ★</span>
          </div>
          <div className="relative aspect-[3/4] overflow-hidden border border-ink/30">
            <PosterPlaceholder />
            <div className="absolute top-1.5 right-1.5 approved-stamp text-gold-soft bg-ink/40 !text-[0.5rem] sm:!text-[0.6rem] !px-1.5 !py-0.5 !tracking-[0.18em]">
              Approved
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Content ---------- */}
      <div className="relative z-10 w-full self-stretch flex items-center">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-28 sm:pb-32">
          <div className="max-w-2xl lg:max-w-3xl">
            <div>
              <div className="eyebrow text-gold mb-5 sm:mb-6 flex items-center gap-3">
                <span
                  className="inline-block"
                  style={{ width: 12, height: 12, background: '#ff9933', transform: 'rotate(45deg)' }}
                  aria-hidden="true"
                />
                <span>Live rally · Since 2026</span>
              </div>
              <h1 className="text-[1.75rem] sm:text-5xl md:text-6xl lg:text-7xl leading-[1] sm:leading-[0.92] mb-6 sm:mb-8 drop-shadow-[0_2px_24px_rgba(0,0,0,0.7)]">
                <span className="block text-paper whitespace-nowrap">Commission-Mukt</span>
                <span className="block text-gold">Bharat.</span>
              </h1>
            </div>
            <p className="max-w-xl text-base sm:text-lg leading-relaxed text-paper/85 mb-10 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
              A citizens' movement for the India that refuses to pay a commission. Five demands. Zero kickbacks. One
              accountable nation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12">
              <a
                className="btn-sheen group condensed text-sm font-semibold tracking-wider bg-gold text-ink px-7 py-4 min-h-[48px] rounded-sm hover:bg-paper hover:text-ink transition inline-flex items-center justify-center gap-2 shadow-[0_6px_18px_rgba(255,153,51,0.4)]"
                href="#join"
              >
                JOIN THE MOVEMENT <span aria-hidden="true" className="arrow">→</span>
              </a>
              <a
                className="btn-sheen condensed text-sm font-semibold tracking-wider border-2 border-green text-paper px-7 py-4 min-h-[48px] rounded-sm hover:bg-green hover:text-paper hover:border-green transition inline-flex items-center justify-center backdrop-blur-sm bg-green/10"
                href="#manifesto"
              >
                READ THE MANIFESTO
              </a>
            </div>
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 pt-6 border-t border-paper/25 max-w-2xl">
              {HERO_STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display text-3xl sm:text-4xl text-paper drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
                    <CountUp value={stat.value} />
                  </dt>
                  <dd className="condensed text-[0.7rem] text-paper/70 mt-1">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* ---------- News ticker ---------- */}
      <div className="absolute inset-x-0 bottom-0 bg-[#11631f] text-paper border-t-2 border-[#ff9933]/70 py-2 z-20 overflow-hidden">
        <Marquee
          items={NEWS_TICKER}
          baseClass="news-ticker-track"
          renderItem={(text, i) => (
            <span key={i} className="condensed text-[0.7rem] sm:text-xs font-semibold inline-flex items-center gap-3 px-6">
              <span className="text-gold-soft">›</span>
              <span>{text}</span>
            </span>
          )}
        />
      </div>
    </section>
  )
}
