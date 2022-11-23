import { CanvasState } from "../types/state"

import setFirstPersonDirection from "./setFirstPersonDirection.js"
import setFirstPersonZoom from "./setFirstPersonZoom.js"
import setFirstPersonPosition from "./setFirstPersonPosition.js"
import setCanvasAutoFocus from "./setCanvasAutoFocus.js"

const controls = {
  setFirstPersonDirection,
  setFirstPersonZoom,
  setFirstPersonPosition,
  setCanvasAutoFocus,
}

export default function startControls(canvasState: CanvasState) {
  const controlNames = Object.keys(controls)

  controlNames.forEach(controlName => {
    controls[
      controlName as
        | "setFirstPersonDirection"
        | "setFirstPersonZoom"
        | "setFirstPersonPosition"
        | "setCanvasAutoFocus"
    ](canvasState)
  })
}
