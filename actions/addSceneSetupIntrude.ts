import { CanvasStateCallback } from '../types/state'
import { sceneSetupIntrudes } from '../state'

export default function addSceneSetupIntrude(callback: CanvasStateCallback, canvasSelector = 'canvas') {    
    if (!sceneSetupIntrudes[canvasSelector]) {
        sceneSetupIntrudes[canvasSelector] = []
    }

    sceneSetupIntrudes[canvasSelector].push(callback)
}