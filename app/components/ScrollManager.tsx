'use client'

import { useRef, useEffect, type MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Jellyfish from './Jellyfish'

const PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0,  3,  14),
  new THREE.Vector3(1,  2,   6),
  new THREE.Vector3(20, 2, -18),
  new THREE.Vector3(-14, 0, -26),
  new THREE.Vector3(14, 4, -44),
  new THREE.Vector3(-14, 2, -42),
  new THREE.Vector3(4, -2, -58),
  new THREE.Vector3(0,  0, -72),
], false, 'catmullrom', 0.5)

export default function ScrollManager({
  jellyfishPos,
}: {
  jellyfishPos: MutableRefObject<THREE.Vector3>
}) {
  const scrollRef   = useRef(0)
  const smoothRef   = useRef(0)
  const jellyRef    = useRef<THREE.Group>(null)
  const { camera }  = useThree()

  useEffect(() => {
    const handler = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollRef.current = max > 0 ? window.scrollY / max : 0
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useFrame(() => {
    smoothRef.current += (scrollRef.current - smoothRef.current) * 0.06

    const t  = Math.max(0, Math.min(0.999, smoothRef.current))
    const tL = Math.min(0.999, t + 0.035)
    const tJ = Math.min(0.999, t + 0.04)

    // Camera
    const camPos    = PATH.getPoint(t)
    const camLook   = PATH.getPoint(tL)
    camera.position.lerp(camPos, 0.08)
    camera.lookAt(camLook)

    // Jellyfish
    const jellyPos  = PATH.getPoint(tJ)
    jellyfishPos.current.copy(jellyPos)

    if (jellyRef.current) {
      jellyRef.current.position.lerp(jellyPos, 0.1)

      // Face direction of travel
      const nextPos = PATH.getPoint(Math.min(0.999, tJ + 0.015))
      const dir = nextPos.clone().sub(jellyPos).normalize()
      if (dir.length() > 0.001) {
        const targetQuat = new THREE.Quaternion()
        const up = new THREE.Vector3(0, 1, 0)
        const mat = new THREE.Matrix4().lookAt(jellyPos, nextPos, up)
        targetQuat.setFromRotationMatrix(mat)
        jellyRef.current.quaternion.slerp(targetQuat, 0.04)
      }
    }
  })

  return (
    <group ref={jellyRef}>
      <Jellyfish />
    </group>
  )
}