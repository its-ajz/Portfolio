'use client'

import { useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ProjectData, ZONE_COLORS } from '../data/project'

const PROXIMITY = 18

export default function ProjectNode({
  data,
  jellyfishPos,
}: {
  data: ProjectData
  jellyfishPos: MutableRefObject<THREE.Vector3>
}) {
  const meshRef  = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  const nodePos  = useRef(new THREE.Vector3(...data.position)).current
  const color    = ZONE_COLORS[data.category]

  useFrame(() => {
    if (!meshRef.current) return
    meshRef.current.rotation.y += 0.006
    meshRef.current.rotation.x += 0.003

    const nearness = Math.max(0, 1 - jellyfishPos.current.distanceTo(nodePos) / PROXIMITY)
    const mat      = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, 0.3 + nearness * 2.5, 0.06)

    if (lightRef.current) {
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, nearness * 5, 0.06)
    }
  })

  return (
    <group position={data.position}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} roughness={0.2} metalness={0.8} />
      </mesh>
      <pointLight ref={lightRef} color={color} intensity={0} distance={12} decay={2} />
    </group>
  )
}