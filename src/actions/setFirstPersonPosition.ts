import { mouseController } from "./setFirstPersonDirection.js"
import { CanvasState } from "../types/state"
import { onKey } from "../events/index.js"
import { cameraVectorsState, keyController } from "../state/canvases.js"
import animations from "../state/animations.js"

export type Axes = "KeyWKeyS" | "KeyAKeyD"
export type Axis = "x" | "z"
export type FlyKeys = "KeyR" | "KeyF"
export type Keyboard =
  | "KeyWKeyA"
  | "KeyWKeyD"
  | "KeySKeyA"
  | "KeySKeyD"
  | "KeyW"
  | "KeyA"
  | "KeyS"
  | "KeyD"

const auxiliaryCameraDirection = { x: Math.PI, y: Math.PI }

const frictionResistance = 2

const move = {
  right_forward() {
    cameraVectorsState.rotation = degreesToRadians(-90)
    cameraVectorsState.chosenAxis = "z"
  },
  left_forward() {
    cameraVectorsState.rotation = degreesToRadians(90)
    cameraVectorsState.chosenAxis = "z"
  },
  right_backward() {
    cameraVectorsState.rotation = degreesToRadians(-270)
    cameraVectorsState.chosenAxis = "x"
  },
  left_backward() {
    cameraVectorsState.rotation = degreesToRadians(270)
    cameraVectorsState.chosenAxis = "x"
  },
  forward() {
    cameraVectorsState.rotation = 0
    cameraVectorsState.chosenAxis = "z"
  },
  backward() {
    cameraVectorsState.rotation = degreesToRadians(360)
    cameraVectorsState.chosenAxis = "z"
  },
  right() {
    cameraVectorsState.rotation = degreesToRadians(-180)
    cameraVectorsState.chosenAxis = "x"
  },
  left() {
    cameraVectorsState.rotation = degreesToRadians(180)
    cameraVectorsState.chosenAxis = "x"
  },
  up() {
    cameraVectorsState.flySpeed.direction = -1
  },
  down() {
    cameraVectorsState.flySpeed.direction = 1
  },
}

const flyingKeys = {
  KeyR: move.up,
  KeyF: move.down,
}

const movementKeys = {
  KeyWKeyA: move.left_forward,
  KeyWKeyD: move.right_forward,
  KeySKeyA: move.left_backward,
  KeySKeyD: move.right_backward,

  KeyW: move.forward,
  KeyA: move.left,
  KeyS: move.backward,
  KeyD: move.right,
}

const validAxes = ["x", "z"]

function degreesToRadians(degrees: number): number {
  const normalizedDegrees = degrees / 360
  return normalizedDegrees * Math.PI
}

function reduceFirstPersonPositionAcceleration() {
  const key = "acceleration"
  const obj = cameraVectorsState
  validAxes.forEach(axis => {
    const surpassingFriction =
      Math.abs(obj[key][axis as Axis]) > obj.friction[axis as Axis] / 2
    if (surpassingFriction) {
      obj[key][axis as Axis] +=
        -Math.sign(obj[key][axis as Axis]) *
        (obj.friction[axis as Axis] / frictionResistance)
    } else {
      obj[key][axis as Axis] = 0
    }
  })
}

function topFirstPersonPositionAcceleration() {
  validAxes.forEach(axis => {
    if (
      cameraVectorsState.acceleration[axis as Axis] >
      cameraVectorsState.top.acceleration[axis as Axis]
    ) {
      cameraVectorsState.acceleration[axis as Axis] =
        cameraVectorsState.top.acceleration[axis as Axis]
    }
    if (
      cameraVectorsState.acceleration[axis as Axis] <
      -cameraVectorsState.top.acceleration[axis as Axis]
    ) {
      cameraVectorsState.acceleration[axis as Axis] = -cameraVectorsState.top
        .acceleration[axis as Axis]
    }
  })
}

function setMoveOnKeyDown() {
  if (movementKeys[keyController.chosenKey as Keyboard]) {
    movementKeys[keyController.chosenKey as Keyboard]()

    const { acceleration, friction, chosenAxis } = cameraVectorsState

    acceleration[chosenAxis as Axis] +=
      friction[chosenAxis as Axis] * frictionResistance
  }
}

function chooseKey() {
  keyController.chosenKey = ""

  if (keyController.keyAxes.KeyWKeyS.length) {
    keyController.chosenKey =
      keyController.keyAxes.KeyWKeyS[keyController.keyAxes.KeyWKeyS.length - 1]
  }

  if (keyController.keyAxes.KeyAKeyD.length) {
    keyController.chosenKey +=
      keyController.keyAxes.KeyAKeyD[keyController.keyAxes.KeyAKeyD.length - 1]
  }
}

