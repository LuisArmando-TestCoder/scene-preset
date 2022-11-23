import * as THREE from "three"

import { componentNames } from "../state/index.js"

export default class SimpleSphere {
  radius = 1
  color = 0x44ffff
  material = new THREE.MeshStandardMaterial({ color: this.color })
  geometry = new THREE.SphereBufferGeometry(this.radius / 2, 100, 100)
  object = new THREE.Mesh(this.geometry, this.material)

  constructor() {
    this.object.position.y = this.radius * 2
    this.object.castShadow = true
    this.object.receiveShadow = false
    this.object.name = componentNames.SimpleSphere
  }
}
