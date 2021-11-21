export type KeyLifeCycleName = "start" | "present" | "end"

export class KeyLifeCycleObject {
  start: Function[] = [] // executes callbacks once if combination was not present in queue
  present: Function[] = [] // executes callbacks on animation while combination is present in queue
  end: Function[] = [] // executes callbacks when eky combinations goes out of queue
}

export type Keys = { [index: string]: KeyLifeCycleObject }

export type Events = { [index: string]: KeyboardEvent }

export class KeysState {
  keys?: Keys
  queue: string[] = []
  events: Events = {}
  watchers: Function[] = []
}

const keysState = new KeysState()

export default keysState
