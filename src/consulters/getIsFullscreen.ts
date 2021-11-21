enum IsFullScreenIndex {
  isFullScreen = "isFullScreen",
  webkitIsFullScreen = "webkitIsFullScreen",
  mozIsFullScreen = "mozIsFullScreen",
}

type isFullScreen = {
  [key in IsFullScreenIndex]: boolean
}

export default function getIsFullscreen(): boolean {
  const doc = document as any as isFullScreen

  return (
    doc["isFullScreen"] ||
    doc["webkitIsFullScreen"] ||
    doc["mozIsFullScreen"]
  )
}
