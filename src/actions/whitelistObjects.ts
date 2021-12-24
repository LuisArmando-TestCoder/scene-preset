import * as THREE from "three"

export interface WhitelistParameters {
  scene: THREE.Scene
  whitelist: string[]
  objects?: THREE.Object3D[]
}

export default function whitelistObjects(
  whitelistParameters: WhitelistParameters
) {
  ;(whitelistParameters.objects || whitelistParameters.scene.children).forEach(
    (object: THREE.Object3D) => {
      if (!whitelistParameters.whitelist.includes(object.name)) {
        let hasSonInWhitelist = false

        for (const name of whitelistParameters.whitelist) {
          if (object.getObjectByName(name)) {
            hasSonInWhitelist = true

            break
          }
        }

        if (!hasSonInWhitelist) {
          const chosenParent = object.parent || whitelistParameters.scene

          chosenParent.remove(object)
          return
        }

        whitelistObjects({
          ...whitelistParameters,
          objects: object.children,
        })
      }
    }
  )
}
