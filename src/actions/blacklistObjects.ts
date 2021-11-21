export interface BlacklistParameters {
  scene: THREE.Scene
  blacklist: string[]
  objects?: THREE.Object3D[]
}

export default function blacklistObjects(
  blacklistParameters: BlacklistParameters
) {
  ;(blacklistParameters.objects || blacklistParameters.scene.children).forEach(
    object => {
      blacklistParameters.blacklist.forEach(name => {
        if (object.name === name) {
          const chosenParent = object.parent || blacklistParameters.scene

          chosenParent.remove(object)
        } else if (object.children.length) {
          blacklistObjects({
            ...blacklistParameters,
            objects: object.children,
          })
        }
      })
    }
  )
}
