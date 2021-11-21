import { getCanvasState } from "../consulters/index"
import { ControlsBlacklist } from "../types/state"

export default function blacklistControls(
  controlsToBlacklist: ControlsBlacklist,
  canvasSelector = "canvas"
) {
  const canvasState = getCanvasState(canvasSelector)

  canvasState?.presetConfiguration.controlsBlacklist.splice(0)

  canvasState?.presetConfiguration.controlsBlacklist.push(
    ...controlsToBlacklist
  )
}
