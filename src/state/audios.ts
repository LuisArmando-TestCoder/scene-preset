import { AudioProperties } from "../types/utils.js"

export class AudiosState {
  audios: HTMLMediaElement[] = []
  audioPropertiesGroup: AudioProperties[] = []
}

const audiosState: AudiosState = new AudiosState()

export default audiosState
