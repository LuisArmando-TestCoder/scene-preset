import { CanvasState } from '../types/state'

import setFirstPersonDirection from './setFirstPersonDirection'
import setFirstPersonZoom from './setFirstPersonZoom'
import setFirstPersonPosition from './setFirstPersonPosition'
import setCanvasAutoFocus from './setCanvasAutoFocus'

const controls = {
    setFirstPersonDirection,
    setFirstPersonZoom,
    setFirstPersonPosition,
    setCanvasAutoFocus,
}

function blacklistControls(controlsBlacklist: string[], controlNames: string[]) {
    controlsBlacklist.forEach(controlName => {
        if (controlNames.includes(controlName)) {
            delete controls[controlName]
        }
    })
}

function startControls(canvasState: CanvasState) {
    Object.keys(controls).forEach(controlName => {
        controls[controlName](canvasState)
    })
}

export default function setFilteredControls(canvasState: CanvasState) {
    const { controlsBlacklist } = canvasState.presetConfiguration
    const controlNames = Object.keys(controls)

    blacklistControls(controlsBlacklist, controlNames)
    startControls(canvasState)
}