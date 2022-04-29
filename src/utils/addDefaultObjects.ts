import * as THREE from "three"

import { CanvasState } from "../types/state"
import { componentNames } from "../state/index"

import * as components from "../components/index"

function getDefaultObjects(): THREE.Group {
  const defaultObjects = new THREE.Group()

  Object.values(components).forEach(Component => {
    defaultObjects.add(new Component().object)
  })

  defaultObjects.name = componentNames.DefaultObjects

  return defaultObjects
}

export default function addDefaultObjects(canvasState: CanvasState) {
  const defaultObjects = getDefaultObjects()

  if (canvasState && canvasState.scene) {
    canvasState.scene.add(defaultObjects)
  }
}
