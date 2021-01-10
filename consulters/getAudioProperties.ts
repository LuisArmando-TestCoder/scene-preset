import animations from '../state/animations'
import audiosState from '../state/audios'
import { AudioProperties } from '../types/utils'

const {
    audios,
    audioPropertiesGroup,
} = audiosState

function getAudioArray(analyser) {
    const defaultFrequencyBinCount = 1024

    return new Uint8Array(analyser ? analyser.frequencyBinCount : defaultFrequencyBinCount)
}

function getAverage(array: Uint8Array): number {
    return array.reduce((a, b) => a + b) / array.length
}

function getFrequencies(analyser: AnalyserNode): Uint8Array {
    const audioArray = getAudioArray(analyser)

    if (analyser) analyser.getByteFrequencyData(audioArray)

    return audioArray
}

function getAmplitudes(analyser: AnalyserNode): Uint8Array {
    const audioArray = getAudioArray(analyser)

    if (analyser) analyser.getByteTimeDomainData(audioArray)

    return audioArray
}

function setNewAudioStateItems(audio: HTMLMediaElement) {
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaElementSource(audio)
    const audioProperties = audioPropertiesGroup[audioPropertiesGroup.length - 1]

    audioProperties.audioContext = audioContext
    audioProperties.analyser = analyser
    audioProperties.source = source
    audioProperties.initialized = true

    source.connect(analyser)
    analyser.connect(audioContext.destination)
}

function setProcessedAudioProperties(audio: HTMLMediaElement, audioIndex: number) {
    const audioProperties = audioPropertiesGroup[audioIndex]
    const { analyser } = audioProperties
    const frequencies = getFrequencies(analyser)
    const amplitudes = getAmplitudes(analyser)

    audioProperties.frequencies = frequencies
    audioProperties.amplitudes = amplitudes
    audioProperties.averageFrequecy = getAverage(frequencies)
    audioProperties.averageAmplitude = getAverage(amplitudes)
}

function listenAudioPropertiesIntialization(audio: HTMLMediaElement) {
    audio.addEventListener('play', () => {
        const isAudioInitialized = audioPropertiesGroup[audios.indexOf(audio)].initialized

        if (!isAudioInitialized) setNewAudioStateItems(audio)
    })
}

export default function getAudioProperties(audio: HTMLMediaElement): AudioProperties {
    if (!audios.includes(audio)) {
        audios.push(audio)
        audioPropertiesGroup.push(new AudioProperties())
        animations.push(() => setProcessedAudioProperties(audio, audios.indexOf(audio)))

        listenAudioPropertiesIntialization(audio)
    }

    return audioPropertiesGroup[audios.indexOf(audio)]
}