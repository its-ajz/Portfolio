'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useIsMobile } from '../hooks/useIsMobile'

function Tentacle({
  index, count, length = 7, opacity = 0.5, color = '#1BFFD3', speed = 1,
}: {
  index: number; count: number; length?: number
  opacity?: number; color?: string; speed?: number
}) {
  const geoRef    = useRef<THREE.BufferGeometry>(null)
  const SEGMENTS  = 40
  const angle     = (index / count) * Math.PI * 2
  const positions = useMemo(() => new Float32Array((SEGMENTS + 1) * 3), [])

  useFrame((state) => {
    if (!geoRef.current) return
    const t   = state.clock.elapsedTime * speed
    const arr = geoRef.current.attributes.position.array as Float32Array
    for (let i = 0; i <= SEGMENTS; i++) {
      const p   = i / SEGMENTS
      const amp = p * p * 2.2
      arr[i * 3]     = Math.cos(angle) * 0.9 + Math.sin(t * 1.8 + p * 10 + index * 1.4) * amp
      arr[i * 3 + 1] = -p * length
      arr[i * 3 + 2] = Math.sin(angle) * 0.9 + Math.cos(t * 2.1 + p * 8  + index * 1.1) * amp * 0.9
    }
    geoRef.current.attributes.position.needsUpdate = true
  })

  return (
    <line>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </line>
  )
}

function OralArm({ index }: { index: number }) {
  const geoRef    = useRef<THREE.BufferGeometry>(null)
  const SEGMENTS  = 30
  const angle     = (index / 4) * Math.PI * 2 + Math.PI / 4
  const positions = useMemo(() => new Float32Array((SEGMENTS + 1) * 3), [])

  useFrame((state) => {
    if (!geoRef.current) return
    const t   = state.clock.elapsedTime
    const arr = geoRef.current.attributes.position.array as Float32Array
    for (let i = 0; i <= SEGMENTS; i++) {
      const p   = i / SEGMENTS
      const amp = p * 1.4
      arr[i * 3]     = Math.cos(angle) * 0.3 + Math.sin(t * 1.0 + p * 5 + index * 2.1) * amp
      arr[i * 3 + 1] = -0.2 - p * 2.8
      arr[i * 3 + 2] = Math.sin(angle) * 0.3 + Math.cos(t * 1.3 + p * 4 + index * 1.6) * amp * 0.8
    }
    geoRef.current.attributes.position.needsUpdate = true
  })

  return (
    <line>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#7B2FFF" transparent opacity={0.6} />
    </line>
  )
}

function BellVeins() {
  const lineData = useMemo(() => {
    const result: Float32Array[] = []
    const R = 1.2, THETA = Math.PI * 0.55, SEGS = 16
    for (let i = 0; i < 8; i++) {
      const phi = (i / 8) * Math.PI * 2
      const arr = new Float32Array((SEGS + 1) * 3)
      for (let j = 0; j <= SEGS; j++) {
        const t = (j / SEGS) * THETA
        arr[j * 3]     = R * Math.sin(t) * Math.cos(phi)
        arr[j * 3 + 1] = R * Math.cos(t)
        arr[j * 3 + 2] = R * Math.sin(t) * Math.sin(phi)
      }
      result.push(arr)
    }
    return result
  }, [])

  return (
    <>
      {lineData.map((arr, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[arr, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#00E5FF" transparent opacity={0.1} />
        </line>
      ))}
    </>
  )
}

export default function Jellyfish() {
  const groupRef = useRef<THREE.Group>(null)
  const bellRef  = useRef<THREE.Mesh>(null)
  const isMobile = useIsMobile()

  useFrame((state) => {
    if (!groupRef.current || !bellRef.current) return
    const t     = state.clock.elapsedTime
    const pulse = Math.sin(t * 1.2) * 0.1
    bellRef.current.scale.y = 1 + pulse
    bellRef.current.scale.x = 1 - pulse * 0.5
    bellRef.current.scale.z = 1 - pulse * 0.5
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.2
  })

  return (
    <group ref={groupRef}>

      {/* Outer bell */}
      <mesh ref={bellRef}>
        <sphereGeometry args={[1.2, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
        {isMobile ? (
          <meshPhysicalMaterial
            color="#00CCDD" emissive="#00AACC" emissiveIntensity={0.8}
            transparent opacity={0.4} roughness={0} side={THREE.DoubleSide}
          />
        ) : (
          <MeshTransmissionMaterial
            backside samples={3} thickness={0.4}
            roughness={0.05} transmission={0.92} ior={1.4}
            chromaticAberration={0.04}
            color="#88EEFF" emissive="#006688" emissiveIntensity={0.5}
          />
        )}
      </mesh>

      {/* Inner bell — depth layer */}
      <mesh scale={[0.82, 0.78, 0.82]}>
        <sphereGeometry args={[1.2, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshPhysicalMaterial
          color="#00AADD" emissive="#002244" emissiveIntensity={0.8}
          transparent opacity={0.18} roughness={0} side={THREE.DoubleSide}
        />
      </mesh>

      {/* Velarium — the inward shelf at bell opening */}
      <mesh position={[0, -0.18, 0]} rotation={[Math.PI, 0, 0]}>
        <cylinderGeometry args={[0.65, 1.15, 0.18, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#00CCEE" emissive="#004466" emissiveIntensity={1.0}
          transparent opacity={0.3} roughness={0} side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rim ring */}
      <mesh position={[0, -0.2, 0]}>
        <torusGeometry args={[1.16, 0.03, 8, 80]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.7} />
      </mesh>

      {/* Radial veins */}
      <BellVeins />

      {/* Inner glow core */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshBasicMaterial color="#1BFFD3" transparent opacity={0.85} />
      </mesh>

      {/* Inner glow ring */}
      <mesh position={[0, -0.05, 0]}>
        <torusGeometry args={[0.55, 0.055, 8, 32]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.35} />
      </mesh>

      <pointLight color="#00E5FF" intensity={isMobile ? 10 : 8} distance={14} decay={2} />

      {Array.from({ length: 4 }, (_, i) => <OralArm key={i} index={i} />)}

      {Array.from({ length: 16 }, (_, i) => (
        <Tentacle key={i} index={i} count={16} length={7} opacity={0.5} speed={0.9} />
      ))}

      {Array.from({ length: 8 }, (_, i) => (
        <Tentacle key={`m${i}`} index={i} count={8} length={4} opacity={0.35} color="#7B2FFF" speed={1.1} />
      ))}

    </group>
  )
}