import * as THREE from "three"

import componentNames from "./componentNames.js"

export type CanvasStateCallback = (canvasState: CanvasState) => void

export type ControlsBlacklist = (
  | "setFirstPersonZoom"
  | "setFirstPersonPosition"
  | "setFirstPersonFlying"
  | "setFirstPersonDirection"
  | "setCanvasAutoFocus"
)[]

export class KeyController {
  keyAxes: {
    KeyWKeyS: string[]
    KeyAKeyD: string[]
  } = {
    KeyWKeyS: [],
    KeyAKeyD: [],
  }
  chosenKey = ""
  flyingKeys: string[] = []
}

export const keyController = new KeyController()

export class CameraVectorsState {
  position = {
    x: 0,
    z: 0,
    y: 2,
    min: {
      y: 2,
    },
  }
  flySpeed = {
    force: 0.005,
    direction: 0,
    friction: 0.0025,
    acceleration: 0,
    max: {
      acceleration: 0.1,
    },
  }
  acceleration = {
    x: 0,
    z: 0,
  }
  friction = {
    x: 0.005,
    z: 0.005,
  }
  rotation = 0
  chosenAxis = "z"
  top = {
    acceleration: {
      x: 0.05,
      z: 0.05,
    },
  }
}

export const cameraVectorsState = new CameraVectorsState()

export class PresetConfiguration {
  controlsBlacklist: ControlsBlacklist = []
  componentNames = componentNames
  ambient = {
    color: 0xffffff,
    alpha: 1,
  }
  renderer = {
    antialias: true,
    preserveDrawingBuffer: true,
    shadowMapEnabled: true,
    shadowMapType: THREE.PCFSoftShadowMap,
    outputEncoding: THREE.sRGBEncoding,
    XREnabled: true,
  }
  camera = {
    cameraVectorsState,
    fov: 32,
    near: 0.1,
    far: 2000,
    zoom: {
      max: 100,
      min: 10,
    },
  }
  near = 5
  far = 1000
}

export interface PresetSceneCallbacks {
  setup?: CanvasStateCallback
  animate?: CanvasStateCallback
}

export interface IntersectionUtils {
  matrices: {
    callbacks: Function[][]
    objects: THREE.Object3D[][]
  }
  raycaster: THREE.Raycaster
}

export class CanvasState {
  intersectionUtils?: IntersectionUtils

  initialized: boolean = false
  sceneAnimations: CanvasStateCallback[] = []
  canvasSelector?: string
  canvas?: HTMLCanvasElement
  VRToggler?: HTMLElement

  renderer?: THREE.WebGLRenderer
  camera?: THREE.PerspectiveCamera
  scene?: THREE.Scene

  presetConfiguration = new PresetConfiguration()
}

export type CanvasesState = CanvasState[]

const canvasesState: CanvasesState = []

export default canvasesState
