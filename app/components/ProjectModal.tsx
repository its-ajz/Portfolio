'use client'

import { useEffect, useState } from 'react'
import { ProjectData, ZONE_COLORS } from '../data/project'

// fullDesc uses **word** for emphasis (written like markdown) but nothing
// upstream ever parsed it, so paragraphs rendered the literal asterisks.
// Splits on the marker pairs and renders the captured text as <strong>.
function renderInlineBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

function getEmbedUrl(link?: string): string | null {
  if (!link) return null
  const drive = link.match(/drive\.google\.com\/file\/d\/([^/?]+)/)
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview`
  return null
}

export default function ProjectModal({
  project,
  onClose,
}: {
  project: ProjectData
  onClose: () => void
}) {
  const color = ZONE_COLORS[project.category]
  const embedUrl = getEmbedUrl(project.videoLink || project.link)
  const [imgIndex, setImgIndex] = useState(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Body-scroll-lock while open. Without this, scroll input landing on the
  // backdrop (not just inside the panel's own scroll region) still moved
  // window.scrollY, silently advancing chapter navigation behind the
  // modal — a real bug on its own, separate from the panel's own
  // overscroll-chaining fixed via overscrollBehavior below.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [])

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 500,
    background: 'rgba(2,8,24,0.85)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  }

  const panelStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '760px',
    maxHeight: '90vh',
    background: 'rgba(5,15,35,0.95)',
    border: `1px solid ${color}33`,
    borderRadius: '16px',
    overflow: 'hidden auto',
    overscrollBehavior: 'contain',
    position: 'relative',
  }

    const closeBtnStyle: React.CSSProperties = {
    position: 'absolute',
    top: '12px',
    left: '12px',   // ← was right: '16px'
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: 'white',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '14px',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const viewLinkStyle: React.CSSProperties = {
    display: 'inline-block',
    marginTop: '8px',
    padding: '10px 22px',
    borderRadius: '8px',
    background: `${color}18`,
    border: `1px solid ${color}`,
    color: color,
    fontSize: '12px',
    letterSpacing: '0.05em',
    textDecoration: 'none',
    fontFamily: 'system-ui, sans-serif',
  }

  return (
    <div onClick={onClose} style={overlayStyle}>
      <div onClick={(e) => e.stopPropagation()} style={panelStyle}>

        <button onClick={onClose} style={closeBtnStyle}>×</button>

        {embedUrl ? (
          <iframe
            src={embedUrl}
            style={{ width: '100%', height: '380px', border: 'none', display: 'block' }}
            allow="autoplay"
          />
        ) : (
          <div style={{ position: 'relative' }}>
            <img
              src={project.images[imgIndex]}
              alt={project.title}
              style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }}
            />
            {project.images.length > 1 && (
              <div style={{
                position: 'absolute', bottom: '12px', left: '50%',
                transform: 'translateX(-50%)', display: 'flex', gap: '6px',
              }}>
                {project.images.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setImgIndex(i)}
                    style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: i === imgIndex ? color : 'rgba(255,255,255,0.3)',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{ padding: '24px 28px 32px' }}>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
            {project.tags.map((tag) => (
              <span key={tag} style={{
                fontSize: '10px', padding: '3px 9px', borderRadius: '10px',
                background: `${color}18`, border: `1px solid ${color}44`, color: color,
              }}>
                {tag}
              </span>
            ))}
          </div>

          <h2 style={{
            fontSize: '22px', fontWeight: 400, color: 'white',
            marginBottom: '10px', fontFamily: 'system-ui, sans-serif',
            letterSpacing: '0.02em',
          }}>
            {project.title}
          </h2>

          <p style={{
            fontSize: '14px', color: 'rgba(255,255,255,0.6)',
            marginBottom: '24px', lineHeight: 1.6, fontFamily: 'system-ui, sans-serif',
          }}>
            {project.shortDesc}
          </p>

          <div style={{ height: '1px', background: `${color}22`, marginBottom: '24px' }} />

          {project.fullDesc.split('\n\n').map((para, i) => (
            <p key={i} style={{
              fontSize: '13px', color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.75, marginBottom: '16px',
              fontFamily: 'system-ui, sans-serif',
            }}>
              {renderInlineBold(para)}
            </p>
          ))}

          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" style={viewLinkStyle}>
              View Project →
            </a>
          )}

        </div>
      </div>
    </div>
  )
}