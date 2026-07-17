import {
  canvasToBlob,
  drawThumbnail
} from './thumbnailCanvas'

function createAbortError(): DOMException {
  return new DOMException(
    'Thumbnail generation was cancelled',
    'AbortError'
  )
}

export async function generateImageThumbnail(
  file: File,
  signal: AbortSignal
): Promise<Blob> {
  if (signal.aborted) {
    throw createAbortError()
  }

  const image = await createImageBitmap(file)

  try {
    if (signal.aborted) {
      throw createAbortError()
    }

    const canvas = drawThumbnail(
      image,
      image.width,
      image.height
    )

    if (signal.aborted) {
      canvas.width = 0
      canvas.height = 0

      throw createAbortError()
    }

    return await canvasToBlob(canvas)
  } finally {
    image.close()
  }
}