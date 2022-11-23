import * as THREE from "three"

import { componentNames } from "../state/index.js"

export default class SimpleCube {
  height = 1
  material = new THREE.MeshStandardMaterial({ color: 0x44ffff })
  geometry = new THREE.BoxBufferGeometry(this.height, this.height, this.height)
  object = new THREE.Mesh(this.geometry, this.material)

  constructor() {
    this.object.position.y = this.height / 2
    this.object.castShadow = true
    this.object.receiveShadow = false
    this.object.name = componentNames.SimpleCube
  }
}
