'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useIsMobile } from '../hooks/useIsMobile'

function Tentacle({
  index, count, length = 7, color = '#1BFFD3', speed = 1, radius = 0.012,
}: {
  index: number; count: number; length?: number
  color?: string; speed?: number; radius?: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const angle   = (index / count) * Math.PI * 2
  const SEGS    = 16
  const points  = useMemo(
    () => Array.from({ length: SEGS + 1 }, () => new THREE.Vector3()), []
  )

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime * speed
    for (let i = 0; i <= SEGS; i++) {
      const p   = i / SEGS
      const amp = p * p * 2.0
      points[i].set(
        Math.cos(angle) * 0.9 + Math.sin(t * 1.8 + p * 10 + index * 1.4) * amp,
        -p * length,
        Math.sin(angle) * 0.9 + Math.cos(t * 2.1 + p * 8  + index * 1.1) * amp * 0.9
      )
    }
    const newGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), SEGS, radius, 4, false)
    if (meshRef.current.geometry) meshRef.current.geometry.dispose()
    meshRef.current.geometry = newGeo
  })

  return (
    <mesh ref={meshRef}>
      <meshStandardMaterial
        color={color} emissive={color} emissiveIntensity={0.4}
        transparent opacity={0.75}
      />
    </mesh>
  )
}

function OralArm({ index }: { index: number }) {
  const isMobile  = useIsMobile()
  const meshRef   = useRef<THREE.Mesh>(null)
  const geoRef    = useRef<THREE.BufferGeometry>(null)
  const angle     = (index / 4) * Math.PI * 2 + Math.PI / 4
  const SEGS      = 14
  const points    = useMemo(() => Array.from({ length: SEGS + 1 }, () => new THREE.Vector3()), [])
  const positions = useMemo(() => new Float32Array((SEGS + 1) * 3), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    for (let i = 0; i <= SEGS; i++) {
      const p = i / SEGS, amp = p * 1.5
      points[i].set(
        Math.cos(angle) * 0.3 + Math.sin(t * 0.9 + p * 5 + index * 2.1) * amp,
        -0.2 - p * 3.0,
        Math.sin(angle) * 0.3 + Math.cos(t * 1.2 + p * 4 + index * 1.6) * amp * 0.8
      )
    }

    if (isMobile) {
      if (!geoRef.current) return
      const arr = geoRef.current.attributes.position.array as Float32Array
      for (let i = 0; i <= SEGS; i++) {
        arr[i * 3] = points[i].x
        arr[i * 3 + 1] = points[i].y
        arr[i * 3 + 2] = points[i].z
      }
      geoRef.current.attributes.position.needsUpdate = true
    } else {
      if (!meshRef.current) return
      const newGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), SEGS, 0.035, 6, false)
      if (meshRef.current.geometry) meshRef.current.geometry.dispose()
      meshRef.current.geometry = newGeo
    }
  })

  if (isMobile) {
    return (
      <line>
        <bufferGeometry ref={geoRef}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#9B5FFF" transparent opacity={0.7} />
      </line>
    )
  }

  return (
    <mesh ref={meshRef}>
      <meshStandardMaterial
        color="#9B5FFF" emissive="#4400AA" emissiveIntensity={0.5}
        transparent opacity={0.65}
      />
    </mesh>
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
  if (!bellRef.current || !groupRef.current) return
  const t = state.clock.elapsedTime
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

      

      <pointLight color="#00E5FF" intensity={isMobile ? 10 : 8} distance={14} decay={2} />

      {/* 4 oral arms — thinner than before */}
      {Array.from({ length: 4 }, (_, i) => <OralArm key={i} index={i} />)}

      {/* 8 long tentacles only — remove the medium ones */}
      {!isMobile && Array.from({ length: 8 }, (_, i) => (
        <Tentacle key={i} index={i} count={8} length={8} color="#1BFFD3" speed={0.8} radius={0.01} />
      ))}

    </group>
  )
}