'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

type StarDef = {
  pos: [number, number, number]
  bright?: boolean
}

type ConstellationDef = {
  name: string
  stars: StarDef[]
  connections: [number, number][]
  worldPos: [number, number, number]
  driftSpeed: number
  driftAmplitude: number
  driftOffset: number
}

const CONSTELLATIONS: ConstellationDef[] = [
  {
    name: 'Scorpius',
    worldPos: [-20, 6, -22],
    driftSpeed: 0.35, driftAmplitude: 1.8, driftOffset: 0,
    stars: [
      { pos: [0, 2.5, 0], bright: true },
      { pos: [0.6, 1.6, 0] },
      { pos: [-0.2, 0.8, 0] },
      { pos: [0.3, 0.1, 0] },
      { pos: [0.8, -0.7, 0] },
      { pos: [1.3, -1.5, 0] },
      { pos: [1.6, -2.4, 0] },
      { pos: [1.1, -3.1, 0] },
      { pos: [0.4, -3.6, 0], bright: true },
    ],
    connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8]],
  },
  {
    name: 'Orion',
    worldPos: [16, 5, -20],
    driftSpeed: 0.28, driftAmplitude: 2.2, driftOffset: 1.2,
    stars: [
      { pos: [-1, 2.5, 0], bright: true },
      { pos: [1, 2.5, 0], bright: true },
      { pos: [-0.5, 1.5, 0] },
      { pos: [0.5, 1.5, 0] },
      { pos: [-0.3, 0.5, 0] },
      { pos: [0, 0.5, 0] },
      { pos: [0.3, 0.5, 0] },
      { pos: [-0.8, -0.5, 0] },
      { pos: [0.8, -0.5, 0] },
      { pos: [-1, -2, 0], bright: true },
      { pos: [1, -2, 0] },
    ],
    connections: [[0,2],[1,3],[2,3],[2,4],[3,6],[4,5],[5,6],[4,7],[6,8],[7,9],[8,10]],
  },
  {
    name: 'Leo',
    worldPos: [6, 14, -25],
    driftSpeed: 0.42, driftAmplitude: 1.5, driftOffset: 2.1,
    stars: [
      { pos: [0, 0, 0], bright: true },
      { pos: [0.5, 0.9, 0] },
      { pos: [0.8, 1.8, 0] },
      { pos: [0.3, 2.4, 0] },
      { pos: [-0.5, 2.2, 0] },
      { pos: [-0.7, 1.4, 0] },
      { pos: [-1.8, 0.3, 0] },
      { pos: [-2.8, -0.3, 0], bright: true },
    ],
    connections: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[6,7]],
  },
  {
    name: 'Gemini',
    worldPos: [-10, -8, -18],
    driftSpeed: 0.31, driftAmplitude: 2.0, driftOffset: 0.8,
    stars: [
      { pos: [-1.2, 3, 0], bright: true },
      { pos: [1.2, 3, 0], bright: true },
      { pos: [-1.2, 2, 0] },
      { pos: [1.2, 2, 0] },
      { pos: [-1.4, 1, 0] },
      { pos: [1, 1, 0] },
      { pos: [-1.3, 0, 0] },
      { pos: [1.1, 0, 0] },
      { pos: [-1.4, -1, 0] },
      { pos: [1.2, -1, 0] },
    ],
    connections: [[0,2],[1,3],[2,4],[3,5],[4,6],[5,7],[6,8],[7,9],[2,3],[4,5],[6,7]],
  },
  {
    name: 'Cassiopeia',
    worldPos: [-4, -15, -20],
    driftSpeed: 0.38, driftAmplitude: 1.6, driftOffset: 3.0,
    stars: [
      { pos: [-3, -1, 0], bright: true },
      { pos: [-1.5, 0.5, 0] },
      { pos: [0, -0.5, 0] },
      { pos: [1.5, 0.5, 0] },
      { pos: [3, -0.5, 0], bright: true },
    ],
    connections: [[0,1],[1,2],[2,3],[3,4]],
  },
]

function ConstellationGroup({ data }: { data: ConstellationDef }) {
  const groupRef = useRef<THREE.Group>(null)
  const baseY = data.worldPos[1]

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.position.y =
      baseY + Math.sin(state.clock.elapsedTime * data.driftSpeed + data.driftOffset) * data.driftAmplitude
    groupRef.current.position.x =
      data.worldPos[0] + Math.cos(state.clock.elapsedTime * data.driftSpeed * 0.7 + data.driftOffset) * (data.driftAmplitude * 0.5)
  })

  return (
    <group ref={groupRef} position={[data.worldPos[0], baseY, data.worldPos[2]]} scale={0.5}>
      {data.connections.map(([a, b], i) => (
        <Line
          key={i}
          points={[data.stars[a].pos, data.stars[b].pos]}
          color="#FFFFFF"
          lineWidth={0.5}
          transparent
          opacity={0.4}
        />
      ))}
      {data.stars.map((star, i) => (
        <mesh key={i} position={star.pos}>
          <sphereGeometry args={[star.bright ? 0.1 : 0.055, 8, 8]} />
          <meshBasicMaterial color={star.bright ? '#FFFFFF' : '#AACCFF'}  />
        </mesh>
      ))}
    </group>
  )
}

export default function Constellations() {
  return (
    <>
      {CONSTELLATIONS.map((c) => (
        <ConstellationGroup key={c.name} data={c} />
      ))}
    </>
  )
}