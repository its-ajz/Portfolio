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
import WorkSidebar from './components/WorkSidebar'
import ZoneIndicator from './components/ZoneIndicator'
import OnboardingHint from './components/OnboardingHint'
import SectionNav from './components/SectionNav'
import { ProjectData } from './data/project'
import { scrollState } from './utils/ScrollState'

export default function Home() {
  const [started,       setStarted]       = useState(false)
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null)
  const [scrollT,       setScrollT]       = useState(0)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const t   = max > 0 ? window.scrollY / max : 0
      scrollState.t = t
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

      {!started && (
        <IntroScreen onEnter={() => {
          setStarted(true)
          setShowOnboarding(true)
        }} />
      )}

      {started && (
        <>
          <NavBar scrollT={scrollT} />
          <ScrollHint />
          <SectionNav scrollT={scrollT} />
          <ZoneIndicator scrollT={scrollT} />
          <AboutSection scrollT={scrollT} />
          <WorkSidebar scrollT={scrollT} />
          <ContactSection scrollT={scrollT} />
        </>
      )}

      {showOnboarding && (
        <OnboardingHint onDismiss={() => setShowOnboarding(false)} />
      )}

      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </>
  )
}