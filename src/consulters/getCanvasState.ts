import { canvasesState } from "../state/index"

export default function getCanvasState(canvasSelector: string) {
  const canvas = document.querySelector(canvasSelector)
  const canvasState = canvasesState.find(canvasState => {
    return canvasState.canvas === canvas
  })

  return canvasState
}
