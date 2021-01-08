import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'

import { getCanvasState } from '../consulters'

export default function toggleVR(canvasSelector: string) {
    const canvasState = getCanvasState(canvasSelector)

    if (!canvasState.VRToggler) {
        canvasState.VRToggler = VRButton.createButton(canvasState.renderer)
    }

    canvasState.VRToggler.click()
}