import { CanvasState } from '../types/state'

function setControlOnWheel(event: WheelEvent, canvasState: CanvasState) {
    const delta = -Math.sign(event.deltaY)
    const zoom = Math.min(
        canvasState.presetConfiguration.camera.zoom.max,
        Math.max(
            canvasState.presetConfiguration.camera.zoom.min,
            canvasState.camera['getFocalLength']() + delta
        )
    )
    
    canvasState.camera['setFocalLength'](zoom)
}

export default function setFirstPersonZoom(canvasState: CanvasState) {
    // [Violation]
    // Added non-passive event listener to a scroll-blocking 'wheel' event
    // Consider marking event handler as 'passive' to make the page more responsive
    // See https://www.chromestatus.com/feature/5745543795965952
    canvasState.canvas.addEventListener('wheel', event => {
        setControlOnWheel(event, canvasState)
    }, { passive: true })
}