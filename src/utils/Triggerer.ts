import keysState from "../state/keys.js"
import { KeyLifeCycleName } from "../types/state"

export default class Triggerer {
  triggerCallbacks(keyLifeCycleName: KeyLifeCycleName, key: string) {
    if (keysState && keysState.keys) {
      const lifeCycle = keysState.keys[key]

      if (lifeCycle) {
        const callbacks = lifeCycle[keyLifeCycleName]

        callbacks.forEach((callback: Function) => {
          callback(keysState.events[key])
        })
      }
    }
  }

  triggerQueue(keyLifeCycleName: KeyLifeCycleName, chosenKey = "") {
    if (chosenKey) {
      this.triggerCallbacks(keyLifeCycleName, chosenKey)

      return
    }

    for (const key of keysState.queue) {
      this.triggerCallbacks(keyLifeCycleName, key)
    }
  }

  triggerPresentCallbacks() {
    this.triggerQueue("present") // ALL KEYS IN QUEUE
  }
}
