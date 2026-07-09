'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame, extend, type ThreeElement } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Desktop-only replacement for the old per-frame TubeGeometry rebuild
// (CatmullRomCurve3 + TubeGeometry allocated fresh every frame, one mesh per
// strand). Every strand here is one instance of a single InstancedMesh; the
// wave motion happens in the vertex shader driven by a single `uTime`
// uniform, so per-frame CPU cost is one scalar write regardless of strand
// count — no per-frame allocation, no per-frame geometry rebuild. Mobile
// keeps its existing separate Float32Array/bufferGeometry path in
// Jellyfish.tsx untouched.

const TendrilMaterial = shaderMaterial(
  {
    uTime: 0,
    uBaseFreq: 1.8,
    uBaseAmp: 0.4,
    uColor: new THREE.Color('#1BFFD3'),
    uTipColor: new THREE.Color('#04201d'),
    uFrill: 0,
  },
  /* glsl vertex */ `
    attribute float aProgress;
    attribute float aSide;
    attribute float aPhase;
    attribute float aFreq;
    attribute float aAmp;
    attribute float aSeed2;
    uniform float uTime;
    uniform float uBaseFreq;
    uniform float uBaseAmp;
    varying float vProgress;
    varying float vSide;
    void main() {
      vProgress = aProgress;
      vSide = aSide;
      float amp = uBaseAmp * aAmp * pow(aProgress, 1.3);
      float t = uTime * uBaseFreq * aFreq;
      // Per-instance spatial frequency too (not just time-phase/rate) —
      // otherwise every strand is the same waveform merely phase-shifted,
      // which is what reads as a repeated braid rather than independent
      // strands, no matter how much the phase varies.
      float spatialFreqX = 7.0 + 4.0 * aFreq;
      float spatialFreqZ = 5.0 + 3.0 * fract(aSeed2 * 0.15915);
      float bendX = sin(t + aProgress * spatialFreqX + aPhase) * amp;
      float bendZ = cos(t * 1.15 + aProgress * spatialFreqZ + aPhase + aSeed2) * amp * 0.85;
      vec3 displaced = position + vec3(bendX, 0.0, bendZ);
      vec4 worldPos = instanceMatrix * vec4(displaced, 1.0);
      gl_Position = projectionMatrix * modelViewMatrix * worldPos;
    }
  `,
  /* glsl fragment */ `
    uniform vec3 uColor;
    uniform vec3 uTipColor;
    uniform float uFrill;
    varying float vProgress;
    varying float vSide;
    void main() {
      if (uFrill > 0.5) {
        float ruffle = sin(vProgress * 18.0) * 0.5 + 0.5;
        if (abs(vSide) > 0.3 + ruffle * 0.6) discard;
      }
      float fade = 1.0 - smoothstep(0.55, 1.0, vProgress);
      vec3 color = mix(uTipColor, uColor, fade);
      float alpha = fade * 0.85 + 0.15;
      gl_FragColor = vec4(color, alpha);
    }
  `
)

extend({ TendrilMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    tendrilMaterial: ThreeElement<typeof TendrilMaterial>
  }
}

