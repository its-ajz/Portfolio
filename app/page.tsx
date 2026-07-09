'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import NavBar from './components/NavBar'
import IntroScreen from './components/IntroScreen'
import LoadingPulse from './components/LoadingPulse'
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

// Scene pulls in three.js + R3F + postprocessing — a large chunk that has
// no reason to block the intro screen's own paint. ssr:false because it's
// entirely canvas/WebGL, nothing to server-render. Mounted only once the
// user has clicked (see `clicked` below), not eagerly on page load.
const Scene = dynamic(() => import('./components/Scene'), { ssr: false })

export default function Home() {
  const [clicked,       setClicked]       = useState(false)
  const [started,       setStarted]       = useState(false)
  const [sceneReady,    setSceneReady]    = useState(false)
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

      {/* Fixed 3D canvas — deferred until click so it isn't competing with
          the intro's own fade-in for main-thread time on first paint. */}
      {clicked && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
          <Scene onReady={() => setSceneReady(true)} />
        </div>
      )}

      <CustomCursor />

      {!started && (
        <IntroScreen
          onClickStart={() => setClicked(true)}
          onEnter={() => {
            setStarted(true)
            setShowOnboarding(true)
          }}
        />
      )}

      {started && <LoadingPulse ready={sceneReady} />}

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