'use client'

import { useEffect, useState } from 'react'

export default function ScrollHint() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const hide = () => setVisible(false)
    const t = setTimeout(hide, 7000)
    window.addEventListener('scroll', hide, { once: true })
    return () => { clearTimeout(t); window.removeEventListener('scroll', hide) }
  }, [])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', bottom: '36px', left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 150, display: 'flex',
      flexDirection: 'column', alignItems: 'center', gap: '10px',
      animation: 'fadeInHint 1.5s ease 0.8s both',
      pointerEvents: 'none',
    }}>
      <span style={{
        fontSize: '10px', color: 'rgba(255,255,255,0.3)',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        fontFamily: 'var(--font-dm-sans)',
      }}>
        Scroll to explore
      </span>
      <div style={{
        width: '1px', height: '40px',
        background: 'linear-gradient(to bottom, rgba(0,229,255,0.6), transparent)',
        animation: 'scrollPulse 1.8s ease-in-out infinite',
      }} />
      <style>{`
        @keyframes fadeInHint { from { opacity: 0; transform: translateX(-50%) translateY(8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @keyframes scrollPulse { 0%,100% { opacity: 0.4; transform: scaleY(1); } 50% { opacity: 1; transform: scaleY(1.2); } }
      `}</style>
    </div>
  )
}