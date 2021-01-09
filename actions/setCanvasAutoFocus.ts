import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { CanvasState } from '../types/state'

export default function setCameraAutoFocus(canvasState: CanvasState) {
    const { controlsBlacklist } = canvasState.presetConfiguration
    const getIsPassingBlacklist = () => !controlsBlacklist.includes('setCanvasAutoFocus')

    canvasState.canvas.addEventListener('mouseout', () => {
        if (getIsPassingBlacklist()) {
            canvasState.canvas.blur()
            enableBodyScroll(document.body)    
        }
    })
    canvasState.canvas.addEventListener('mouseenter', () => {
        if (getIsPassingBlacklist()) {
            canvasState.canvas.focus()
            disableBodyScroll(document.body)
        }
    })
}