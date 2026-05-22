'use client'

import { useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { ProjectData, ZONE_COLORS } from '../data/project'

const PROXIMITY = 6

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
    meshRef.current.rotation.y += 0.006
    meshRef.current.rotation.x += 0.003

    const nearness = Math.max(0, 1 - jellyfishPos.current.distanceTo(nodePos) / PROXIMITY)

    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.3 + nearness * 2.5, 0.06)

    if (lightRef.current) {
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, nearness * 6, 0.06)
    }

    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, nearness > 0.45 ? 1 : 0, 0.06)
    if (cardRef.current) {
      cardRef.current.style.opacity       = String(opacityRef.current)
      cardRef.current.style.pointerEvents = opacityRef.current > 0.5 ? 'auto' : 'none'
      cardRef.current.style.transform     = `translateY(${(1 - opacityRef.current) * 12}px)`
    }
  })

  const openModal = () => {
    window.dispatchEvent(new CustomEvent('open-project', { detail: data }))
  }

  const cardStyle: React.CSSProperties = {
    opacity: 0,
    background: 'rgba(2,8,24,0.9)',
    border: `1px solid ${color}44`,
    borderRadius: '10px',
    padding: '12px',
    color: 'white',
    fontFamily: 'system-ui, sans-serif',
    backdropFilter: 'blur(12px)',
    pointerEvents: 'none',
    width: '200px',
  }

  const btnStyle: React.CSSProperties = {
    display: 'block', width: '100%', marginTop: '10px',
    padding: '7px', textAlign: 'center', borderRadius: '7px',
    background: `${color}18`, border: `1px solid ${color}`,
    color, fontSize: '11px', cursor: 'pointer', pointerEvents: 'auto',
    fontFamily: 'system-ui, sans-serif',
  }

  return (
    <group position={data.position}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} roughness={0.2} metalness={0.8} />
      </mesh>

      <pointLight ref={lightRef} color={color} intensity={0} distance={10} decay={2} />

      <Html center position={[0, 2.2, 0]} style={{ pointerEvents: 'none' }}>
        <div ref={cardRef} style={cardStyle}>
          <img src={data.images[0]} alt={data.title} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px', display: 'block' }} />
          <div style={{ fontSize: '12px', fontWeight: 600, color, marginBottom: '4px' }}>{data.title}</div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.4, marginBottom: '8px' }}>{data.shortDesc}</div>
          <button onClick={openModal} style={btnStyle}>View Details →</button>
        </div>
      </Html>
    </group>
  )
}