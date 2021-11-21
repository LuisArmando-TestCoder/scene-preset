export default class AudioProperties {
  audioContext?: AudioContext
  analyser?: AnalyserNode
  source?: MediaElementAudioSourceNode
  frequencies?: Uint8Array
  amplitudes?: Uint8Array
  averageFrequency?: number
  averageAmplitude?: number
  initialized: boolean = false
}
