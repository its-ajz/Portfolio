'use client'

import { useIsMobile } from '../hooks/useIsMobile'

const SECTIONS = [
  { label: 'About',         pos: 0.09 },
  { label: 'XR',            pos: 0.22 },
  { label: 'Installations', pos: 0.40 },
  { label: 'UI / UX',       pos: 0.55 },
  { label: 'Art',           pos: 0.65 },
  { label: 'Research',      pos: 0.78 },
  { label: 'Contact',       pos: 0.90 },
]

function jumpTo(pos: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight
  window.scrollTo({ top: pos * max, behavior: 'smooth' })
}

export default function SectionNav({ scrollT }: { scrollT: number }) {
  const isMobile  = useIsMobile()
  if (scrollT < 0.03) return null

  const activeIdx = SECTIONS.reduce((acc, s, i) =>
    scrollT >= s.pos - 0.02 ? i : acc, -1
  )

  return (
    <div style={{
      position: 'fixed',
      right: isMobile ? '10px' : '22px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 150,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      alignItems: 'flex-end',
    }}>
      {SECTIONS.map((s, i) => {
        const isActive = i === activeIdx
        return (
          <button
            key={s.label}
            onClick={() => jumpTo(s.pos)}
            title={s.label}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '2px 0',
            }}
          >
            {!isMobile && (
              <span style={{
                fontSize: '9px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-dm-sans)',
                color: isActive ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.2)',
                transition: 'color 0.3s',
                whiteSpace: 'nowrap',
              }}>
                {s.label}
              </span>
            )}
            <div style={{
              width:  isActive ? '8px' : '5px',
              height: isActive ? '8px' : '5px',
              borderRadius: '50%',
              background: isActive ? '#00E5FF' : 'rgba(255,255,255,0.2)',
              boxShadow: isActive ? '0 0 8px #00E5FF' : 'none',
              transition: 'all 0.3s ease',
              flexShrink: 0,
            }} />
          </button>
        )
      })}
    </div>
  )
}'use client'
