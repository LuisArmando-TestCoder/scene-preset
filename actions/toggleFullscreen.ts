import getIsFullscreen from '../consulters/getIsFullscreen'

export default function toggleFullscreen(component: HTMLElement) {
  const requestFullScreen = component['requestFullScreen']
                         || component['webkitRequestFullScreen']
                         || component['mozRequestFullScreen']
                         || component['msRequestFullScreen']

  if (getIsFullscreen()) {
    document.exitFullscreen()

    return
  }

  requestFullScreen.call(component)
}