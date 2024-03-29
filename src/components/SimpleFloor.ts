import * as THREE from "three"

import { componentNames } from "../state/index.js"

export default class SimpleFloor {
  material = new THREE.MeshStandardMaterial({ color: 0xcccccc })
  geometry = new THREE.PlaneGeometry(200, 200)
  object = new THREE.Mesh(this.geometry, this.material)

  constructor() {
    this.object.rotation.x = -Math.PI / 2
    this.object.receiveShadow = true
    this.object.castShadow = false
    this.object.name = componentNames.SimpleFloor
  }
}
