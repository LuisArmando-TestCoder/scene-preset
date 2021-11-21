import getIsFullscreen from "../consulters/getIsFullscreen"

enum RequestFullScreenIndex {
  requestFullScreen = "requestFullScreen",
  webkitRequestFullScreen = "webkitRequestFullScreen",
  mozRequestFullScreen = "mozRequestFullScreen",
  msRequestFullScreen = "msRequestFullScreen",
}

type RequestFullScreen = { [key in RequestFullScreenIndex]: () => void }

export default function toggleFullscreen(component: RequestFullScreen) {
  const requestFullScreen =
    component["requestFullScreen"] ||
    component["webkitRequestFullScreen"] ||
    component["mozRequestFullScreen"] ||
    component["msRequestFullScreen"]

  if (getIsFullscreen()) {
    document.exitFullscreen()

    return
  }

  requestFullScreen.call(component)
}
