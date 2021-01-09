import { CanvasState } from '../types/state'

function setCameraDirection(event) {
    if (!mouseController.cameraDirection) {
        mouseController.cameraDirection = {
            x: 0,
            y: 0,
        }
    }

    const {
        speedResistance,
        cameraDirection,
        absoluteYSinLimit,
    } = mouseController
    const move = {
        x: -event.movementX / speedResistance,
        y: -event.movementY / Math.PI / speedResistance,
    }

    cameraDirection.x += move.x

    const futureYSinValueDirection = Math.abs(Math.sin(cameraDirection.y + move.y))

    if (futureYSinValueDirection < absoluteYSinLimit) {
        cameraDirection.y += move.y
    }
}

function setCameraSight(event) {
    if (mouseController.isPressed) {
        const control = mouseController
        setCameraDirection(event)

        control.lookAt.x = control.camera.position.x + Math.sin(control.cameraDirection.x)
        control.lookAt.y = control.camera.position.y + Math.sin(control.cameraDirection.y) * Math.PI
        control.lookAt.z = control.camera.position.z + Math.cos(control.cameraDirection.x)

        control.camera.lookAt(
            control.lookAt.x,
            control.lookAt.y,
            control.lookAt.z,
        )

        control.camera.look = control.lookAt
    }
}

function fakeCameraSetting() {
    mouseController.isPressed = true

    setCameraSight({
        movementX: 0,
        movementY: 0,
    })

    mouseController.isPressed = false
}

function setControlOnMouseDown(event: MouseEvent, canvasState: CanvasState) {
    const isRightClick = event.which === 3
    if (isRightClick) {
        event.preventDefault()

        mouseController.isPressed = true

        canvasState.canvas.focus()
        canvasState.canvas.requestPointerLock()
    }
}

function setControlOnMouseUp(event: MouseEvent) {
    event.preventDefault()
    document.exitPointerLock()

    mouseController.isPressed = false
}

export class MouseController {
    absoluteYSinLimit = 0.9
    isPressed = false
    cameraDirection = null
    speedResistance = 450
    lookAt = {
        x: null,
        y: null,
        z: null,
    }
    camera = null
}

export const mouseController = new MouseController()

export default function setFirstPersonDirection(canvasState: CanvasState) {
    mouseController.camera = canvasState.camera

    const { controlsBlacklist } = canvasState.presetConfiguration
    const getIsPassingBlacklist = () => !controlsBlacklist.includes('setFirstPersonDirection')

    canvasState.canvas.addEventListener('mousemove', (event: MouseEvent) => {
        getIsPassingBlacklist() && setCameraSight(event)
    })
    canvasState.canvas.addEventListener('mouseup', (event: MouseEvent) => {
        getIsPassingBlacklist() && setControlOnMouseUp(event)
    })
    canvasState.canvas.addEventListener('mousedown', (event: MouseEvent) => {
        getIsPassingBlacklist() && setControlOnMouseDown(event, canvasState)
    })

    fakeCameraSetting()
}
