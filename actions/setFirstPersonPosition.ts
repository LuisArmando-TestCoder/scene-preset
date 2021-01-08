import { mouseController } from './setFirstPersonDirection'
import { CanvasState } from '../types/state'
import { onKey } from '../events'
import animations from '../state/animations'

export class KeyController {
    keyAxes = {
        ws: [],
        ad: [],
    }
    chosenKey = ""
    flyingKeys = []
}

export const keyController = new KeyController()

const auxiliarCameraDirection = { x: Math.PI, y: Math.PI }

const friqtionResistance = 2

export class CameraProperties {
    position = {
        x: 0,
        z: 0,
        y: 2,
        min: {
            y: 2
        }
    }
    flySpeed = {
        force: 0.005,
        direction: 0,
        friction: 0.0025,
        acceleration: 0,
        max: {
            acceleration: 0.1
        }
    }
    acceleration = {
        x: 0,
        z: 0,
    }
    friqtion = {
        x: 0.005,
        z: 0.005,
    }
    rotation = 0
    chosenAxis = 'z'
    top = {
        acceleration: {
            x: 0.05,
            z: 0.05,
        },
    }
}

export const cameraProperties = new CameraProperties()

const move = {
    right_forward() {
        cameraProperties.rotation = deegresToRadians(-90)
        cameraProperties.chosenAxis = 'z'
    },
    left_forward() {
        cameraProperties.rotation = deegresToRadians(90)
        cameraProperties.chosenAxis = 'z'
    },
    right_backward() {
        cameraProperties.rotation = deegresToRadians(-270)
        cameraProperties.chosenAxis = 'x'
    },
    left_backward() {
        cameraProperties.rotation = deegresToRadians(270)
        cameraProperties.chosenAxis = 'x'
    },
    forward() {
        cameraProperties.rotation = 0
        cameraProperties.chosenAxis = 'z'
    },
    backward() {
        cameraProperties.rotation = deegresToRadians(360)
        cameraProperties.chosenAxis = 'z'
    },
    right() {
        cameraProperties.rotation = deegresToRadians(-180)
        cameraProperties.chosenAxis = 'x'
    },
    left() {
        cameraProperties.rotation = deegresToRadians(180)
        cameraProperties.chosenAxis = 'x'
    },
    up() {
        cameraProperties.flySpeed.direction = -1
    },
    down() {
        cameraProperties.flySpeed.direction = 1
    },
}

const flyingKeys = {
    KeyR: move.up,
    KeyF: move.down,
}

const movementKeys = {
    wa: move.left_forward,
    wd: move.right_forward,
    sa: move.left_backward,
    sd: move.right_backward,

    w: move.forward,
    a: move.left,
    s: move.backward,
    d: move.right,
}

const validAxes = ['x', 'z']

function deegresToRadians(degrees) {
    const normalizedDegrees = degrees / 360
    return normalizedDegrees * Math.PI
}

function reduceFirstPersonPositionAcceleration() {
    const key = 'acceleration'
    const obj = cameraProperties
    validAxes.forEach((axis) => {
        const surpassingFriqtion = Math.abs(obj[key][axis]) > obj.friqtion[axis] / 2
        if (surpassingFriqtion) {
            obj[key][axis] += -Math.sign(obj[key][axis]) * (obj.friqtion[axis] / friqtionResistance)
        } else {
            obj[key][axis] = 0
        }
    })
}

function topFirstPersonPositionAcceleration() {
    validAxes.forEach((axis) => {
        if (cameraProperties.acceleration[axis] > cameraProperties.top.acceleration[axis]) {
            cameraProperties.acceleration[axis] = cameraProperties.top.acceleration[axis]
        }
        if (cameraProperties.acceleration[axis] < -cameraProperties.top.acceleration[axis]) {
            cameraProperties.acceleration[axis] = -cameraProperties.top.acceleration[axis]
        }
    })
}

function setMoveOnKeyDown() {
    if (movementKeys[keyController.chosenKey]) {
        movementKeys[keyController.chosenKey]()

        const { acceleration, friqtion, chosenAxis } = cameraProperties

        acceleration[chosenAxis] += friqtion[chosenAxis] * friqtionResistance
    }
}

