'use client'

import { useRef, useEffect, type MutableRefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useKeyboard } from '../hooks/useKeyboard'
import Jellyfish from './Jellyfish'

const SPEED        = 0.08
const DAMPING      = 0.88
const CAM_DISTANCE = 8


export default function JellyfishNavigator({
  jellyfishPos,
}: {
  jellyfishPos: MutableRefObject<THREE.Vector3>
}) {
  const camVel = useRef(new THREE.Vector3())
  const navRef     = useRef<THREE.Group>(null)
  const pos        = useRef(new THREE.Vector3(0, 0, 0))
  const vel        = useRef(new THREE.Vector3(0, 0, 0))
  const yaw        = useRef(Math.PI)   // horizontal look angle
  const pitch      = useRef(0.25)      // vertical look angle
  const isDragging = useRef(false)
  const keys       = useKeyboard()
  const { camera } = useThree()

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 2) isDragging.current = true
    }
    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 2) isDragging.current = false
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      yaw.current   -= e.movementX * 0.003
      pitch.current -= e.movementY * 0.003
      pitch.current  = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 3, pitch.current))
    }
    const onContextMenu = (e: Event) => e.preventDefault()

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('contextmenu', onContextMenu)

    return () => {
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('contextmenu', onContextMenu)
    }
  }, [])

  useFrame(() => {
    const v = vel.current
    const p = pos.current
    const k = keys.current

    // Movement relative to where you're looking
    const forward = new THREE.Vector3(
      -Math.sin(yaw.current) * Math.cos(pitch.current),
      -Math.sin(pitch.current),
      -Math.cos(yaw.current) * Math.cos(pitch.current)
    )
    const right = new THREE.Vector3(
      Math.cos(yaw.current),
      0,
      -Math.sin(yaw.current)
    )

    if (k['KeyW'] || k['ArrowUp'])    v.addScaledVector(forward, SPEED)
    if (k['KeyS'] || k['ArrowDown'])  v.addScaledVector(forward, -SPEED)
    if (k['KeyA'] || k['ArrowLeft'])  v.addScaledVector(right, -SPEED)
    if (k['KeyD'] || k['ArrowRight']) v.addScaledVector(right, SPEED)
    if (k['Space'])                    v.y += SPEED
    if (k['ShiftLeft'])                v.y -= SPEED

    v.multiplyScalar(DAMPING)
    p.add(v)
    jellyfishPos.current.copy(p)

    // Move jellyfish
    if (navRef.current) {
      navRef.current.position.lerp(p, 0.12)
      navRef.current.rotation.z = THREE.MathUtils.lerp(
        navRef.current.rotation.z, -v.x * 4, 0.1
      )
      navRef.current.rotation.x = THREE.MathUtils.lerp(
        navRef.current.rotation.x, v.z * 2, 0.1
      )
    }

    // Camera orbits behind + around jellyfish based on yaw/pitch
    // Spring camera — replaces the lerp
    const camX = Math.sin(yaw.current) * Math.cos(pitch.current) * CAM_DISTANCE
    const camY = Math.sin(pitch.current) * CAM_DISTANCE + 1
    const camZ = Math.cos(yaw.current) * Math.cos(pitch.current) * CAM_DISTANCE

    const camTarget = p.clone().add(new THREE.Vector3(camX, camY, camZ))

    const diff = camTarget.clone().sub(camera.position)
    camVel.current.multiplyScalar(0.8)       // damping
    camVel.current.addScaledVector(diff, 0.05) // spring force
    camera.position.add(camVel.current)
    camera.lookAt(p.x, p.y, p.z)
  })

  return (
    <group ref={navRef}>
      <Jellyfish />
    </group>
  )
}