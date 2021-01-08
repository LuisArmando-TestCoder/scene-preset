export class AudioProperties {
    audioContext: AudioContext
    analyser: AnalyserNode
    source: MediaElementAudioSourceNode
    frequencies: Uint8Array
    amplitudes: Uint8Array
    averageFrequecy: number
    averageAmplitude: number
    initialized: boolean = false
}


export class AudiosState {
    audios: HTMLMediaElement[] = []
    audioPropertiesGroup: AudioProperties[] = []
}

const audiosState: AudiosState = new AudiosState()

export default audiosState