'use client'

const ZONES = [
  { label: 'XR & Spatial Computing', start: 0.20, end: 0.40 },
  { label: 'Installations',          start: 0.40, end: 0.55 },
  { label: 'UI / UX',                start: 0.55, end: 0.65 },
  { label: 'Art',                    start: 0.65, end: 0.78 },
  { label: 'Research & Other',       start: 0.78, end: 0.90 },
]

export default function ZoneIndicator({ scrollT }: { scrollT: number }) {
  const zone    = ZONES.find(z => scrollT >= z.start && scrollT <= z.end)
  if (!zone) return null

  const opacity = Math.min(
    Math.min(1, (scrollT - zone.start) / 0.025),
    Math.min(1, (zone.end - scrollT)   / 0.025)
  )

  return (
    <div style={{
      position: 'fixed', top: '68px', left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 150, opacity, pointerEvents: 'none',
    }}>
      <div style={{
        padding: '5px 16px',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '20px',
        background: 'rgba(2,8,24,0.65)',
        backdropFilter: 'blur(10px)',
        fontSize: '10px', color: 'rgba(255,255,255,0.55)',
        letterSpacing: '0.18em', textTransform: 'uppercase',
        fontFamily: 'var(--font-dm-sans)', whiteSpace: 'nowrap',
      }}>
        {zone.label}
      </div>
    </div>
  )
}