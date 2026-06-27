'use client'

import { useEffect, useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

export default function IntroScreen({ onEnter }: { onEnter: () => void }) {
  const [phase, setPhase] = useState<'hidden' | 'visible' | 'leaving'>('hidden')
  const isMobile = useIsMobile()

  useEffect(() => {
    const t = setTimeout(() => setPhase('visible'), 400)
    return () => clearTimeout(t)
  }, [])

  const enter = () => {
    if (phase !== 'visible') return
    setPhase('leaving')
    setTimeout(onEnter, 1200)
  }

  return (
    <div
      onClick={enter}
      style={{
        position: 'fixed', inset: 0,
        background: '#020818',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 1000,
        cursor: phase === 'visible' ? 'pointer' : 'default',
        opacity: phase === 'leaving' ? 0 : 1,
        transition: 'opacity 1.2s ease',
        userSelect: 'none',
        padding: '24px',
      }}
    >
      <div style={{
        width: '40px', height: '1px',
        background: 'rgba(0,229,255,0.4)',
        marginBottom: '32px',
        opacity: phase === 'visible' ? 1 : 0,
        transition: 'opacity 1s ease',
      }} />

      <div style={{
        fontSize: 'clamp(28px, 5.5vw, 68px)',
        fontWeight: 300, color: 'white',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        fontFamily: 'var(--font-dm-sans)',
        textAlign: 'center',
        opacity: phase === 'visible' ? 1 : 0,
        transform: phase === 'visible' ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 1s ease 0.1s, transform 1s ease 0.1s',
      }}>
        Anjali Zalani
      </div>

      <div style={{
        width: '40px', height: '1px',
        background: 'rgba(0,229,255,0.4)',
        margin: '24px 0',
        opacity: phase === 'visible' ? 1 : 0,
        transition: 'opacity 1s ease 0.3s',
      }} />

      <div style={{
        fontSize: 'clamp(10px, 1.2vw, 13px)',
        color: '#00E5FF',
        letterSpacing: '0.35em', textTransform: 'uppercase',
        fontFamily: 'var(--font-dm-sans)',
        textAlign: 'center',
        opacity: phase === 'visible' ? 0.7 : 0,
        transition: 'opacity 1.2s ease 0.4s',
      }}>
        XR · Installation · Interaction Design
      </div>

      <div style={{
        position: 'absolute', bottom: '44px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '10px',
        opacity: phase === 'visible' ? 1 : 0,
        transition: 'opacity 1.5s ease 0.8s',
      }}>
        <p style={{
          fontSize: isMobile ? '13px' : '15px',
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.15em', textTransform: 'uppercase',
          fontFamily: 'var(--font-dm-sans)',
          textAlign: 'center',
        }}>
          {isMobile ? 'Click to enter' : 'Click to enter'}
        </p>
      </div>

      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.2; }
          50%       { opacity: 0.55; }
        }
      `}</style>
    </div>
  )
}