// Static per-vertex ribbon: two columns (left/right) per row, tapering
// toward the tip. Built once via useMemo — never touched again after mount,
// all motion happens in the vertex shader.
//
// taperPower shapes the taper curve (1 = old linear falloff, unchanged
// default so existing callers are unaffected; >1 stays fuller near the
// root and narrows more sharply approaching the tip, which reads more
// organic than a straight linear taper).
//
// sagAmount bakes a baseline droop into the STATIC geometry, independent of
// the animated wave in the vertex shader — a motionless strand should still
// show a gentle curve from root to tip (like drag/gravity on a trailing
// appendage), not a straight line. Grows with p^2 (roughly catenary-like
// for a modest droop). Defaults to 0 (no change for existing callers).
function buildTendrilGeometry(
  segments: number,
  length: number,
  baseHalfWidth: number,
  taperAmount: number,
  taperPower = 1,
  sagAmount = 0,
) {
  const rows = segments + 1
  const positions = new Float32Array(rows * 2 * 3)
  const progress = new Float32Array(rows * 2)
  const side = new Float32Array(rows * 2)
  const indices: number[] = []

  for (let i = 0; i < rows; i++) {
    const p = i / segments
    const y = -p * length
    const halfW = baseHalfWidth * (1 - taperAmount * Math.pow(p, taperPower))
    const sag = sagAmount * p * p
    const li = i * 2
    const ri = li + 1

    positions[li * 3] = sag - halfW
    positions[li * 3 + 1] = y
    positions[li * 3 + 2] = 0
    progress[li] = p
    side[li] = -1

    positions[ri * 3] = sag + halfW
    positions[ri * 3 + 1] = y
    positions[ri * 3 + 2] = 0
    progress[ri] = p
    side[ri] = 1

    if (i < segments) {
      indices.push(li, li + 2, ri, ri, li + 2, ri + 2)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aProgress', new THREE.BufferAttribute(progress, 1))
  geometry.setAttribute('aSide', new THREE.BufferAttribute(side, 1))
  geometry.setIndex(indices)
  return geometry
}

// The bell's underside now curls continuously past its widest point
// (Jellyfish.tsx: buildBellGeometry, thetaLength=0.66π) instead of handing
// off to a separate velarium disc — the velarium mesh was removed. This is
// the shallowest that curl's underside ever sits (accounting for the bell's
// pulse animation, which also scales it), with a small safety margin below.
// Every strand root gets hard-clamped at or below this.
const RIM_UNDERSIDE_Y = -0.38

type InstanceLayout = {
  baseRadius: number
  radiusJitter: number
  /** Cartesian XZ scatter added on top of the radial ring, so roots aren't
   *  purely polar-distributed (which still reads as a fan). */
  posJitter: number
  baseY: number
  freqRange: [number, number]
  /** Curl amount (feeds the same aAmp attribute as before) for "long"
   *  instances — the majority when shortFraction > 0, or the whole
   *  population when it's 0. */
  ampRange: [number, number]
  /** Fraction of instances treated as "short" (0 = uniform length, matches
   *  prior behavior). The rest are "long". Both are baked into the
   *  instance's own scale — zero new per-frame cost, same as phase/amp. */
  shortFraction?: number
  shortLengthRange?: [number, number]
  longLengthRange?: [number, number]
  /** Curl amount for the "short" instances specifically. Bimodal by design:
   *  short strands read as a curlier secondary cluster, long ones as
   *  straighter trailing strands — reuses the existing aAmp buffer, just
   *  drawn from a different range depending on which length bucket an
   *  instance already fell into. No new attribute, no new architecture.
   *  Defaults to ampRange (old uniform behavior) when omitted. */
  shortAmpRange?: [number, number]
}

function useTendrilInstances(
  meshRef: React.RefObject<THREE.InstancedMesh | null>,
  count: number,
  layout: InstanceLayout,
) {
  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return
    const { baseRadius, radiusJitter, posJitter, baseY, freqRange, ampRange } = layout
    const shortFraction = layout.shortFraction ?? 0
    const [shortMin, shortMax] = layout.shortLengthRange ?? [1, 1]
    const [longMin, longMax] = layout.longLengthRange ?? [1, 1]
    const shortAmpRange = layout.shortAmpRange ?? ampRange

    const dummy = new THREE.Object3D()
    const phase = new Float32Array(count)
    const freq = new Float32Array(count)
    const amp = new Float32Array(count)
    const seed2 = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.55
      const radius = baseRadius + (Math.random() - 0.5) * radiusJitter
      const jitterX = (Math.random() - 0.5) * posJitter
      const jitterZ = (Math.random() - 0.5) * posJitter
      const isShort = Math.random() < shortFraction
      const lengthScale = isShort
        ? shortMin + Math.random() * (shortMax - shortMin)
        : longMin + Math.random() * (longMax - longMin)
      // Shorter strands read as finer/secondary, not just clipped — taper
      // width down partway with length instead of keeping full thickness.
      const widthScale = 0.65 + 0.35 * lengthScale
      const curlRange = isShort ? shortAmpRange : ampRange

      const rootY = Math.min(baseY + (Math.random() - 0.5) * 0.08, RIM_UNDERSIDE_Y)
      dummy.position.set(
        Math.cos(angle) * radius + jitterX,
        rootY,
        Math.sin(angle) * radius + jitterZ,
      )
      dummy.rotation.y = -angle
      dummy.rotation.z = (Math.random() - 0.5) * 0.5
      dummy.scale.set(widthScale, lengthScale, widthScale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)

      phase[i] = Math.random() * Math.PI * 2
      freq[i] = freqRange[0] + Math.random() * (freqRange[1] - freqRange[0])
      amp[i] = curlRange[0] + Math.random() * (curlRange[1] - curlRange[0])
      seed2[i] = Math.random() * Math.PI * 2
    }

    mesh.instanceMatrix.needsUpdate = true
    mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage)
    mesh.geometry.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phase, 1))
    mesh.geometry.setAttribute('aFreq', new THREE.InstancedBufferAttribute(freq, 1))
    mesh.geometry.setAttribute('aAmp', new THREE.InstancedBufferAttribute(amp, 1))
    mesh.geometry.setAttribute('aSeed2', new THREE.InstancedBufferAttribute(seed2, 1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

const TENDRIL_COUNT = 32

export function Tendrils() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const materialRef = useRef<InstanceType<typeof TendrilMaterial>>(null)
  // Wider base + steeper, front-loaded taper (taperPower=1.4: stays fuller
  // near the root, narrows faster approaching the tip) so the taper is
  // large enough in absolute terms to survive bloom, not just proportional.
  // sagAmount=0.9 bakes a baseline droop independent of the wave — see fix
  // #2: previously position was pure ±halfWidth with no drift term at all,
  // so a motionless strand was a literally straight line.
  const geometry = useMemo(() => buildTendrilGeometry(20, 8.5, 0.065, 0.97, 1.4, 0.9), [])

  useTendrilInstances(meshRef, TENDRIL_COUNT, {
    baseRadius: 0.8,
    radiusJitter: 0.5,
    posJitter: 0.3,
    baseY: -0.44,
    freqRange: [0.45, 1.75],
    // Majority (long, straight, trailing) — low curl, but not so low it's
    // invisible. Previous range [0.15,0.35] × uBaseAmp 0.22 topped out at
    // ~0.077 world units of sway on an 8-11 unit strand — under 1% of its
    // length, i.e. imperceptible ("laser beam"). This is calmer than the
    // arms but still a real, visible bend across the strand's length.
    ampRange: [0.6, 1.0],
    // Minority (short, curlier secondary cluster) — bimodal, not a
    // continuous range: reuses the same aAmp buffer, just drawn from a
    // different bracket depending on which length bucket an instance fell
    // into. Reference 3's trailing tentacles read as long and minimally
    // curled — this is what pushes the majority there.
    shortAmpRange: [1.3, 2.0],
    shortFraction: 0.22,
    shortLengthRange: [0.3, 0.5],
    longLengthRange: [0.95, 1.35],
  })

  useFrame((state) => {
    if (materialRef.current) materialRef.current.uTime = state.clock.elapsedTime
  })

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, TENDRIL_COUNT]} frustumCulled={false}>
      <tendrilMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        uColor={new THREE.Color('#1BFFD3')}
        uTipColor={new THREE.Color('#04201d')}
        uBaseFreq={1.4}
        uBaseAmp={0.65}
        uFrill={0}
      />
    </instancedMesh>
  )
}

// Fewer, thicker, more sharply-curled — the dominant frilled cluster
// directly under the bell (vs. Tendrils: numerous, longer, straighter).
const ARM_COUNT = 4

export function FrilledArms() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const materialRef = useRef<InstanceType<typeof TendrilMaterial>>(null)
  const geometry = useMemo(() => buildTendrilGeometry(20, 3.2, 0.2, 0.65), [])

  useTendrilInstances(meshRef, ARM_COUNT, {
    baseRadius: 0.3,
    radiusJitter: 0.1,
    posJitter: 0.06,
    baseY: -0.46,
    freqRange: [0.85, 1.35],
    ampRange: [1.4, 2.0],
  })

  useFrame((state) => {
    if (materialRef.current) materialRef.current.uTime = state.clock.elapsedTime
  })

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, ARM_COUNT]} frustumCulled={false}>
      <tendrilMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        uColor={new THREE.Color('#BB77FF')}
        uTipColor={new THREE.Color('#1a0a33')}
        uBaseFreq={1.7}
        uBaseAmp={0.85}
        uFrill={1}
      />
    </instancedMesh>
  )
}
