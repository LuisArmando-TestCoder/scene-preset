export default function downloadCanvasRecordingOnStop(
  mediaRecorder: MediaRecorder
) {
  const chunks: BlobPart[] = []

  mediaRecorder.ondataavailable = event => chunks.push(event.data)
  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" })
    const anchor: any = document.createElement("a")

    anchor.download = "myvid.webm"
    anchor.href = URL.createObjectURL(blob)

    anchor.click()
  }
}
