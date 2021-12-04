import * as THREE from "three"

import { componentNames } from "../state/index"

export default class SimpleSphere {
  radius = 1
  material = new THREE.MeshStandardMaterial({ color: 0x44ffff })
  geometry = new THREE.SphereBufferGeometry(this.radius / 2, 100, 100)
  object: THREE.Mesh

  constructor() {
    this.object = new THREE.Mesh(this.geometry, this.material)

    this.object.position.y = this.radius * 2
    this.object.castShadow = true
    this.object.receiveShadow = false
    this.object.name = componentNames.SimpleSphere
  }
}
