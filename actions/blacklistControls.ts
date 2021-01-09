import { getCanvasState } from '../consulters'

export default function blacklistControls(controlsToBlacklist: string[], canvasSelector = 'canvas') {
    const canvasState = getCanvasState(canvasSelector)

    canvasState.presetConfiguration.controlsBlacklist.splice(0)

    canvasState.presetConfiguration.controlsBlacklist.push(...controlsToBlacklist)
}