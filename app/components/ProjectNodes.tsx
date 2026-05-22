'use client'

import { type MutableRefObject } from 'react'
import * as THREE from 'three'
import { ALL_PROJECTS } from '../data/project'
import ProjectNode from './ProjectNode'

export default function ProjectNodes({
  jellyfishPos,
}: {
  jellyfishPos: MutableRefObject<THREE.Vector3>
}) {
  return (
    <>
      {ALL_PROJECTS.map(project => (
        <ProjectNode key={project.id} data={project} jellyfishPos={jellyfishPos} />
      ))}
    </>
  )
}