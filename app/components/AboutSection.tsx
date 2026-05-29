'use client'

import { useIsMobile } from '../hooks/useIsMobile'

export default function AboutSection({ scrollT }: { scrollT: number }) {
  const isMobile = useIsMobile()
  const visible  = scrollT > 0.09 && scrollT < 0.22
  const opacity  = visible
    ? Math.min(1, (scrollT - 0.09) / 0.04)
    : Math.max(0, 1 - (scrollT - 0.18) / 0.04)

  if (opacity <= 0) return null

if (isMobile) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      zIndex: 150, opacity,
      background: 'rgba(2,8,24,0.92)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(0,229,255,0.08)',
      borderRadius: '16px 16px 0 0',
      padding: '14px 20px 32px',
    }}>
      <div style={{
        width: '32px', height: '3px', borderRadius: '2px',
        background: 'rgba(255,255,255,0.15)',
        margin: '0 auto 16px',
      }} />
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
        <img
          src="https://i.imgur.com/UbSen9R.jpeg"
          alt="Anjali Zalani"
          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid rgba(0,229,255,0.3)', flexShrink: 0 }}
        />
        <div>
          <div style={{ fontSize: '18px', fontWeight: 300, color: 'white', fontFamily: 'var(--font-dm-sans)' }}>
            Anjali Zalani
          </div>
          <div style={{ fontSize: '10px', color: '#00E5FF', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-dm-sans)' }}>
            Immersive Experience Designer
          </div>
        </div>
      </div>
      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, fontFamily: 'var(--font-dm-sans)' }}>
        I design experiences you can step inside — from Apple Vision Pro spatial systems to large-scale physical installations.
      </p>
    </div>
  )
}

  return (
    <div style={{
        position: 'fixed',
        top: '50%', left: isMobile ? '20px' : '60px',
        transform: 'translateY(-50%)',
        zIndex: 150,
        opacity,
        transition: 'opacity 0.3s ease',
        maxWidth: isMobile ? 'calc(100vw - 40px)' : '460px',
        background: 'rgba(2, 8, 24, 0.45)',   // ← add this
        backdropFilter: 'blur(12px)',           // ← add this
        padding: isMobile ? '24px' : '32px',   // ← add this
        borderRadius: '16px',                  // ← add this
        border: '1px solid rgba(255,255,255,0.05)',  // ← add this
    }}>
        <div style={{
        width: isMobile ? '72px' : '88px',
        height: isMobile ? '72px' : '88px',
        borderRadius: '50%',
        overflow: 'hidden',
        marginBottom: '20px',
        border: '2px solid rgba(0,229,255,0.3)',
      }}>
        <img
          src="https://i.imgur.com/UbSen9R.jpeg"
          alt="Anjali Zalani"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

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