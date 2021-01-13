import keysState from '../state/keys'
import {
    Triggerer,
} from '../types/utils'

export default class KeyHandler {
    triggerer: Triggerer
    keyEventNames = ['keydown', 'keyup'] as const

    constructor(triggerer: Triggerer) {
        this.triggerer = triggerer
    }

    visibilitychange(event: Event) {
        if (document.hidden) {
            for (const key of keysState.queue) {
                this.triggerer.triggerQueue('end', key)
            }
    
            keysState.queue.splice(0)
        }
    }

    keydown(key: string) {
        // adding key to queue
        if (!keysState.queue.includes(key)) {
            keysState.queue.push(key)

            // executes start just once
            this.triggerer.triggerQueue('start', key)
        }
    }

    keyup(key: string) {
        this.triggerer.triggerQueue('end', key)

        // deleting key from queue
        keysState.queue.splice(keysState.queue.indexOf(key), 1)
    }

    listenActions() {
        this.keyEventNames.forEach(keyEventName => {
            window.addEventListener(
                keyEventName,
                (event: KeyboardEvent) => {
                    const key = event.key.toLowerCase()

                    keysState.events[key] = event
                    this[keyEventName](key)
                }
            )

            window.addEventListener('visibilitychange', this.visibilitychange.bind(this)) 
        })
    }
}
