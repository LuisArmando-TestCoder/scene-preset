import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { CanvasState } from '../types/state'

export default function setCameraAutoFocus(canvasState: CanvasState) {
    canvasState.canvas.addEventListener('mouseout', () => {
        canvasState.canvas.blur()
        enableBodyScroll(document.body)
    })
    canvasState.canvas.addEventListener('mouseenter', () => {
        canvasState.canvas.focus()
        disableBodyScroll(document.body)
    })
}