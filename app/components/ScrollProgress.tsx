'use client'

import { useIsMobile } from '../hooks/useIsMobile'

export default function ScrollProgress({ scrollT }: { scrollT: number }) {
  const isMobile = useIsMobile()
  if (scrollT <= 0.02) return null

  return (
    <div style={{
      position: 'fixed',
      right: isMobile ? '8px' : '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      height: '35vh',
      width: '2px',
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '2px',
      zIndex: 150,
      pointerEvents: 'none',
    }}>
      <div style={{
        width: '100%',
        height: `${Math.min(100, scrollT * 100)}%`,
        background: 'linear-gradient(to bottom, #00E5FF, #7B2FFF)',
        borderRadius: '2px',
      }} />
      <div style={{
        position: 'absolute',
        bottom: `${100 - Math.min(100, scrollT * 100)}%`,
        left: '50%',
        transform: 'translate(-50%, 50%)',
        width: '5px', height: '5px',
        borderRadius: '50%',
        background: '#00E5FF',
        boxShadow: '0 0 6px #00E5FF',
      }} />
    </div>
  )
}