function chooseKey() {
    keyController.chosenKey = ""

    if (keyController.keyAxes.ws.length) {
        keyController.chosenKey = keyController.keyAxes.ws[
            keyController.keyAxes.ws.length - 1
        ]
    }

    if (keyController.keyAxes.ad.length) {
        keyController.chosenKey += keyController.keyAxes.ad[
            keyController.keyAxes.ad.length - 1
        ]
    }
}

function addKeyToQueue(key: string) {
    for (const keyAxis in keyController.keyAxes) {
        const keyAxisQueue = keyController.keyAxes[keyAxis]
        if (keyAxis.includes(key) && !keyAxisQueue.includes(key)) {
            keyAxisQueue.push(key)
            break
        }
    }
}

function deleteKeyFromQueue(key: string) {
    for (const keyAxis in keyController.keyAxes) {
        const keyAxisQueue = keyController.keyAxes[keyAxis]
        const isValidKey = keyAxis.includes(key) && keyAxisQueue.includes(key)

        if (isValidKey) {
            keyAxisQueue.splice(keyAxisQueue.indexOf(key), 1)
        }
    }
}

function triggerFlyCode() {
    if (keyController.flyingKeys.length) {
        // fly force increase
        cameraProperties.flySpeed.acceleration = Math.min(
            cameraProperties.flySpeed.max.acceleration,
            cameraProperties.flySpeed.acceleration
          + cameraProperties.flySpeed.force
        )

        flyingKeys[
            keyController.flyingKeys[
                keyController.flyingKeys.length - 1
            ]
        ]()
    }
}

function deleteFliyingKeyFromQueue(event: KeyboardEvent) {
    const isKeyAlreadyInQueue = keyController.flyingKeys.includes(event.code)

    if (isKeyAlreadyInQueue) {
        keyController.flyingKeys.splice(keyController.flyingKeys.indexOf(event.code), 1)
    }
}

function addFlyingKeyToQueue(event: KeyboardEvent) {
    const validFlyingCode = flyingKeys[event.code]

    if (validFlyingCode) {
        const isKeyAlreadyInQueue = keyController.flyingKeys.includes(event.code)

        if (!isKeyAlreadyInQueue) {
            keyController.flyingKeys.push(event.code)
        }

        event.preventDefault()
    }

}

function updateFirstPersonPosition(canvasState: CanvasState) {
    setMoveOnKeyDown()
    reduceFirstPersonPositionAcceleration()
    topFirstPersonPositionAcceleration()
    triggerFlyCode()


    const { cameraDirection } = mouseController
    const direction = cameraDirection || auxiliarCameraDirection

    const { camera } = canvasState
    const { acceleration, chosenAxis, rotation } = cameraProperties
    
    if (camera) {
        camera.position.x += acceleration[chosenAxis] * Math.sin(direction.x + rotation)
        camera.position.z += acceleration[chosenAxis] * Math.cos(direction.x + rotation)
        
        cameraProperties.flySpeed.acceleration = Math.max(
            0,
            cameraProperties.flySpeed.acceleration
          - cameraProperties.flySpeed.friction
        )
        cameraProperties.position.y = Math.max(
            cameraProperties.position.min.y,
            cameraProperties.position.y
          - cameraProperties.flySpeed.acceleration
          * cameraProperties.flySpeed.direction
        )
        camera.position.y = cameraProperties.position.y
    }

}

function setControlOnKeyDown(event: KeyboardEvent) {
    const key = event.key.toLowerCase();

    addKeyToQueue(key)
    chooseKey()

    addFlyingKeyToQueue(event)
}

function setControlOnKeyUp(event: KeyboardEvent) {
    const key = event.key.toLowerCase();
    deleteKeyFromQueue(key)
    chooseKey()

    deleteFliyingKeyFromQueue(event)
}

export default function setFirstPersonPosition(canvasState: CanvasState) {
    animations.push(updateFirstPersonPosition)
    
    const controls = ['w', 's', 'd', 'a', 'r', 'f']

    controls.forEach(onKey)

    canvasState.canvas.addEventListener('keydown', setControlOnKeyDown)
    canvasState.canvas.addEventListener('keyup', setControlOnKeyUp)
}