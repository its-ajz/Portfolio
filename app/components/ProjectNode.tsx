'use client'

import { useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { ProjectData, ZONE_COLORS } from '../data/project'
import { scrollState } from '../utils/ScrollState'

// When each category's cards are visible based on scroll position
const ZONE_RANGES: Record<string, [number, number]> = {
  xr:           [0.20, 0.42],
  installation: [0.38, 0.54],
  uiux:         [0.50, 0.64],
  art:          [0.62, 0.78],
  research:     [0.74, 0.92],
}

const PROXIMITY = 18

export default function ProjectNode({
  data,
  jellyfishPos,
}: {
  data: ProjectData
  jellyfishPos: MutableRefObject<THREE.Vector3>
}) {
  const meshRef    = useRef<THREE.Mesh>(null)
  const lightRef   = useRef<THREE.PointLight>(null)
  const cardRef    = useRef<HTMLDivElement>(null)
  const nodePos    = useRef(new THREE.Vector3(...data.position)).current
  const opacityRef = useRef(0)
  const color      = ZONE_COLORS[data.category]

  useFrame(() => {
    if (!meshRef.current) return

    // Crystal always rotates
    meshRef.current.rotation.y += 0.006
    meshRef.current.rotation.x += 0.003

    // Crystal glow: proximity-based
    const dist     = jellyfishPos.current.distanceTo(nodePos)
    const nearness = Math.max(0, 1 - dist / PROXIMITY)
    const mat      = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.3 + nearness * 2, 0.06)

    if (lightRef.current) {
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, nearness * 5, 0.06)
    }

    // Card visibility: scroll-zone-based
    const [zStart, zEnd] = ZONE_RANGES[data.category] || [0, 0]
    const t        = scrollState.t
    const inZone   = t >= zStart && t <= zEnd
    const fadeIn   = Math.min(1, (t - zStart) / 0.04)
    const fadeOut  = Math.min(1, (zEnd - t) / 0.04)
    const target   = inZone ? Math.min(fadeIn, fadeOut) : 0

    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, target, 0.05)

    if (cardRef.current) {
      cardRef.current.style.opacity       = String(opacityRef.current)
      cardRef.current.style.pointerEvents = opacityRef.current > 0.3 ? 'auto' : 'none'
      cardRef.current.style.transform     = `translateY(${(1 - opacityRef.current) * 12}px)`
    }
  })

  const openModal = () => {
    window.dispatchEvent(new CustomEvent('open-project', { detail: data }))
  }

  return (
    <group position={data.position}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial
          color={color} emissive={color}
          emissiveIntensity={0.3} roughness={0.2} metalness={0.8}
        />
      </mesh>

      <pointLight ref={lightRef} color={color} intensity={0} distance={12} decay={2} />

      <Html center position={[0, 2.2, 0]} style={{ width: '200px', pointerEvents: 'none' }}>
        <div
          ref={cardRef}
          style={{
            opacity: 0,
            background: 'rgba(2, 8, 24, 0.92)',
            border: `1px solid ${color}44`,
            borderRadius: '10px',
            padding: '12px',
            color: 'white',
            fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            backdropFilter: 'blur(16px)',
            pointerEvents: 'none',
          }}
        >
          <img
            src={data.images[0]} alt={data.title}
            style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px', display: 'block' }}
          />
          <div style={{ fontSize: '12px', fontWeight: 500, color, marginBottom: '4px' }}>
            {data.title}
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.4, marginBottom: '8px' }}>
            {data.shortDesc}
          </div>
          <button
            onClick={openModal}
            style={{
              display: 'block', width: '100%', padding: '7px',
              textAlign: 'center', borderRadius: '7px',
              background: `${color}18`, border: `1px solid ${color}`,
              color, fontSize: '11px', cursor: 'pointer',
              pointerEvents: 'auto',
              fontFamily: 'var(--font-dm-sans), system-ui, sans-serif',
            }}
          >
            View Details →
          </button>
        </div>
      </Html>
    </group>
  )
}