'use client'

import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import OceanParticles from './OceanParticles'
import Constellations from './Constellations'
import JellyfishNavigator from './JellyfishNavigator'
import ProjectNodes from './ProjectNodes'
import FloatingTitle from './FloatingTitle'
import ZoneLabels from './ZoneLabels'
import { ACESFilmicToneMapping } from 'three'

export default function Scene() {
  const jellyfishPos = useRef(new THREE.Vector3(0, 0, 0))

  return (
    <Canvas
      style={{ width: '100vw', height: '100vh' }}
      camera={{ position: [0, 3, 10], fov: 60 }}
      dpr={1}
      gl={{ antialias: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping
        gl.toneMappingExposure = 0.9
      }}
    >
      <color attach="background" args={['#020818']} />
      <fog attach="fog" args={['#020818', 15, 80]} />
      <ambientLight intensity={0.2} />

      <OceanParticles />
      <Constellations />
      <FloatingTitle />
      <ZoneLabels />
      <JellyfishNavigator jellyfishPos={jellyfishPos} />
      <ProjectNodes jellyfishPos={jellyfishPos} />
      <ZoneLabels />
      <EffectComposer>
        <Bloom intensity={2} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette offset={0.3} darkness={0.7} blendFunction={BlendFunction.NORMAL} />
        <ChromaticAberration offset={[0.0008, 0.0008]} blendFunction={BlendFunction.NORMAL} />
      </EffectComposer>
      

      
    </Canvas>
  )
}