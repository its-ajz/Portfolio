'use client'

import { useEffect, useState } from 'react'

export default function ScrollHint() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const hide = () => setVisible(false)
    const t = setTimeout(hide, 9000)
    window.addEventListener('scroll', hide, { once: true })
    return () => { clearTimeout(t); window.removeEventListener('scroll', hide) }
  }, [])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', bottom: '40px', left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 150, display: 'flex',
      flexDirection: 'column', alignItems: 'center', gap: '12px',
      animation: 'hintFade 1.5s ease 0.8s both',
      pointerEvents: 'none',
    }}>
      <span style={{
        fontSize: '11px', color: 'rgba(255,255,255,0.5)',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        fontFamily: 'var(--font-dm-sans)',
      }}>
        Scroll to explore
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <div style={{ width: '1px', height: '32px', background: 'linear-gradient(to bottom, transparent, rgba(0,229,255,0.8))', animation: 'lineDown 1.6s ease-in-out infinite' }} />
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00E5FF', animation: 'dotPulse 1.6s ease-in-out infinite' }} />
      </div>
      <style>{`
        @keyframes hintFade { from { opacity:0; transform:translateX(-50%) translateY(10px) } to { opacity:1; transform:translateX(-50%) translateY(0) } }
        @keyframes lineDown { 0%,100% { opacity:0.3; transform:scaleY(0.7) } 50% { opacity:1; transform:scaleY(1) } }
        @keyframes dotPulse { 0%,100% { opacity:0.3; transform:scale(0.8) } 50% { opacity:1; transform:scale(1.2) } }
      `}</style>
    </div>
  )
}