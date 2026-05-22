'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function ParticleLayer({
  count,
  size,
  color,
  spread,
  speed,
}: {
  count: number
  size: number
  color: string
  spread: [number, number, number]
  speed: number
}) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * spread[0]
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread[1]
      arr[i * 3 + 2] = (Math.random() - 0.5) * spread[2]
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * speed * 0.05
    ref.current.rotation.x = state.clock.elapsedTime * speed * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  )
}
export default function OceanParticles() {
  return (
    <>
      <ParticleLayer
        count={1000}
        size={0.008}
        color="#E8F4FF"
        spread={[100, 100, 100]}
        speed={0.1}
      />
      <ParticleLayer
        count={800}
        size={0.025}
        color="#1BFFD3"
        spread={[30, 80, 30]}
        speed={0.3}
      />
      {/* Feature stars — large, bright, few */}
      <ParticleLayer
        count={20}
        size={0.08}
        color="#FFFFFF"
        spread={[80, 60, 80]}
        speed={0.05}
      />
    </>
  )
}