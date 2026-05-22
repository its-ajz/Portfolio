'use client'

import { useEffect, useRef } from 'react'
import { Howl } from 'howler'

export default function SoundManager({ started }: { started: boolean }) {
  const soundRef = useRef<Howl | null>(null)

  useEffect(() => {
    soundRef.current = new Howl({
      src: ['/sounds/ambient.mp3'],
      loop: true,
      volume: 0,
    })
  }, [])

  useEffect(() => {
    if (!soundRef.current) return
    if (started) {
      soundRef.current.play()
      soundRef.current.fade(0, 0.35, 3000)
    }
  }, [started])

  return null
}