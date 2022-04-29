import * as THREE from "three"

import defaultFragmentShader from "../shaders/fragment/default"
import defaultVertexShader from "../shaders/vertex/default"

export interface Vector3D {
  x?: number
  y?: number
  z?: number
}

export interface TransformVectors {
  position?: Vector3D
  rotation?: Vector3D
}

export interface AssemblyMeshesGroupOptions {
  amount?: number
  transformVectors?: TransformVectors[]
  setupChildPosition?: (
    index: number,
    amount: number,
    mesh: THREE.Object3D
  ) => TransformVectors
  setupGroup?: (group: THREE.Group, mesh: THREE.Object3D) => void
  material?: THREE.Material
  vertexShader?: string
  fragmentShader?: string
  geometry?: THREE.BufferGeometry
  name?: string
  size?: Vector3D
}

function setVector3D({
  originalVector,
  newVector,
  defaultValue = 0,
  defaultVector,
}: {
  originalVector: THREE.Vector3 | THREE.Euler
  newVector: Vector3D
  defaultValue?: number
  defaultVector?: Vector3D
}) {
  const vector = defaultVector || {
    x: defaultValue,
    y: defaultValue,
    z: defaultValue,
  }
  originalVector.set(
    (newVector.x || vector.x as number),
    (newVector.y || vector.y as number),
    (newVector.z || vector.z as number)
  )
}

function setMeshTransform(
  mesh: THREE.Mesh | THREE.Object3D,
  transformVectors: TransformVectors
) {
  setVector3D({
    originalVector: mesh.rotation,
    newVector: transformVectors.rotation as THREE.Vector3,
  })

  setVector3D({
    originalVector: mesh.position,
    newVector: transformVectors.position as THREE.Vector3,
  })
}

export default ({
  amount = 1,
  transformVectors = [],
  setupChildPosition,
  setupGroup,
  material,
  geometry,
  name = "generated",
  vertexShader = defaultVertexShader,
  fragmentShader = defaultFragmentShader,
  size = { x: 1, y: 1, z: 1 },
}: AssemblyMeshesGroupOptions) => {
  const group = new THREE.Group()

  group.name = name

  const currentGeometry =
    geometry ||
    new THREE.BoxBufferGeometry(size.x || 1, size.y || 1, size.z || 1)
  const currentMaterial =
    material ||
    new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
    })
  const mesh = new THREE.Mesh(currentGeometry, currentMaterial)

  mesh.name = `${name}-child`

  transformVectors.forEach(transformVectors => {
    const childMesh = mesh.clone()

    setMeshTransform(childMesh, transformVectors)

    group.add(childMesh)
  })

  if (setupChildPosition && amount >= 1) {
    for (let index = 0; index < amount; index++) {
      const childMesh = mesh.clone()

      const transformVectors = setupChildPosition && setupChildPosition(index, amount, childMesh)

      if (transformVectors) {
        setMeshTransform(childMesh, transformVectors)

        group.add(childMesh)
      }
    }
  }

  setupGroup && setupGroup(group, mesh)

  return {
    currentGeometry,
    currentMaterial,
    mesh,
    group,
    amount,
    frame(
      callback: (
        value: THREE.Object3D,
        index: number,
        array: THREE.Object3D[]
      ) => void
    ) {
      group.children.forEach(callback)
    },
  }
}
