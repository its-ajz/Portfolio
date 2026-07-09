'use client'

import { useIsMobile } from '../hooks/useIsMobile'

const LINKS = [
  { label: 'Email', value: 'anjali.zalani@icloud.com', href: 'mailto:anjali.zalani@icloud.com' },
  { label: 'LinkedIn', value: 'linkedin.com/in/anjali-zalani/', href: 'https://www.linkedin.com/in/anjali-zalani/' },
  { label: 'GitHub', value: 'github.com/its-ajz', href: 'https://github.com/its-ajz' },
]

export default function ContactSection({ scrollT }: { scrollT: number }) {
  const isMobile = useIsMobile()
  const opacity  = Math.min(1, Math.max(0, (scrollT - 0.88) / 0.04))

  if (opacity <= 0) return null

  return (
    <div style={{
      position: 'fixed',
      top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 150, opacity,
      textAlign: 'center',
      padding: '0 24px',
    }}>
      <p style={{
        fontSize: '11px', color: '#00E5FF',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        marginBottom: '20px', fontFamily: 'var(--font-dm-sans)',
      }}>
        Let's work together
      </p>

      <h2 style={{
        fontSize: isMobile ? '32px' : '52px',
        fontWeight: 300, color: 'white',
        letterSpacing: '-0.01em', lineHeight: 1.1,
        marginBottom: '40px', fontFamily: 'var(--font-dm-sans)',
      }}>
        Get in touch
      </h2>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center',
        // Text-color alone couldn't win against the bell's brightest rim
        // highlight directly behind this block (confirmed visually — the
        // GITHUB row sits over near-white glow). 0.78 opacity is the
        // computed minimum that keeps the label/value text above 4.5:1
        // even blended against a near-white (248,248,250) worst-case
        // backdrop; picked 0.82 for a bit of margin. Scoped to just the
        // link rows, not the heading above, which read fine already.
        background: 'rgba(2,8,24,0.82)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,229,255,0.1)',
        borderRadius: '16px',
        padding: '20px 24px',
      }}>
        {LINKS.map(({ label, value, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', flexDirection: 'column', gap: '3px',
              textDecoration: 'none',
              padding: '14px 32px',
              border: '1px solid rgba(0,229,255,0.15)',
              borderRadius: '8px',
              background: 'rgba(0,229,255,0.04)',
              minWidth: isMobile ? '240px' : '320px',
              transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,229,255,0.5)'
              ;(e.currentTarget as HTMLElement).style.background  = 'rgba(0,229,255,0.08)'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,229,255,0.15)'
              ;(e.currentTarget as HTMLElement).style.background  = 'rgba(0,229,255,0.04)'
            }}
          >
            <span style={{
              fontSize: '9px', color: 'rgba(255,255,255,0.85)', fontWeight: 500,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              fontFamily: 'var(--font-dm-sans)',
            }}>
              {label}
            </span>
            <span style={{
              fontSize: '13px', color: 'rgba(255,255,255,0.92)', fontWeight: 500,
              fontFamily: 'var(--font-dm-sans)',
            }}>
              {value}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}