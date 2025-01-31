import * as THREE from "three"

import { addDefaultObjects } from "../utils/index.js"
import { startControls } from "../actions/index.js"
import { getCanvasState } from "../consulters/index.js"
import { PresetSceneCallbacks, CanvasStateCallback } from "../types/state"
import {
  animations,
  canvasesState,
  animationsState,
  sceneSetupIntrudes,
} from "../state/index.js"
import { CanvasState } from "../state/canvases.js"

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

function setAnimationFrame(
  canvasState: CanvasState,
  animations: CanvasStateCallback[]
) {
  animations.forEach((animation: CanvasStateCallback) => {
    animation(canvasState)
  })

  if (canvasState && canvasState.renderer && canvasState.scene && canvasState.camera) {
    canvasState.renderer.render(canvasState.scene, canvasState.camera)
    canvasState.renderer.setAnimationLoop(() => {
      setAnimationFrame(canvasState, animations)
    })
  }
}

function getAspectRatio(canvas: HTMLCanvasElement) {
  return canvas.clientWidth / canvas.clientHeight
}

function handleCanvasSize(canvasState: CanvasState) {
  const parent = canvasState && canvasState.canvas && canvasState.canvas.parentElement

  if (parent) {
    setCanvasToElementSize(canvasState, parent)

    const ResizeObserver = window["ResizeObserver"]

    if (ResizeObserver) {
      new ResizeObserver(() => {
        setCanvasToElementSize(canvasState, parent)
      }).observe(parent)

      return
    }

    window.addEventListener("resize", () => {
      setCanvasToElementSize(canvasState, parent)
    })
  }
}

function setCanvasToElementSize(
  canvasState: CanvasState,
  element: HTMLElement
) {
  const { canvas, camera, renderer } = canvasState

  if (camera && canvas && renderer) {
    canvas.width = element.clientWidth
    canvas.height = element.clientHeight
    camera.aspect = canvas.width / canvas.height

    camera.updateProjectionMatrix()
    renderer.setSize(canvas.width, canvas.height)
  }
}

class SceneSetup {
  canvasState: CanvasState

  constructor(canvasState: CanvasState) {
    this.canvasState = canvasState
  }

  setCamera() {
    if (this.canvasState && this.canvasState.camera) {
      this.canvasState.camera.lookAt(new THREE.Vector3())

      this.canvasState.camera.position.y = this.canvasState.presetConfiguration.camera.cameraVectorsState.position.y
    }
  }

  setRenderer() {
    const {
      renderer: configurationRenderer,
    } = this.canvasState.presetConfiguration

    if (this.canvasState && this.canvasState.renderer) {
      this.canvasState.renderer.shadowMap.enabled =
        configurationRenderer.shadowMapEnabled
      this.canvasState.renderer.shadowMap.type =
        configurationRenderer.shadowMapType

      const renderer = (this.canvasState.renderer as any) as {
        outputEncoding: THREE.TextureEncoding
        xr: {
          enabled: boolean
          setReferenceSpaceType(arg: string): void
        }
      }

      renderer["outputEncoding"] = configurationRenderer.outputEncoding

      if (renderer.xr) {
        renderer["xr"].enabled = configurationRenderer.XREnabled

        renderer["xr"] && renderer["xr"].setReferenceSpaceType && renderer["xr"].setReferenceSpaceType("local")
      }
      this.canvasState.renderer.setClearColor(
        this.canvasState.presetConfiguration.ambient.color,
        this.canvasState.presetConfiguration.ambient.alpha
      )
    }
  }

  setScene() {
    if (this.canvasState && this.canvasState.scene) {
      this.canvasState.scene.fog = new THREE.Fog(
        this.canvasState.presetConfiguration.ambient.color,
        this.canvasState.presetConfiguration.near,
        this.canvasState.presetConfiguration.far
      )
      this.canvasState.scene.name = this.canvasState.canvasSelector || "canvas"
    }
  }

  setCanvas() {
    if (this.canvasState && this.canvasState.canvas) {
      this.canvasState.canvas.focus()
    }
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

export default function presetScene(
  presetSceneCallbacks: PresetSceneCallbacks,
  canvasSelector = "canvas"
) {
  const canvasState = getCanvasState(canvasSelector)

  if (!canvasState) {
    const canvasState = new CanvasState()

    canvasesState.push(canvasState)

    const canvas: HTMLCanvasElement | null = document.querySelector(
      canvasSelector
    )
    const camera = new THREE.PerspectiveCamera(
      canvasState.presetConfiguration.camera.fov,
      getAspectRatio(canvas as HTMLCanvasElement),
      canvasState.presetConfiguration.camera.near,
      canvasState.presetConfiguration.camera.far
    )
    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: canvas as HTMLCanvasElement,
      ...canvasState.presetConfiguration.renderer,
    })

    canvasState.canvasSelector = canvasSelector
    canvasState.canvas = canvas as HTMLCanvasElement
    // canvasState.canvas.tabIndex = 0
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

  const sceneSetup = new SceneSetup(
    getCanvasState(canvasSelector) as CanvasState
  )

  sceneSetup.setSceneCallbacks(presetSceneCallbacks)
}

function initializeGlobalAnimations(canvasState: CanvasState) {
  if (!animationsState.initialized) {
    setAnimationFrame(canvasState, animations)

    animationsState.initialized = true
  }
}
