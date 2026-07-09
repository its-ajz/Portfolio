'use client'

import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { ACESFilmicToneMapping } from 'three'
import { Environment } from '@react-three/drei'
import OceanParticles from '../components/OceanParticles'
import Jellyfish from '../components/Jellyfish'

const WIDTH = 1584
const HEIGHT = 396

// One-off LinkedIn banner capture — not linked from anywhere in the site,
// delete this route once the export is done. Freezes the animation a few
// seconds in (rather than staying live) so the screenshot isn't a timing
// gamble: bell mid-pulse, tentacles naturally spread instead of clustered.
export default function BannerExport() {
  const [frozen, setFrozen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setFrozen(true), 2600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#000',
    }}>
      <div style={{ width: `${WIDTH}px`, height: `${HEIGHT}px`, overflow: 'hidden', flexShrink: 0 }}>
        <Canvas
          style={{ width: `${WIDTH}px`, height: `${HEIGHT}px` }}
          camera={{ position: [0, 0.4, 9], fov: 32 }}
          dpr={[1, 2]}
          gl={{ antialias: true }}
          frameloop={frozen ? 'demand' : 'always'}
          onCreated={({ gl }) => {
            gl.toneMapping = ACESFilmicToneMapping
            gl.toneMappingExposure = 0.9
          }}
        >
          <color attach="background" args={['#020818']} />
          <fog attach="fog" args={['#020818', 20, 90]} />
          <ambientLight intensity={0.2} />
          <Environment preset="night" />

          <OceanParticles />

          <group position={[4.8, 0.6, 0]}>
            <Jellyfish />
          </group>

          <EffectComposer>
            <Bloom intensity={0.9} luminanceThreshold={0.35} luminanceSmoothing={0.85} mipmapBlur />
            <Vignette offset={0.3} darkness={0.6} blendFunction={BlendFunction.NORMAL} />
            <ChromaticAberration offset={[0.0006, 0.0006]} blendFunction={BlendFunction.NORMAL} />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  )
}
