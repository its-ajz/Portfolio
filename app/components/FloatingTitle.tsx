'use client'

import { useRef } from 'react'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function FloatingTitle() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 0.4) * 0.08
  })

  return (
    <group ref={groupRef} position={[0, 1.5, 4]}>
      <Text
        fontSize={0.45}
        color="white"
        letterSpacing={0.15}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        ANJALI ZALANI
      </Text>
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.11}
        color="#00E5FF"
        letterSpacing={0.22}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        XR · INSTALLATION · INTERACTION DESIGN
      </Text>
    </group>
  )
}