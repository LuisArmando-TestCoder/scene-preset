import { getCanvasState } from "../consulters/index.js"
import { ControlsBlacklist } from "../types/state"

export default function blacklistControls(
  controlsToBlacklist: ControlsBlacklist,
  canvasSelector = "canvas"
) {
  const canvasState = getCanvasState(canvasSelector)

  if (canvasState) {
    canvasState.presetConfiguration.controlsBlacklist.splice(0)
  
    canvasState.presetConfiguration.controlsBlacklist.push(
      ...controlsToBlacklist
    )
  }
}
