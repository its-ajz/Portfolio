'use client'

import { useRef, useMemo } from 'react'
import { useFrame, extend, type ThreeElement } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useIsMobile } from '../hooks/useIsMobile'
import { Tendrils, FrilledArms } from './JellyfishTendrils'

// Fresnel-driven emissive material — soft backlit translucency, no environment
// reflections (the shader never samples scene.environment), replacing
// MeshTransmissionMaterial's optical transmission look on the outer bell.
const BellMaterial = shaderMaterial(
  {
    uColor: new THREE.Color('#0099CC'),
    uRimColor: new THREE.Color('#AFFFFA'),
    uFresnelPower: 2.2,
    uOpacity: 0.85,
    uIntensity: 1.4,
    uRibCount: 16.0,
    uRibIntensity: 0.4,
    uDotColor: new THREE.Color('#EAFFFF'),
    uDotIntensity: 0.8,
  },
  /* glsl vertex */ `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying vec3 vPos;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPos = position;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewDir = normalize(-mvPosition.xyz);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  /* glsl fragment */ `
    varying vec3 vNormal;
    varying vec3 vViewDir;
    varying vec3 vPos;
    uniform vec3 uColor;
    uniform vec3 uRimColor;
    uniform float uFresnelPower;
    uniform float uOpacity;
    uniform float uIntensity;
    uniform float uRibCount;
    uniform float uRibIntensity;
    uniform vec3 uDotColor;
    uniform float uDotIntensity;

    float hash21(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewDir);
      float fresnel = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), uFresnelPower);
      vec3 color = mix(uColor, uRimColor, fresnel) * uIntensity;
      float alpha = clamp(uOpacity * (0.35 + fresnel * 0.9), 0.0, 1.0);

      // Surface param: phi (azimuth around the vertical axis) doubles as
      // the "spoke" direction for ribs; theta (angle from apex) drives
      // both the rib radial fade and the dot grid's second axis.
      float phi = atan(vPos.z, vPos.x);
      float theta = acos(clamp(vPos.y / max(length(vPos), 0.0001), -1.0, 1.0));

      // 2a — radial ribs: thin bright spokes from apex to margin, faded out
      // right at the apex singularity so they don't pinch to a hard point,
      // and faded out again past the margin (PI*0.5) so they don't bleed
      // onto the underside curl below the widest point.
      float ribRaw = abs(sin(phi * uRibCount));
      float ribLine = pow(ribRaw, 10.0);
      float ribRadialFade = smoothstep(0.05, 0.22, theta) * (1.0 - smoothstep(1.35, 1.5708, theta));
      float ribs = ribLine * ribRadialFade * uRibIntensity;
      color += ribs * uRimColor;
      alpha = clamp(alpha + ribs * 0.15, 0.0, 1.0);

      // 2b — procedural speckle: grid over (phi, theta), one pseudo-random
      // dot per cell (some cells skipped for irregular, natural spacing).
      vec2 cell = vec2(phi * 5.0, theta * 11.0);
      vec2 cellId = floor(cell);
      vec2 cellUv = fract(cell);
      float h = hash21(cellId);
      vec2 dotCenter = vec2(fract(h * 7.0), fract(h * 13.0));
      float dotRadius = 0.14 + 0.1 * fract(h * 23.0);
      float d = distance(cellUv, dotCenter);
      float dot = 1.0 - smoothstep(dotRadius * 0.5, dotRadius, d);
      float presence = step(0.42, fract(h * 31.0));
      float dotRadialFade = 1.0 - smoothstep(1.3, 1.5708, theta);
      dot *= presence * uDotIntensity * dotRadialFade;
      color += dot * uDotColor;
      alpha = clamp(alpha + dot * 0.25, 0.0, 1.0);

      gl_FragColor = vec4(color, alpha);
    }
  `
)

extend({ BellMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    bellMaterial: ThreeElement<typeof BellMaterial>
  }
}

// Flatter/wider proportions applied to the bell mesh (compensates for the
// pulse animation in Jellyfish's useFrame, which sets scale directly).
const BELL_BASE_SCALE: [number, number, number] = [1.32, 0.72, 1.32]

// SphereGeometry is radially symmetric by construction — its thetaLength
// can flatten the profile, but it can't produce individual angularly-
// distinct lobes around the rim. Those need actual per-vertex displacement,
// built once here (not per-frame): push the outer band of rim vertices
// outward in a repeating sin(lobeCount * azimuth) pattern.
function smoothstep(t: number) {
  return t * t * (3 - 2 * t)
}

// Widest point of the dome (true equator, theta = PI/2) — the scalloped
// margin sits here. Exported so the fragment shader's rib pattern can fade
// out at the same boundary instead of continuing onto the underside.
const BELL_MARGIN_THETA = Math.PI * 0.5

function buildBellGeometry() {
  const radius = 1.2
  // Extends past the equator (0.5π) into a continuous inward curl, so the
  // underside is part of the SAME surface/material as the dome rather than
  // handing off to a separate flat object at the rim — that handoff is what
  // was reading as a hard seam (two different meshes meeting at an edge is
  // a real geometric/normal discontinuity; no shader trick fixes that,
  // since it's a shape mismatch, not a color mismatch).
  const thetaLength = Math.PI * 0.66
  const marginHalfWidth = Math.PI * 0.09
  // Fewer, wider lobes read as rounded petals instead of sawtooth spikes —
  // 14 lobes across 96 segments left only ~7 vertices per cycle, not enough
  // to render a sine curve as anything but short straight angular facets.
  const lobeCount = 9
  const lobeDepth = radius * 0.075
  const widthSegments = 140

  const geo = new THREE.SphereGeometry(radius, widthSegments, 64, 0, Math.PI * 2, 0, thetaLength)
  const pos = geo.attributes.position
  const v = new THREE.Vector3()

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const theta = Math.acos(THREE.MathUtils.clamp(v.y / radius, -1, 1))
    const distFromMargin = Math.abs(theta - BELL_MARGIN_THETA)
    if (distFromMargin < marginHalfWidth) {
      // 1 exactly at the margin (widest point), tapering smoothly to 0 at
      // the band's edges on BOTH sides — fades into the smooth dome above
      // and the smooth underside curl below, not just one direction.
      const bandT = smoothstep(1 - distFromMargin / marginHalfWidth)
      const phi = Math.atan2(v.z, v.x)
      const raw = Math.sin(phi * lobeCount)
      // Round the peaks (broad, flat-topped lobes) instead of a knife-edge
      // sine crest, and keep the valleys shallow — biological scalloping
      // is mostly rounded outward bulges with soft gaps, not deep notches.
      const shaped = Math.sign(raw) * Math.pow(Math.abs(raw), 0.6)
      const depthFactor = shaped >= 0 ? 1.0 : 0.35
      const outward = lobeDepth * bandT * shaped * depthFactor
      const horizR = Math.sqrt(v.x * v.x + v.z * v.z)
      if (horizR > 1e-5) {
        const scale = (horizR + outward) / horizR
        v.x *= scale
        v.z *= scale
      }
    }
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

// Mobile-only oral arm: writes into a pre-allocated Float32Array and flags
// it dirty (no per-frame allocation). Desktop uses <FrilledArms /> instead
// (JellyfishTendrils.tsx) — an instanced, shader-driven ribbon replacing
// the old per-frame TubeGeometry rebuild.
function OralArmMobile({ index }: { index: number }) {
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

    if (!geoRef.current) return
    const arr = geoRef.current.attributes.position.array as Float32Array
    for (let i = 0; i <= SEGS; i++) {
      arr[i * 3] = points[i].x
      arr[i * 3 + 1] = points[i].y
      arr[i * 3 + 2] = points[i].z
    }
    geoRef.current.attributes.position.needsUpdate = true
  })

  return (
    <line>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color="#9B5FFF" transparent opacity={0.7} />
    </line>
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

const AURA_BASE_SCALE: [number, number, number] = [1.24, 0.74, 1.24]

function LuminousEdge() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    // Subtle breathing effect, layered on top of the flattened base scale
    const pulse = 1 + Math.sin(t * 1.5) * 0.08
    meshRef.current.scale.set(
      AURA_BASE_SCALE[0] * pulse,
      AURA_BASE_SCALE[1] * pulse,
      AURA_BASE_SCALE[2] * pulse,
    )
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={AURA_BASE_SCALE}>
      <sphereGeometry args={[1.3, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
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
  const bellGeometry = useMemo(() => buildBellGeometry(), [])

  useFrame((state) => {
    if (!bellRef.current || !groupRef.current) return
    const t = state.clock.elapsedTime

    // More dramatic pulse — draws attention. Layered on top of the flatter
    // base proportions (BELL_BASE_SCALE) rather than overwriting them.
    const pulse = Math.sin(t * 1.2) * 0.15
    bellRef.current.scale.set(
      BELL_BASE_SCALE[0] * (1 - pulse * 0.4),
      BELL_BASE_SCALE[1] * (1 + pulse),
      BELL_BASE_SCALE[2] * (1 - pulse * 0.4),
    )

    // Floating motion
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.3 + Math.sin(t * 0.3) * 0.1
  })

  return (
    <group ref={groupRef}>
      {/* Luminous outer aura */}
      <LuminousEdge />

      {/* Outer bell — main visual */}
      <mesh ref={bellRef} geometry={bellGeometry} scale={BELL_BASE_SCALE}>
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
          <bellMaterial
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
            uColor={new THREE.Color('#0099CC')}
            uRimColor={new THREE.Color('#AFFFFA')}
            uFresnelPower={2.2}
            uOpacity={0.85}
            uIntensity={1.4}
            uRibCount={16}
            uRibIntensity={0.4}
            uDotColor={new THREE.Color('#EAFFFF')}
            uDotIntensity={0.8}
          />
        )}
      </mesh>

      {/* Inner bell — depth layer with stronger glow. Extended thetaLength
          to follow the outer bell's continuous underside curl instead of
          stopping at the old flat rim, so it doesn't poke through/create
          its own mismatched edge against the new outer shape. */}
      <mesh scale={[1.02, 0.56, 1.02]}>
        <sphereGeometry args={[1.2, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
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
      

      {/* Inner glow core with particles */}
      <InnerGlowParticles />

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

      {/* Oral arms — frilled ribbon instances on desktop, cheap buffer-line path on mobile */}
      {isMobile
        ? Array.from({ length: 4 }, (_, i) => <OralArmMobile key={i} index={i} />)
        : <FrilledArms />}

      {/* 32 hair-thin trailing tendrils — instanced, GPU-driven (desktop only) */}
      {!isMobile && <Tendrils />}
    </group>
  )
}

