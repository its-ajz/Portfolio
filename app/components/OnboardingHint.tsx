'use client'

import { useEffect, useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

export default function OnboardingHint({ onDismiss }: { onDismiss: () => void }) {
  const [opacity, setOpacity] = useState(0)
  const isMobile = useIsMobile()

  useEffect(() => {
    setTimeout(() => setOpacity(1), 200)

    const dismiss = () => {
      setOpacity(0)
      setTimeout(onDismiss, 500)
    }

    const t = setTimeout(dismiss, 4500)
    window.addEventListener('scroll', dismiss, { once: true })
    window.addEventListener('touchmove', dismiss, { once: true })

    return () => {
      clearTimeout(t)
      window.removeEventListener('scroll', dismiss)
      window.removeEventListener('touchmove', dismiss)
    }
  }, [onDismiss])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity, transition: 'opacity 0.5s ease',
      pointerEvents: 'none',
    }}>
      <p style={{
        fontSize: isMobile ? '14px' : '16px',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-dm-sans)',
        marginBottom: '28px',
        textAlign: 'center',
        padding: '0 24px',
      }}>
        {isMobile ? 'Swipe up to follow the jellyfish' : 'Scroll down to follow the jellyfish'}
      </p>

      {/* Mouse scroll icon */}
      <div style={{
        width: '26px', height: '42px',
        border: '2px solid rgba(0,229,255,0.6)',
        borderRadius: '13px',
        position: 'relative',
        marginBottom: '16px',
      }}>
        <div style={{
          width: '4px', height: '8px',
          borderRadius: '2px',
          background: '#00E5FF',
          position: 'absolute',
          left: '50%', top: '5px',
          transform: 'translateX(-50%)',
          animation: 'wheelScroll 1.3s ease-in-out infinite',
          boxShadow: '0 0 6px #00E5FF',
        }} />
      </div>

      <p style={{
        fontSize: '10px',
        color: 'rgba(255,255,255,0.25)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-dm-sans)',
        animation: 'fadeHint 3s ease-in-out infinite',
      }}>
        Click anywhere to skip
      </p>

      <style>{`
        @keyframes wheelScroll {
          0%   { transform: translateX(-50%) translateY(0);    opacity: 1; }
          80%  { transform: translateX(-50%) translateY(14px); opacity: 0; }
          100% { transform: translateX(-50%) translateY(0);    opacity: 0; }
        }
        @keyframes fadeHint {
          0%,100% { opacity: 0.2; }
          50%      { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}