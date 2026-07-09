'use client'

import { useEffect, useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

const SECTIONS = [
  { name: 'About',         pos: 0.09 },
  { name: 'XR',            pos: 0.22 },
  { name: 'Installations', pos: 0.42 },
  { name: 'UI / UX',       pos: 0.57 },
  { name: 'Art',           pos: 0.67 },
  { name: 'Contact',       pos: 0.92 },
]
const MOBILE_SECTIONS = [
  { name: 'About',   pos: 0.09 },
  { name: 'Work',    pos: 0.20 },
  { name: 'Art',     pos: 0.65 },
  { name: 'Contact', pos: 0.90 },
]

function jumpTo(pos: number) {
  const max = document.documentElement.scrollHeight - window.innerHeight
  window.scrollTo({ top: pos * max, behavior: 'smooth' })
}

export default function NavBar({ scrollT }: { scrollT: number }) {
  const isMobile  = useIsMobile()
  const [open, setOpen] = useState(false)
  const scrolled  = scrollT > 0.04

  const active = [...SECTIONS].reverse().find(s => scrollT >= s.pos - 0.02)?.name

  const navStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
    padding: isMobile ? '16px 20px' : '18px 40px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: scrolled ? 'rgba(2,8,24,0.75)' : 'transparent',
    backdropFilter: scrolled ? 'blur(16px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
    transition: 'background 0.5s ease, backdrop-filter 0.5s ease',
  }

  const logoStyle: React.CSSProperties = {
    background: 'none', border: 'none',
    color: 'white', fontSize: '13px',
    fontWeight: 500, letterSpacing: '0.14em',
    textTransform: 'uppercase', cursor: 'pointer',
    fontFamily: 'var(--font-dm-sans)',
  }

  return (
    <nav style={navStyle}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <button style={logoStyle} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Anjali Zalani
        </button>
        <span style={{
          fontSize: '10px', fontWeight: 300, color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.03em', fontFamily: 'var(--font-dm-sans)',
        }}>
          an-jelly(fish)
        </span>
      </div>

      {!isMobile && (
        <div style={{ display: 'flex', gap: '36px' }}>
          {SECTIONS.map(({ name, pos }) => (
            <button
              key={name}
              onClick={() => jumpTo(pos)}
              style={{
                background: 'none', border: 'none',
                fontSize: '11px', letterSpacing: '0.12em',
                textTransform: 'uppercase', cursor: 'pointer',
                fontFamily: 'var(--font-dm-sans)',
                color: active === name ? '#00E5FF' : 'rgba(255,255,255,0.45)',
                transition: 'color 0.2s',
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {isMobile && (
        <button
          onClick={() => setOpen(!open)}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '18px', cursor: 'pointer' }}
        >
          {open ? '✕' : '☰'}
        </button>
      )}

      {isMobile && open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(2,8,24,0.96)', backdropFilter: 'blur(16px)',
          padding: '20px 24px 28px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column', gap: '22px',
        }}>
          {SECTIONS.map(({ name, pos }) => (
            <button
              key={name}
              onClick={() => { jumpTo(pos); setOpen(false) }}
              style={{
                background: 'none', border: 'none',
                color: 'rgba(255,255,255,0.75)', fontSize: '15px',
                letterSpacing: '0.06em', cursor: 'pointer',
                textAlign: 'left', fontFamily: 'var(--font-dm-sans)',
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}