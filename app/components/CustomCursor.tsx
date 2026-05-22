'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  let mouseX = 0, mouseY = 0
  let ringX  = 0, ringY  = 0

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dotRef.current) {
        dotRef.current.style.left = mouseX + 'px'
        dotRef.current.style.top  = mouseY + 'px'
      }
    }

    let raf: number
    const animate = () => {
      ringX += (mouseX - ringX) * 0.1
      ringY += (mouseY - ringY) * 0.1
      if (ringRef.current) {
        ringRef.current.style.left = ringX + 'px'
        ringRef.current.style.top  = ringY + 'px'
      }
      raf = requestAnimationFrame(animate)
    }

    const onIn  = () => ringRef.current?.classList.add('big')
    const onOut = () => ringRef.current?.classList.remove('big')

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', (e) => {
      if ((e.target as HTMLElement).closest('a')) onIn()
      else onOut()
    })

    raf = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', pointerEvents: 'none', zIndex: 9999,
        width: '5px', height: '5px', borderRadius: '50%',
        background: '#00E5FF', boxShadow: '0 0 8px #00E5FF',
        transform: 'translate(-50%, -50%)',
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', pointerEvents: 'none', zIndex: 9998,
        width: '22px', height: '22px', borderRadius: '50%',
        border: '1px solid rgba(0,229,255,0.4)',
        transform: 'translate(-50%, -50%)',
        transition: 'width 0.25s, height 0.25s, border-color 0.25s',
      }} />
      <style>{`
        .big { width: 44px !important; height: 44px !important; border-color: rgba(0,229,255,0.8) !important; }
      `}</style>
    </>
  )
}