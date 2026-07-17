import { generateImageThumbnail } from './generateImageThumbnail'
import { generateVideoThumbnail } from './generateVideoThumbnail'

export async function generateThumbnail(
  file: File,
  signal: AbortSignal
): Promise<Blob> {
  if (file.type.startsWith('image/')) {
    return generateImageThumbnail(
      file,
      signal
    )
  }

  if (file.type === 'video/mp4') {
    return generateVideoThumbnail(
      file,
      signal
    )
  }

  throw new Error(
    `Thumbnail generation is not supported for ${file.type}`
  )
}