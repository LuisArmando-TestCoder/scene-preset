import * as THREE from 'three'

import { componentNames } from '../state'

function getHemisphereLight(): THREE.Light {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
    hemiLight.position.set(0, 20, 0)

    return hemiLight
}

function getDirectionalLight(): THREE.Light {
    const directionalLight = new THREE.DirectionalLight(0xffffff)

    directionalLight.position.set(3, 10, 10)
    directionalLight.shadow.camera.top = 2
    directionalLight.shadow.camera.bottom = - 2
    directionalLight.shadow.camera.left = - 2
    directionalLight.shadow.camera.right = 2
    directionalLight.shadow.camera.near = 0.1
    directionalLight.shadow.camera.far = 40
    directionalLight.castShadow = true

    return directionalLight
}

export default class SimpleLightSet {
    hemisphereLight = getHemisphereLight()
    directionalLight = getDirectionalLight()
    lightGroup = new THREE.Group()

    constructor() {
        this.lightGroup.name = componentNames.SimpleLightSet

        this.lightGroup.add(this.hemisphereLight)
        this.lightGroup.add(this.directionalLight)
    }
}