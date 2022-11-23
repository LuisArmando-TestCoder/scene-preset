import * as THREE from "three"

import { getCanvasState } from "../consulters/index.js"
import { CanvasState, IntersectionUtils } from "../types/state"

const mouse = new THREE.Vector2()

function handleObjectIntersection(canvasSelector: string) {
  const { intersectionUtils } = getCanvasState(canvasSelector) as CanvasState
  const { matrices, raycaster } = intersectionUtils as IntersectionUtils
  const { objects: objectMatrix, callbacks: callbackMatrix } = matrices

  for (let i = 0; i < objectMatrix.length; i++) {
    const objects = objectMatrix[i]
    const [firstIntersection] = raycaster.intersectObjects(objects)

    if (firstIntersection) {
      callbackMatrix[i].forEach(callback => {
        const { object } = firstIntersection

        callback({
          object,
          canvasesState: getCanvasState(canvasSelector) as CanvasState,
        })
      })
    }
  }
}

export default function onClickIntersectsObject(
  objectsForIntersection: THREE.Object3D[],
  callback: Function,
  canvasSelector = "canvas"
) {
  const firstCanvasState = getCanvasState(canvasSelector)

  if (firstCanvasState && !firstCanvasState.intersectionUtils) {
    const canvas: HTMLCanvasElement | null = document.querySelector(
      canvasSelector
    )
    const raycaster = new THREE.Raycaster()

    const canvasState = getCanvasState(canvasSelector)

    if (canvasState) {
      canvasState.intersectionUtils = {
        raycaster,
        matrices: {
          callbacks: [],
          objects: [],
        },
      }
    }

    if (canvas) {
      canvas.addEventListener("click", (event: MouseEvent) => {
        const x =
          (event.clientX / window.innerWidth) * canvas.clientWidth +
          window.scrollX +
          canvas.getBoundingClientRect().left
  
        const y =
          (event.clientY / window.innerHeight) * canvas.clientHeight +
          window.scrollY +
          canvas.getBoundingClientRect().top
  
        mouse.set(
          (x / canvas.clientWidth) * 2 - 1,
          (y / canvas.clientHeight) * -2 + 1
        )

        const canvasState = getCanvasState(canvasSelector)
  
        if (canvasState) {
          raycaster.setFromCamera(
            mouse,
            canvasState.camera as THREE.Camera
          )
        }
  
        handleObjectIntersection(canvasSelector)
      })
    }

  }

  const canvasState = getCanvasState(canvasSelector)

  if (canvasState) {
    const { matrices } = canvasState.intersectionUtils as IntersectionUtils
    const { objects: objectMatrix, callbacks: callbackMatrix } = matrices
    const indexOfObjects = objectMatrix.indexOf(objectsForIntersection)
    const existingObjects = callbackMatrix[indexOfObjects]

    if (existingObjects) {
      callbackMatrix[indexOfObjects].push(callback)
      return
    }

    objectMatrix.push(objectsForIntersection)
    callbackMatrix.push([callback])
  }
}
