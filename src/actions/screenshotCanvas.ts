export interface CanvasSave {
  image: HTMLImageElement
  event: Event
}

function downloadImage(base64: string) {
  const downloadAnchor = document.createElement("a")

  downloadAnchor.download = "canvasScreen.png"
  downloadAnchor.href = base64

  downloadAnchor.click()
}

export type ImageResponse = {
  image: HTMLImageElement
  event: Event
}

function retrieveImage({
  base64,
  resolve,
  reject,
}: {
  base64: string
  resolve: (imageResponse: ImageResponse) => void
  reject: (imageResponse: ImageResponse) => void
}) {
  const image = document.createElement("img")

  image.src = base64

  image.addEventListener("load", (event: Event) => {
    resolve({ image, event })
  })
  image.addEventListener("error", (event: Event) => {
    reject({ image, event })
  })
}

export default function saveCanvasScreen(
  canvas: HTMLCanvasElement
): Promise<CanvasSave> {
  return new Promise((resolve, reject) => {
    const base64 = canvas.toDataURL()

    downloadImage(base64)
    retrieveImage({ base64, resolve, reject })
  })
}
