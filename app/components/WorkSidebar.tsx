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

  const zone = ZONES.find(z => scrollT >= z.start && scrollT <= z.end)
  if (!zone) return null

  const projects = ALL_PROJECTS.filter(p => p.category === zone.category)
  const color = ZONE_COLORS[zone.category as keyof typeof ZONE_COLORS]
  const opacity  = Math.min(
    Math.min(1, (scrollT - zone.start) / 0.03),
    Math.min(1, (zone.end - scrollT)   / 0.03)
  )

  if (opacity <= 0.01) return null

  const open = (project: ProjectData) => {
    window.dispatchEvent(new CustomEvent('open-project', { detail: project }))
  }

  return (
    <div style={{
      position: 'fixed',
      right: isMobile ? '12px' : '32px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 150,
      opacity,
      width: isMobile ? 'calc(100vw - 24px)' : '280px',
      maxHeight: '80vh',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      <p style={{
        fontSize: '10px', color,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        fontFamily: 'var(--font-dm-sans)', marginBottom: '4px',
      }}>
        {zone.label}
      </p>

      {projects.map(project => (
        <div
          key={project.id}
          onClick={() => open(project)}
          style={{
            display: 'flex', gap: '10px', alignItems: 'flex-start',
            background: 'rgba(2,8,24,0.88)',
            border: `1px solid ${ZONE_COLORS[project.category as keyof typeof ZONE_COLORS]}33`,
            borderRadius: '10px', padding: '10px',
            cursor: 'pointer', backdropFilter: 'blur(16px)',
            transition: 'border-color 0.2s, transform 0.15s',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLElement).style.borderColor = `${color}77`
            ;(e.currentTarget as HTMLElement).style.transform   = 'translateX(-3px)'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLElement).style.borderColor = `${ZONE_COLORS[project.category]}33`
            ;(e.currentTarget as HTMLElement).style.transform   = 'translateX(0)'
          }}
        >
          <img
            src={project.images[0]} alt={project.title}
            style={{ width: '56px', height: '44px', objectFit: 'cover', borderRadius: '5px', flexShrink: 0 }}
          />
          <div>
            <div style={{ fontSize: '12px', fontWeight: 500, color, marginBottom: '3px', fontFamily: 'var(--font-dm-sans)' }}>
              {project.title}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.4, fontFamily: 'var(--font-dm-sans)' }}>
              {project.shortDesc}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}