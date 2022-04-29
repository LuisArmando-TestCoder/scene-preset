import getIsFullscreen from "../consulters/getIsFullscreen"

enum RequestFullScreenIndex {
  requestFullScreen = "requestFullScreen",
  webkitRequestFullScreen = "webkitRequestFullScreen",
  mozRequestFullScreen = "mozRequestFullScreen",
  msRequestFullScreen = "msRequestFullScreen",
}

export type RequestFullScreen = {
  [key in RequestFullScreenIndex]?: () => void
}

export default function toggleFullscreen(component: HTMLElement) {
  const requestElement = (component as any) as RequestFullScreen
  const requestFullScreen =
    requestElement["requestFullScreen"] ||
    requestElement["webkitRequestFullScreen"] ||
    requestElement["mozRequestFullScreen"] ||
    requestElement["msRequestFullScreen"]

  if (getIsFullscreen()) {
    document.exitFullscreen()

    return
  }

  if (requestFullScreen) {
    requestFullScreen.call(component)
  }
}
