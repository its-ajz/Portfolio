'use client'

import { useEffect, useState } from 'react'

function Key({ label, wide = false }: { label: string; wide?: boolean }) {
  return (
    <div style={{
      minWidth: wide ? '56px' : '26px',
      height: '26px',
      padding: '0 6px',
      border: '1px solid rgba(0,229,255,0.25)',
      borderBottom: '3px solid rgba(0,229,255,0.25)',
      borderRadius: '5px',
      background: 'rgba(0,229,255,0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: label.length > 1 ? '8px' : '11px',
      fontWeight: 500,
      color: '#00E5FF',
      fontFamily: 'monospace',
      letterSpacing: '0.5px',
    }}>
      {label.toUpperCase()}
    </div>
  )
}

function MouseIcon() {
  return (
    <svg width="26" height="34" viewBox="0 0 26 34" fill="none">
      <rect x="0.75" y="0.75" width="24.5" height="32.5" rx="12.25" stroke="rgba(0,229,255,0.25)" strokeWidth="1.5"/>
      <path d="M13 0.75 C13 0.75 25.25 0.75 25.25 13 L13 13 Z" fill="rgba(0,229,255,0.12)" />
      <line x1="13" y1="1" x2="13" y2="18" stroke="rgba(0,229,255,0.2)" strokeWidth="1"/>
      <rect x="10" y="7" width="6" height="9" rx="3" fill="rgba(0,229,255,0.35)"/>
    </svg>
  )
}

function Divider() {
  return <div style={{ width: '1px', height: '48px', background: 'rgba(255,255,255,0.07)' }} />
}

function HintGroup({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      {children}
      <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  )
}

export default function ControlsHint() {
  const [opacity, setOpacity] = useState(0)
  const [gone, setGone]       = useState(false)

  useEffect(() => {
    // Fade in
    const fadeIn = setTimeout(() => setOpacity(1), 300)

    // Fade out on interaction or after 7s
    const hide = () => {
      setOpacity(0)
      setTimeout(() => setGone(true), 700)
    }

    const autoHide = setTimeout(hide, 7000)
    window.addEventListener('keydown', hide, { once: true })
    window.addEventListener('mousedown', hide, { once: true })

    return () => {
      clearTimeout(fadeIn)
      clearTimeout(autoHide)
      window.removeEventListener('keydown', hide)
      window.removeEventListener('mousedown', hide)
    }
  }, [])

  if (gone) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '36px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
      padding: '14px 24px',
      background: 'rgba(2, 8, 24, 0.75)',
      border: '1px solid rgba(0, 229, 255, 0.12)',
      borderRadius: '14px',
      backdropFilter: 'blur(16px)',
      opacity,
      transition: 'opacity 0.7s ease',
      pointerEvents: 'none',
      zIndex: 100,
    }}>

      <HintGroup label="move">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
          <Key label="W" />
          <div style={{ display: 'flex', gap: '3px' }}>
            <Key label="A" />
            <Key label="S" />
            <Key label="D" />
          </div>
        </div>
      </HintGroup>

      <Divider />

      <HintGroup label="up / down">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <Key label="space" wide />
          <Key label="shift" wide />
        </div>
      </HintGroup>

      <Divider />

      <HintGroup label="look around">
        <MouseIcon />
      </HintGroup>

    </div>
  )
}