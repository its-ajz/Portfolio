'use client'

import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { ACESFilmicToneMapping } from 'three'
import * as THREE from 'three'
import { useIsMobile } from '../hooks/useIsMobile'
import OceanParticles from './OceanParticles'
import ScrollManager from './ScrollManager'
import ProjectNodes from './ProjectNodes'
import { Environment } from '@react-three/drei'

export default function Scene() {
  const jellyfishPos = useRef(new THREE.Vector3(0, 0, 0))
  const isMobile     = useIsMobile()

  return (
    <Canvas
      style={{ width: '100vw', height: '100vh' }}
      camera={{ position: [0, 3, 14], fov: 60 }}
      dpr={isMobile ? 0.8 : [1, 2]}
      gl={{ antialias: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping
        gl.toneMappingExposure = 0.9
      }}
    >
      <color attach="background" args={['#020818']} />
      <fog attach="fog" args={['#020818', 20, 90]} />
      <ambientLight intensity={0.2} />
      <Environment preset="dawn" />

      <OceanParticles />

      <ScrollManager jellyfishPos={jellyfishPos} />
      <ProjectNodes jellyfishPos={jellyfishPos} />

      {!isMobile && (
        <EffectComposer>
          <Bloom intensity={1.8} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
          <Vignette offset={0.3} darkness={0.6} blendFunction={BlendFunction.NORMAL} />
          <ChromaticAberration offset={[0.0006, 0.0006]} blendFunction={BlendFunction.NORMAL} />
        </EffectComposer>
      )}
    </Canvas>
  )
}