import animations from '../state/animations'

import keysState from '../state/keys'
import {
    KeyLifeCycleObject,
} from '../state/keys'
import {
    KeyHandler,
    KeyLifeCycle,
    Triggerer,
} from '../utils'

function handleKeyboardActions() {
    if (!keysState.keys) {
        const triggerer = new Triggerer()
        const keyHandler = new KeyHandler(triggerer)

        keyHandler.listenActions()
        animations.push(triggerer.triggerPresentCallbacks.bind(triggerer))

        // initialize keys
        keysState.keys = {}
    }
}

export default function onKey(keyName: string) {
    const key = keyName.toLowerCase()

    handleKeyboardActions()

    keysState.keys[key] = keysState.keys[key] || new KeyLifeCycleObject()

    return new KeyLifeCycle(key)
}
