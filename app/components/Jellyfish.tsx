'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const TENTACLE_COUNT = 8

function Tentacle({ index }: { index: number }) {
  const segments = 12
  const meshRefs = useRef<(THREE.Mesh | null)[]>([])
  const angle = (index / TENTACLE_COUNT) * Math.PI * 2

  useFrame((state) => {
    const t = state.clock.elapsedTime
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const progress = i / segments
      const waveX = Math.sin(t * 2.5 + progress * 6 + index * 0.9) * progress * 0.6
      const waveZ = Math.cos(t * 2 + progress * 4 + index * 1.3) * progress * 0.4
      mesh.position.set(
        Math.cos(angle) * 0.8 + waveX,
        -progress * 3.5,
        Math.sin(angle) * 0.8 + waveZ
      )
    })
  })

  return (
    <>
      {Array.from({ length: segments }, (_, i) => {
        const progress = i / segments
        return (
          <mesh key={i} ref={el => { meshRefs.current[i] = el }}>
            <sphereGeometry args={[0.03 * (1 - progress * 0.7), 4, 4]} />
            <meshBasicMaterial
              color="#1BFFD3"
              transparent
              opacity={0.8 - progress * 0.5}
            />
          </mesh>
        )
      })}
    </>
  )
}

export default function Jellyfish() {
  const groupRef = useRef<THREE.Group>(null)
  const bellRef  = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!groupRef.current || !bellRef.current) return
    const t = state.clock.elapsedTime

    const pulse = Math.sin(t * 1.5) * 0.12
    bellRef.current.scale.y = 1 + pulse
    bellRef.current.scale.x = 1 - pulse * 0.4
    bellRef.current.scale.z = 1 - pulse * 0.4

    groupRef.current.position.y = Math.sin(t * 0.6) * 0.2
  })

  return (
    <group ref={groupRef}>
      <mesh ref={bellRef}>
        <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshPhysicalMaterial
          color="#00E5FF"
          emissive="#7B2FFF"
          emissiveIntensity={0.5}
          transparent
          opacity={0.25}
          roughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      <pointLight color="#00E5FF" intensity={4} distance={10} decay={2} />

      <mesh position={[0, -0.2, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color="#1BFFD3" transparent opacity={0.9} />
      </mesh>

      {Array.from({ length: TENTACLE_COUNT }, (_, i) => (
        <Tentacle key={i} index={i} />
      ))}
    </group>
  )
}