import * as THREE from "three"
import { VRButton } from "three/examples/jsm/webxr/VRButton.js"
import { getCanvasState } from "../consulters/index.js"

export default function toggleVR(canvasSelector: string = "canvas") {
  const canvasState = getCanvasState(canvasSelector)

  if (canvasState && !canvasState.VRToggler) {
    canvasState.VRToggler = VRButton.createButton(
      canvasState.renderer as THREE.WebGLRenderer
    )
  }

  setTimeout(
    () => canvasState && canvasState.VRToggler && canvasState.VRToggler.click()
  )
}
