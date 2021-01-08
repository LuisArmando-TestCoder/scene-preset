import * as THREE from 'three'

import componentNames from './componentNames'

export type CanvasStateCallback = (canvasState: CanvasState) => void

export class PresetConfiguration {
    controlsBlacklist: string[] = []
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
        fov: 32,
        near: 0.1,
        far: 2000,
        zoom: {
            max: 100,
            min: 10,
        }
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
    intersectionUtils: IntersectionUtils
    
    initialized: boolean = false
    sceneAnimations: CanvasStateCallback[] = []
    canvasSelector: string
    canvas: HTMLCanvasElement
    VRToggler: HTMLElement

    renderer: THREE.WebGLRenderer
    camera: THREE.Camera
    scene: THREE.Scene

    presetConfiguration = new PresetConfiguration()
}

export type CanvasesState = CanvasState[]

const canvasesState: CanvasesState = []

export default canvasesState