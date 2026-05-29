'use client'

import { useState, useEffect } from 'react'
import Scene from './components/Scene'
import NavBar from './components/NavBar'
import IntroScreen from './components/IntroScreen'
import ScrollHint from './components/ScrollHint'
import AboutSection from './components/AboutSection'
import ContactSection from './components/ContactSection'
import ProjectModal from './components/ProjectModal'
import CustomCursor from './components/CustomCursor'
import { ProjectData } from './data/project'
import { scrollState } from './utils/ScrollState'
import WorkSidebar from './components/WorkSidebar'
import ZoneIndicator from './components/ZoneIndicator'
import ScrollProgress from './components/ScrollProgress'




export default function Home() {
  const [started, setStarted] = useState(false)
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null)
  const [scrollT, setScrollT] = useState(0)

  useEffect(() => {
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])
  useEffect(() => {
    
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const t = max > 0 ? window.scrollY / max : 0
      scrollState.t = t   // ← add this line
      setScrollT(t)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      setActiveProject((e as CustomEvent<ProjectData>).detail)
    }
    window.addEventListener('open-project', handler)
    return () => window.removeEventListener('open-project', handler)
  }, [])

  return (
    <>
      {/* Scroll height — drives the 3D scene */}
      <div style={{ height: '900vh', pointerEvents: 'none' }} />

      {/* Fixed 3D canvas */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Scene />
      </div>

      <CustomCursor />

      {/* Intro — shown before started */}
      {!started && <IntroScreen onEnter={() => setStarted(true)} />}

      {/* Everything below only after entering */}
      {started && (
        <>
          <NavBar scrollT={scrollT} />
          <ScrollHint />
          <AboutSection scrollT={scrollT} />
          <WorkSidebar scrollT={scrollT} />
          <ContactSection scrollT={scrollT} />
          <ScrollProgress scrollT={scrollT} />

          <ZoneIndicator scrollT={scrollT} />
        </>
      )}

      {/* Project modal */}
      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </>
  )
}