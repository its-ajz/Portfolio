'use client'

import { useState, useEffect } from 'react'
import Scene from './components/Scene'
import ControlsHint from './components/ControlsHint'
import IntroScreen from './components/IntroScreen'
import ProjectModal from './components/ProjectModal'
import CustomCursor from './components/CustomCursor'
import { ProjectData } from './data/project'

export default function Home() {
  const [started, setStarted]           = useState(false)
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      setActiveProject((e as CustomEvent<ProjectData>).detail)
    }
    window.addEventListener('open-project', handler)
    return () => window.removeEventListener('open-project', handler)
  }, [])

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <CustomCursor />
      <Scene />
      {!started && <IntroScreen onEnter={() => setStarted(true)} />}
      {started && !activeProject && <ControlsHint />}
      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </main>
  )
}