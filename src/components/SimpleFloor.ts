import * as THREE from "three"

import { componentNames } from "../state/index"

export default class SimpleFloor {
  material = new THREE.MeshStandardMaterial({ color: 0xcccccc })
  geometry = new THREE.PlaneGeometry(200, 200)
  mesh: THREE.Mesh

  constructor() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.mesh.rotation.x = -Math.PI / 2
    this.mesh.receiveShadow = true
    this.mesh.castShadow = false
    this.mesh.name = componentNames.SimpleFloor
  }
}
