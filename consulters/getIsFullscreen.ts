export default function getIsFullscreen(): boolean {
    return document['isFullScreen']
        || document['webkitIsFullScreen']
        || document['mozIsFullScreen']
  }