function addKeyToQueue(key: string) {
  for (const keyAxis in keyController.keyAxes) {
    const keyAxisQueue = keyController.keyAxes[keyAxis as Axes]
    if (keyAxis.includes(key) && !keyAxisQueue.includes(key)) {
      keyAxisQueue.push(key)
      break
    }
  }
}

function deleteKeyFromQueue(key: string) {
  for (const keyAxis in keyController.keyAxes) {
    const keyAxisQueue = keyController.keyAxes[keyAxis as Axes]
    const isValidKey = keyAxis.includes(key) && keyAxisQueue.includes(key)

    if (isValidKey) {
      keyAxisQueue.splice(keyAxisQueue.indexOf(key), 1)
    }
  }
}

function triggerFlyCode() {
  if (keyController.flyingKeys.length) {
    // fly force increase
    cameraVectorsState.flySpeed.acceleration = Math.min(
      cameraVectorsState.flySpeed.max.acceleration,
      cameraVectorsState.flySpeed.acceleration +
        cameraVectorsState.flySpeed.force
    )

    flyingKeys[
      keyController.flyingKeys[keyController.flyingKeys.length - 1] as FlyKeys
    ]()
  }
}

function deleteFlyingKeyFromQueue(code: string) {
  const isKeyAlreadyInQueue = keyController.flyingKeys.includes(code)

  if (isKeyAlreadyInQueue) {
    keyController.flyingKeys.splice(keyController.flyingKeys.indexOf(code), 1)
  }
}

function addFlyingKeyToQueue(event: KeyboardEvent) {
  const validFlyingCode = flyingKeys[event.code as FlyKeys] as
    | (() => void)
    | undefined

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
  const direction = cameraDirection || auxiliaryCameraDirection

  const { camera } = canvasState
  const { acceleration, chosenAxis, rotation } = cameraVectorsState

  if (camera) {
    camera.position.x +=
      acceleration[chosenAxis as Axis] * Math.sin(direction.x + rotation)
    camera.position.z +=
      acceleration[chosenAxis as Axis] * Math.cos(direction.x + rotation)

    const { controlsBlacklist } = canvasState.presetConfiguration

    if (!controlsBlacklist.includes("setFirstPersonFlying")) {
      cameraVectorsState.flySpeed.acceleration = Math.max(
        0,
        cameraVectorsState.flySpeed.acceleration -
          cameraVectorsState.flySpeed.friction
      )

      cameraVectorsState.position.y = Math.max(
        cameraVectorsState.position.min.y,
        cameraVectorsState.position.y -
          cameraVectorsState.flySpeed.acceleration *
            cameraVectorsState.flySpeed.direction
      )
      camera.position.y =
        cameraVectorsState.flySpeed.acceleration === 0
          ? camera.position.y
          : cameraVectorsState.position.y
    }
  }
}

function setControlOnKeyDown(event: KeyboardEvent) {
  addKeyToQueue(event.code)
  chooseKey()
  addFlyingKeyToQueue(event)
}

function setControlOnKeyUp(code: string) {
  deleteKeyFromQueue(code)
  chooseKey()
  deleteFlyingKeyFromQueue(code)
}

function resetLocalQueues() {
  for (const keyAxis in keyController.keyAxes) {
    const keyAxisQueue = keyController.keyAxes[keyAxis as Axes]

    keyAxisQueue.splice(0)
  }

  keyController.flyingKeys.splice(0)
}

export default function setFirstPersonPosition(canvasState: CanvasState) {
  animations.push(updateFirstPersonPosition)

  const controls = ["KeyW", "KeyS", "KeyD", "KeyA", "KeyR", "KeyF"]

  controls.forEach(onKey)

  const { controlsBlacklist } = canvasState.presetConfiguration
  const getIsPassingBlacklist = () =>
    !controlsBlacklist.includes("setFirstPersonPosition")

  if (canvasState && canvasState.canvas) {
  canvasState.canvas.addEventListener("keydown", (event: KeyboardEvent) => {
      getIsPassingBlacklist() && setControlOnKeyDown(event)
    })
  }
  window.addEventListener("keyup", (event: KeyboardEvent) => {
    setControlOnKeyUp(event.code)
  })
  document.addEventListener("visibilitychange", (event: Event) => {
    if (document.hidden) resetLocalQueues()
  })
}
