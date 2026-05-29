'use client'

import { useIsMobile } from '../hooks/useIsMobile'

export default function AboutSection({ scrollT }: { scrollT: number }) {
  const isMobile = useIsMobile()
  const visible  = scrollT > 0.09 && scrollT < 0.22
  const opacity  = visible
    ? Math.min(1, (scrollT - 0.09) / 0.04)
    : Math.max(0, 1 - (scrollT - 0.18) / 0.04)

  if (opacity <= 0) return null

  return (
    <div style={{
      position: 'fixed',
      top: '50%', left: isMobile ? '20px' : '60px',
      transform: 'translateY(-50%)',
      zIndex: 150,
      opacity,
      transition: 'opacity 0.3s ease',
      maxWidth: isMobile ? 'calc(100vw - 40px)' : '460px',
    }}>
      <p style={{
        fontSize: isMobile ? '10px' : '11px',
        color: '#00E5FF',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginBottom: '16px',
        fontFamily: 'var(--font-dm-sans)',
      }}>
        About
      </p>

      <h1 style={{
        fontSize: isMobile ? '28px' : '42px',
        fontWeight: 300,
        color: 'white',
        letterSpacing: '-0.01em',
        lineHeight: 1.15,
        marginBottom: '8px',
        fontFamily: 'var(--font-dm-sans)',
      }}>
        Anjali Zalani
      </h1>

      <p style={{
        fontSize: isMobile ? '12px' : '13px',
        color: '#00E5FF',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom: '24px',
        fontFamily: 'var(--font-dm-sans)',
      }}>
        Immersive Experience Designer
      </p>

      <div style={{
        height: '1px',
        background: 'rgba(0,229,255,0.2)',
        marginBottom: '24px',
        width: '48px',
      }} />

      <p style={{
        fontSize: isMobile ? '13px' : '14px',
        color: 'rgba(255,255,255,0.65)',
        lineHeight: 1.75,
        marginBottom: '16px',
        fontFamily: 'var(--font-dm-sans)',
      }}>
        I design experiences you can step inside. From Apple Vision Pro spatial systems to large-scale physical installations, I work at the intersection of digital and physical — building environments that respond, react, and stay with you.
      </p>

      <p style={{
        fontSize: isMobile ? '13px' : '14px',
        color: 'rgba(255,255,255,0.45)',
        lineHeight: 1.75,
        fontFamily: 'var(--font-dm-sans)',
      }}>
        Student at USC's Iovine and Young Academy. Currently exploring immersive VR worlds, spatial design, and interactive storytelling.
      </p>
    </div>
  )
}