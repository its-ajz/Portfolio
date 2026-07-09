'use client'

import { useEffect, useRef } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dotRef.current) return
      dotRef.current.style.left = e.clientX + 'px'
      dotRef.current.style.top  = e.clientY + 'px'
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  if (isMobile) return null

  return (
    <div
      ref={dotRef}
      style={{
        position: 'fixed',
        width: '8px', height: '8px',
        borderRadius: '50%',
        background: '#00E5FF',
        boxShadow: '0 0 8px #00E5FF',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        transition: 'transform 0.1s ease',
      }}
    />
  )
}