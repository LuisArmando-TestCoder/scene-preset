import * as THREE from 'three'

import { CanvasState } from '../types/state'
import { componentNames } from '../state'

import { SimpleLightSet, SimpleFloor, SimpleCube } from '../components'

function getDefaultObjects(): THREE.Group {
    const defaultObjects = new THREE.Group()
    const simpleLightSet = new SimpleLightSet()
    const simpleFloor = new SimpleFloor()
    const simpleCube = new SimpleCube()

    defaultObjects.name = componentNames.DefaultObjects

    defaultObjects.add(simpleLightSet.lightGroup)
    defaultObjects.add(simpleFloor.mesh)
    defaultObjects.add(simpleCube.mesh)

    return defaultObjects
}

export default function addDefaultObjects(canvasState: CanvasState) {
    const defaultObjects = getDefaultObjects()

    canvasState.scene.add(defaultObjects)
}