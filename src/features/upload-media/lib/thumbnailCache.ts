const THUMBNAIL_CACHE_NAME = 'media-thumbnail-cache-v1';

function createThumbnailCacheKey(
  file: File
): string {
  const params = new URLSearchParams({
    name: file.name,
    size: String(file.size)
  })

  return `/thumbnail?${params.toString()}`
}

export async function getCachedThumbnail(
  file: File
): Promise<Blob | null> {
  if (!('caches' in window)) {
    return null
  }

  const cache = await caches.open(
    THUMBNAIL_CACHE_NAME
  )

  const response = await cache.match(
    createThumbnailCacheKey(file)
  )

  if (!response) {
    return null
  }

  return response.blob()
}

export async function cacheThumbnail(
  file: File,
  thumbnail: Blob
): Promise<void> {
  if (!('caches' in window)) {
    return
  }

  const cache = await caches.open(
    THUMBNAIL_CACHE_NAME
  )

  await cache.put(
    createThumbnailCacheKey(file),
    new Response(thumbnail, {
      headers: {
        'Content-Type':
          thumbnail.type ||
          'image/jpeg'
      }
    })
  )
}