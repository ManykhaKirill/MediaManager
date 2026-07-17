const THUMBNAIL_SIZE = 200
const THUMBNAIL_TYPE = 'image/jpeg'
const THUMBNAIL_QUALITY = 0.82

export function drawThumbnail(
  source: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')

  canvas.width = THUMBNAIL_SIZE
  canvas.height = THUMBNAIL_SIZE

  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas 2D context is not available')
  }

  const scale = Math.max(
    THUMBNAIL_SIZE / sourceWidth,
    THUMBNAIL_SIZE / sourceHeight
  )

  const width = sourceWidth * scale
  const height = sourceHeight * scale

  const x = (THUMBNAIL_SIZE - width) / 2
  const y = (THUMBNAIL_SIZE - height) / 2

  context.drawImage(
    source,
    x,
    y,
    width,
    height
  )

  return canvas
}

export function canvasToBlob(
  canvas: HTMLCanvasElement
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => {
        canvas.width = 0
        canvas.height = 0

        if (!blob) {
          reject(
            new Error('Failed to create thumbnail')
          )

          return
        }

        resolve(blob)
      },
      THUMBNAIL_TYPE,
      THUMBNAIL_QUALITY
    )
  })
}