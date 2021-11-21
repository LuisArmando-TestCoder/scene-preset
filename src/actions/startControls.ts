import { CanvasState } from "../types/state"

import setFirstPersonDirection from "./setFirstPersonDirection"
import setFirstPersonZoom from "./setFirstPersonZoom"
import setFirstPersonPosition from "./setFirstPersonPosition"
import setCanvasAutoFocus from "./setCanvasAutoFocus"

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
