import { useEffect, useRef } from 'react'

export function useKeyboard() {
  const keys = useRef<Record<string, boolean>>({})

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => { keys.current[e.code] = true }
    const onUp   = (e: KeyboardEvent) => { keys.current[e.code] = false }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [])

  return keys
}