import { keysState, animations } from '../state'

const getKeysLength = () => keysState.keys ? Object.keys(keysState.keys).length : 0

let keysAmount = getKeysLength()

export default function onNewKey(callback: Function) {
    if (!keysState.watchers.includes(callback)) {
        keysState.watchers.push(callback)
    }

    if (keysState.watchers.length) {
        animations.push(() => {
            if (getKeysLength() > keysAmount) {
                keysAmount = getKeysLength()

                callback(keysState.keys)
            }
        })
    }
}