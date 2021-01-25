import * as THREE from 'three'

import { addDefaultObjects } from '../utils'
import { startControls } from '../actions'
import { getCanvasState } from '../consulters'
import {
    PresetSceneCallbacks,
    CanvasStateCallback,
} from '../types/state'
import {
    animations,
    canvasesState,
    animationsState,
    sceneSetupIntrudes,
} from '../state'
import {
    CanvasState,
} from '../state/canvases'

function intrudeSceneSetup(canvasState: CanvasState) {
    Object.keys(sceneSetupIntrudes).forEach(canvasSelector => {
        const currentCanvasState = getCanvasState(canvasSelector)

        if (currentCanvasState === canvasState) {
            sceneSetupIntrudes[canvasSelector].forEach(intrude => {
                intrude(canvasState)
            })
        }
    })

}

function setAnimationFrame(canvasState: CanvasState, animations: CanvasStateCallback[]) {
    animations.forEach((animation: CanvasStateCallback) => {
        animation(canvasState)
    })
    canvasState.renderer.render(canvasState.scene, canvasState.camera)
    canvasState.renderer.setAnimationLoop(() => {
        setAnimationFrame(canvasState, animations)
    })
}

function getAspectRatio(canvas) {
    return canvas.clientWidth / canvas.clientHeight
}

function handleCanvasSize(canvasState: CanvasState) {
    const parent = canvasState.canvas.parentElement

    setCanvasToElementSize(canvasState, parent)

    const ResizeObserver = window['ResizeObserver']

    if (ResizeObserver) {
        new ResizeObserver(() => {
            setCanvasToElementSize(canvasState, parent)
        }).observe(parent)

        return
    }

    window.addEventListener('resize', () => {
        setCanvasToElementSize(canvasState, parent)
    })
}

function setCanvasToElementSize(canvasState: CanvasState, element: HTMLElement) {
    const {
        canvas,
        camera,
        renderer,
    } = canvasState

    canvas.width = element.clientWidth
    canvas.height = element.clientHeight
    camera['aspect'] = window.innerWidth / window.innerHeight

    camera['updateProjectionMatrix']()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

class SceneSetup {
    canvasState: CanvasState

    constructor(canvasState: CanvasState) {
        this.canvasState = canvasState
    }

    setCamera() {
        this.canvasState.camera.lookAt(new THREE.Vector3())
    }

    setRenderer() {
        const { renderer: configurationRenderer } = this.canvasState.presetConfiguration

        this.canvasState.renderer['shadowMap'].enabled = configurationRenderer.shadowMapEnabled
        this.canvasState.renderer['shadowMap'].type = configurationRenderer.shadowMapType
        this.canvasState.renderer['outputEncoding'] = configurationRenderer.outputEncoding
        this.canvasState.renderer['xr'].enabled = configurationRenderer.XREnabled

        this.canvasState.renderer['xr'].setReferenceSpaceType('local')
        this.canvasState.renderer['setClearColor'](
            this.canvasState.presetConfiguration.ambient.color,
            this.canvasState.presetConfiguration.ambient.alpha
        )
    }

    setScene() {
        this.canvasState.scene.fog = new THREE.Fog(
            this.canvasState.presetConfiguration.ambient.color,
            this.canvasState.presetConfiguration.near,
            this.canvasState.presetConfiguration.far,
        )
        this.canvasState.scene.name = this.canvasState.canvasSelector
    }

    setCanvas() {
        this.canvasState.canvas.focus()
    }

    setSceneCallbacks(presetSceneCallbacks: PresetSceneCallbacks) {
        if (!this.canvasState.initialized) {
            setAnimationFrame(this.canvasState, this.canvasState.sceneAnimations)

            this.canvasState.initialized = true
        }

        if (presetSceneCallbacks.setup) {
            presetSceneCallbacks.setup(this.canvasState)
        }

        if (presetSceneCallbacks.animate) {
            animations.push(presetSceneCallbacks.animate)
        }
    }
}

export default function presetScene(presetSceneCallbacks: PresetSceneCallbacks, canvasSelector = 'canvas') {
    const canvasState = getCanvasState(canvasSelector)

    if (!canvasState) {
        const canvasState = new CanvasState()

        canvasesState.push(canvasState)

        const canvas: HTMLCanvasElement = document.querySelector(canvasSelector)
        const camera = new THREE.PerspectiveCamera(
            canvasState.presetConfiguration.camera.fov,
            getAspectRatio(canvas),
            canvasState.presetConfiguration.camera.near,
            canvasState.presetConfiguration.camera.far
        )
        const scene = new THREE.Scene()
        const renderer = new THREE.WebGLRenderer({
            canvas,
            ...canvasState.presetConfiguration.renderer,
        })
    
        canvasState.canvasSelector = canvasSelector
        canvasState.canvas = canvas
        canvasState.renderer = renderer
        canvasState.scene = scene
        canvasState.camera = camera

        intrudeSceneSetup(canvasState)

        const sceneSetup = new SceneSetup(canvasState)

        sceneSetup.setScene()
        sceneSetup.setRenderer()
        sceneSetup.setCamera()
        sceneSetup.setCanvas()
        sceneSetup.setSceneCallbacks(presetSceneCallbacks)

        addDefaultObjects(canvasState)
        startControls(canvasState)
        handleCanvasSize(canvasState)
        initializeGlobalAnimations(canvasState)

        return
    }

    const sceneSetup = new SceneSetup(getCanvasState(canvasSelector))

    sceneSetup.setSceneCallbacks(presetSceneCallbacks)
}

function initializeGlobalAnimations(canvasState: CanvasState) {
    if (!animationsState.initialized) {
        setAnimationFrame(canvasState, animations)

        animationsState.initialized = true
    }
}