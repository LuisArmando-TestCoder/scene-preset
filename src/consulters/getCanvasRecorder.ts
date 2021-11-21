export default function getCanvasRecorder(
  canvas: HTMLCanvasElement
): MediaRecorder {
  const stream = (canvas as any).captureStream()
  const mediaRecorder = new MediaRecorder(stream)

  return mediaRecorder
}
