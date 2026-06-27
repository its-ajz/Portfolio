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
        color={color} emissive={color} emissiveIntensity={0.6}
        transparent opacity={0.8}
        emissiveMap={null}
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
        color="#BB77FF" emissive="#BB77FF" emissiveIntensity={0.5}
        transparent opacity={0.75}
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
          <lineBasicMaterial color="#00FFDD" transparent opacity={0.15} linewidth={1} />
        </line>
      ))}
    </>
  )
}

function AnimatedGlowRing() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    // Subtle rotation + pulsing glow
    meshRef.current.rotation.z = t * 0.3
    const glowPulse = 0.5 + Math.sin(t * 2) * 0.5
    if (meshRef.current.material instanceof THREE.Material) {
      meshRef.current.material.opacity = 0.4 + glowPulse * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={[0, -0.2, 0]}>
      <torusGeometry args={[1.18, 0.04, 16, 100]} />
      <meshBasicMaterial color="#00E5FF" transparent />
    </mesh>
  )
}

function InnerGlowParticles() {
  const groupRef = useRef<THREE.Group>(null)
  const particles = useMemo(() => {
    const positions = new Float32Array(30 * 3) // 30 particles
    for (let i = 0; i < 30; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.6
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.6 + 0.2
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.6
    }
    return positions
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.x += 0.0008
    groupRef.current.rotation.y += 0.001
  })

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#1BFFD3"
          size={0.04}
          sizeAttenuation={true}
          transparent
          opacity={0.7}
        />
      </points>
    </group>
  )
}

function LuminousEdge() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    // Subtle breathing effect
    const scale = 1 + Math.sin(t * 1.5) * 0.08
    meshRef.current.scale.set(scale, scale, scale)
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.3, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
      <meshBasicMaterial
        color="#00FFDD"
        transparent
        opacity={0.08}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

export default function Jellyfish() {
  const groupRef = useRef<THREE.Group>(null)
  const bellRef  = useRef<THREE.Mesh>(null)
  const isMobile = useIsMobile()

  useFrame((state) => {
    if (!bellRef.current || !groupRef.current) return
    const t = state.clock.elapsedTime
    
    // More dramatic pulse — draws attention
    const pulse = Math.sin(t * 1.2) * 0.15
    bellRef.current.scale.y = 1 + pulse
    bellRef.current.scale.x = 1 - pulse * 0.4
    bellRef.current.scale.z = 1 - pulse * 0.4
    
    // Floating motion
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.3 + Math.sin(t * 0.3) * 0.1
  })

  return (
    <group ref={groupRef}>
      {/* Luminous outer aura */}
      <LuminousEdge />

      {/* Outer bell — main visual */}
      <mesh ref={bellRef}>
        <sphereGeometry args={[1.2, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
        {isMobile ? (
          <meshPhysicalMaterial
            color="#00DDFF" 
            emissive="#0099CC" 
            emissiveIntensity={1.0}
            transparent 
            opacity={0.5} 
            roughness={0.1} 
            side={THREE.DoubleSide}
          />
        ) : (
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={0.5}
            roughness={0.08}
            transmission={0.95}
            ior={1.45}
            chromaticAberration={0.08}
            color="#00FFEE"
            emissive="#00DDFF"
            emissiveIntensity={0.7}
          />
        )}
      </mesh>

      {/* Inner bell — depth layer with stronger glow */}
      <mesh scale={[0.82, 0.78, 0.82]}>
        <sphereGeometry args={[1.2, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshPhysicalMaterial
          color="#0099DD"
          emissive="#0088BB"
          emissiveIntensity={1.0}
          transparent
          opacity={0.25}
          roughness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Velarium — the inward shelf at bell opening */}
      <mesh position={[0, -0.18, 0]} rotation={[Math.PI, 0, 0]}>
        <cylinderGeometry args={[0.65, 1.15, 0.18, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#00EEFF"
          emissive="#0099DD"
          emissiveIntensity={1.2}
          transparent
          opacity={0.4}
          roughness={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Animated rim ring */}
      <AnimatedGlowRing />

      {/* Radial veins */}
      <BellVeins />

      {/* Inner glow core with particles */}
      <InnerGlowParticles />

      {/* Inner bright core */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshBasicMaterial color="#00FFDD" transparent opacity={0.95} />
      </mesh>

      {/* Main light — stronger glow */}
      <pointLight 
        color="#00E5FF" 
        intensity={isMobile ? 12 : 10} 
        distance={16} 
        decay={2} 
      />

      {/* Secondary accent light */}
      <pointLight
        color="#00DDFF"
        intensity={isMobile ? 6 : 4}
        distance={10}
        decay={2.5}
        position={[0, -0.5, 0]}
      />

      {/* 4 oral arms — thinner, glowy */}
      {Array.from({ length: 4 }, (_, i) => <OralArm key={i} index={i} />)}

      {/* 8 long tentacles — crisp and bright */}
      {!isMobile && Array.from({ length: 8 }, (_, i) => (
        <Tentacle key={i} index={i} count={8} length={8} color="#1BFFD3" speed={0.8} radius={0.01} />
      ))}
    </group>
  )
}

