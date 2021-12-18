// ts-ignore
/* eslint-disable */
import * as THREE from "three"
/* eslint-enable */

import { CanvasState } from "../types/state"

export type SceneExport = {
  object3D: THREE.Object3D
  exported?: any
  [index: string]: any
}
export type SceneExportForScene = {
  object3D: THREE.Object3D | Promise<THREE.Object3D>[] | THREE.Object3D[]
  [index: string]: any
}
export type ExportedScene = {
  [index: string]: SceneExport
}
export type Scene = {
  properties?: {
    position?: THREE.Vector3
    rotation?: THREE.Vector3
    scale?: THREE.Vector3
  }
  object?: () =>
    | Promise<THREE.Object3D>
    | THREE.Object3D
    | Promise<THREE.Object3D>[]
    | THREE.Object3D[]
    | Promise<SceneExport>
    | SceneExport
    | SceneExportForScene
  onAnimation?: (exportedScene: ExportedScene, canvasState: CanvasState) => {}
  onSetup?: (exportedScene: ExportedScene, canvasState: CanvasState) => {}
}
export type Scenes = {
  [index: string]: Scene
}

async function getArrayGroup(
  objects: (THREE.Object3D | Promise<THREE.Object3D>)[],
  key: string
): Promise<THREE.Group> {
  const group = new THREE.Group()

  for (const [index, innerObject] of Object.entries(objects)) {
    let child: THREE.Object3D = innerObject as THREE.Object3D

    if (typeof (innerObject as Promise<THREE.Object3D>)?.then === "function") {
      try {
        child = await innerObject
      } catch {
        throw new Error(`Error on object ${key}, on child with index ${index}`)
      }
    }

    if (child instanceof THREE.Object3D) {
      group.add(child)
    }
  }

  return group
}

function assignObjectVectors(object3D: THREE.Object3D, scene: Scene) {
  ;(["position", "scale", "rotation"] as const).forEach(property => {
    const defaultValue = property === "scale" ? 1 : 0
    const getAxis = (axisName: "x" | "y" | "z") =>
      (scene.properties?.[property]?.[axisName] as number) || defaultValue

    object3D[property].set(getAxis("x"), getAxis("y"), getAxis("z"))
  })
}

async function getDefinitePromise(value: Promise<any> | any): Promise<any> {
  try {
    return typeof value?.then === "function" ? await value : value
  } catch {
    throw new Error(`Error on definite promise ${value}`)
  }
}

async function exportSceneExport({
  sceneExport,
  exportedScene,
  key,
}: {
  sceneExport: SceneExport
  exportedScene: ExportedScene
  key: string
}) {
  if (sceneExport.object3D) {
    exportedScene[key] = {
      ...sceneExport,
    }

    if (Array.isArray(sceneExport.object3D)) {
      exportedScene[key] = {
        ...sceneExport,
        object3D: await getArrayGroup(sceneExport.object3D, key),
      }
    }
  }
}

async function exportObject3D({
  object3D,
  exportedScene,
  key,
}: {
  object3D: THREE.Object3D | THREE.Object3D[] | Promise<THREE.Object3D>[]
  exportedScene: ExportedScene
  key: string
}) {
  if (object3D instanceof THREE.Object3D) {
    exportedScene[key] = {
      object3D: object3D,
    }
  }

  if (Array.isArray(object3D)) {
    exportedScene[key] = {
      object3D: await getArrayGroup(object3D, key),
    }
  }
}

async function exportScene({
  exportable,
  exportedScene,
  key,
}: {
  exportable:
    | THREE.Object3D
    | THREE.Object3D[]
    | Promise<THREE.Object3D>[]
    | SceneExport
  exportedScene: ExportedScene
  key: string
}) {
  await exportSceneExport({
    sceneExport: exportable as SceneExport,
    exportedScene,
    key,
  })

  await exportObject3D({
    object3D: exportable as THREE.Object3D,
    exportedScene,
    key,
  })
}

export default async (scenes: Scenes) => {
  const exportedScene: ExportedScene = {}
  const sceneGroup = new THREE.Group()
  const objectRequests = Object.keys(scenes).map(async (key: string) => {
    const scene: Scene = scenes[key]
    let retrievedObject

    try {
      retrievedObject = scene?.object?.()
    } catch {
      throw new Error(`Error on object function ${key}`)
    }

    const promisedObject = (await getDefinitePromise(retrievedObject)) as
      | THREE.Object3D
      | SceneExport

    await exportScene({
      exportable: promisedObject,
      exportedScene,
      key,
    })

    assignObjectVectors(exportedScene[key].object3D, scene)

    exportedScene[key].object3D.name = key

    return exportedScene[key]
  })

  Object.values(await Promise.all(objectRequests.filter(x => x))).forEach(
    sceneExport => {
      sceneExport && sceneGroup.add(sceneExport.object3D)
    }
  )

  let exportedState: { [index: string]: any } = {}

  const executeObjectsEvents = (
    canvasState: CanvasState,
    callType: "onSetup" | "onAnimation"
  ): { [index: string]: any } | void => {
    Object.keys(scenes).forEach((key: string) => {
      const exported = scenes[key][callType]?.(
        callType === "onAnimation" && exportedState[key]
          ? { ...exportedScene[key], exported: exportedState[key] }
          : exportedScene[key],
        canvasState
      )

      if (callType === "onSetup" && exported) {
        exportedState[key] = exported
      }
    })
  }

  return {
    sceneGroup,
    onSetup(canvasState: CanvasState) {
      canvasState?.scene?.add(sceneGroup)

      executeObjectsEvents(canvasState, "onSetup")
    },
    onAnimation(canvasState: CanvasState) {
      executeObjectsEvents(canvasState, "onAnimation")
    },
  }
}
