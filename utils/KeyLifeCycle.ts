import keysState from '../state/keys'
import {
    KeyLifeCycleObject,
} from '../types/state'

export default class KeyLifeCycle {
    keyLifeCycleObject: KeyLifeCycleObject

    constructor(key: string) {
        this.keyLifeCycleObject = keysState.keys[key]
    }

    start(callback: Function) {
        this.keyLifeCycleObject.start.push(callback)

        return this
    }

    present(callback: Function) {
        this.keyLifeCycleObject.present.push(callback)

        return this
    }

    end(callback: Function) {
        this.keyLifeCycleObject.end.push(callback)

        return this
    }
}