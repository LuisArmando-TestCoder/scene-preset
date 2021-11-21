enum IsFullScreenIndex {
  isFullScreen = "isFullScreen",
  webkitIsFullScreen = "webkitIsFullScreen",
  mozIsFullScreen = "mozIsFullScreen",
}

export type IsFullScreen = {
  [key in IsFullScreenIndex]: boolean
}

export default function getIsFullscreen(): boolean {
  const doc = document as any as IsFullScreen

  return (
    doc["isFullScreen"] ||
    doc["webkitIsFullScreen"] ||
    doc["mozIsFullScreen"]
  )
}
