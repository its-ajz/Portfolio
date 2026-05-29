'use client'

import { useIsMobile } from '../hooks/useIsMobile'
import { ALL_PROJECTS, ZONE_COLORS, ProjectData } from '../data/project'

const ZONES = [
  { label: 'XR & Spatial',     category: 'xr',           start: 0.20, end: 0.40 },
  { label: 'Installations',    category: 'installation', start: 0.40, end: 0.55 },
  { label: 'UI / UX',          category: 'uiux',         start: 0.55, end: 0.65 },
  { label: 'Art',              category: 'art',          start: 0.65, end: 0.78 },
  { label: 'Research & Other', category: 'research',     start: 0.78, end: 0.90 },
]

export default function WorkSidebar({ scrollT }: { scrollT: number }) {
  const isMobile = useIsMobile()
  const zone     = ZONES.find(z => scrollT >= z.start && scrollT <= z.end)
  if (!zone) return null

  const projects = ALL_PROJECTS.filter(p => p.category === zone.category)
  const color    = ZONE_COLORS[zone.category as keyof typeof ZONE_COLORS]
  const opacity  = Math.min(
    Math.min(1, (scrollT - zone.start) / 0.03),
    Math.min(1, (zone.end - scrollT)   / 0.03)
  )
  if (opacity <= 0.01) return null

  const open = (project: ProjectData) => {
    window.dispatchEvent(new CustomEvent('open-project', { detail: project }))
  }

  if (isMobile) {
    return (
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: 150,
        opacity,
        background: 'rgba(2,8,24,0.93)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px 16px 0 0',
        maxHeight: '44vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Handle + label */}
        <div style={{ padding: '12px 20px 8px', flexShrink: 0 }}>
          <div style={{
            width: '32px', height: '3px', borderRadius: '2px',
            background: 'rgba(255,255,255,0.15)',
            margin: '0 auto 12px',
          }} />
          <p style={{
            fontSize: '10px', color,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            fontFamily: 'var(--font-dm-sans)',
          }}>
            {zone.label}
          </p>
        </div>

        {/* Horizontal scroll list */}
        <div style={{
          display: 'flex', gap: '10px',
          overflowX: 'auto', overflowY: 'hidden',
          padding: '4px 20px 24px',
          flexShrink: 0,
          scrollbarWidth: 'none',
        }}>
          {projects.map(project => {
            const pc = ZONE_COLORS[project.category as keyof typeof ZONE_COLORS]
            return (
              <div
                key={project.id}
                onClick={() => open(project)}
                style={{
                  flexShrink: 0,
                  width: '140px',
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${pc}33`,
                  borderRadius: '10px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={project.images[0]} alt={project.title}
                  style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ padding: '8px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 500, color: pc, marginBottom: '2px', fontFamily: 'var(--font-dm-sans)' }}>
                    {project.title}
                  </div>
                  <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-dm-sans)' }}>
                    Tap to view
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Desktop — unchanged
  return (
    <div style={{
      position: 'fixed',
      right: '32px', top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 150, opacity,
      width: '280px', maxHeight: '80vh',
      overflowY: 'auto',
      display: 'flex', flexDirection: 'column', gap: '10px',
    }}>
      <p style={{
        fontSize: '10px', color,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        fontFamily: 'var(--font-dm-sans)', marginBottom: '4px',
      }}>
        {zone.label}
      </p>
      {projects.map(project => {
        const pc = ZONE_COLORS[project.category as keyof typeof ZONE_COLORS]
        return (
          <div
            key={project.id}
            onClick={() => open(project)}
            style={{
              display: 'flex', gap: '10px', alignItems: 'flex-start',
              background: 'rgba(2,8,24,0.88)',
              border: `1px solid ${pc}33`,
              borderRadius: '10px', padding: '10px',
              cursor: 'pointer', backdropFilter: 'blur(16px)',
              transition: 'border-color 0.2s, transform 0.15s',
            }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.borderColor = `${pc}77`
              ;(e.currentTarget as HTMLElement).style.transform   = 'translateX(-3px)'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.borderColor = `${pc}33`
              ;(e.currentTarget as HTMLElement).style.transform   = 'translateX(0)'
            }}
          >
            <img src={project.images[0]} alt={project.title}
              style={{ width: '56px', height: '44px', objectFit: 'cover', borderRadius: '5px', flexShrink: 0 }}
            />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 500, color: pc, marginBottom: '3px', fontFamily: 'var(--font-dm-sans)' }}>
                {project.title}
              </div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.4, fontFamily: 'var(--font-dm-sans)' }}>
                {project.shortDesc}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}