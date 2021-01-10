import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'

import { getCanvasState } from '../consulters'

export default function toggleVR(canvasSelector: string = 'canvas') {
    const canvasState = getCanvasState(canvasSelector)

    if (!canvasState.VRToggler) {
        canvasState.VRToggler = VRButton.createButton(canvasState.renderer)
    }

    setTimeout(() => canvasState.VRToggler.click())
}