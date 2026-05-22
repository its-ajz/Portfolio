'use client'

import { Text } from '@react-three/drei'
import { ZONE_LABELS } from '../data/project'

export default function ZoneLabels() {
  return (
    <>
      {ZONE_LABELS.map(({ label, position, color }) => (
        <Text
          key={label}
          position={position}
          fontSize={0.22}
          color={color}
          letterSpacing={0.18}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.35}
        >
          {label.toUpperCase()}
        </Text>
      ))}
    </>
  )
}