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

export function generateVideoThumbnail(
  file: File,
  signal: AbortSignal
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    const sourceUrl = URL.createObjectURL(file)

    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true
    video.src = sourceUrl

    function cleanup() {
      signal.removeEventListener(
        'abort',
        handleAbort
      )

      video.removeEventListener(
        'loadeddata',
        handleLoadedData
      )

      video.removeEventListener(
        'seeked',
        handleSeeked
      )

      video.removeEventListener(
        'error',
        handleError
      )

      video.removeAttribute('src')
      video.load()

      URL.revokeObjectURL(sourceUrl)
    }

    function fail(error: Error | DOMException) {
      cleanup()
      reject(error)
    }

    function handleAbort() {
      fail(createAbortError())
    }

    function handleError() {
      fail(
        new Error('Failed to read video file')
      )
    }

    function handleLoadedData() {
      if (signal.aborted) {
        handleAbort()
        return
      }

      if (video.duration > 0) {
        video.currentTime = Math.min(
          0.1,
          video.duration
        )

        return
      }

      void createThumbnail()
    }

    function handleSeeked() {
      void createThumbnail()
    }

    async function createThumbnail() {
      try {
        if (signal.aborted) {
          throw createAbortError()
        }

        if (
          video.videoWidth === 0 ||
          video.videoHeight === 0
        ) {
          throw new Error(
            'Video dimensions are not available'
          )
        }

        const canvas = drawThumbnail(
          video,
          video.videoWidth,
          video.videoHeight
        )

        if (signal.aborted) {
          canvas.width = 0
          canvas.height = 0

          throw createAbortError()
        }

        const blob = await canvasToBlob(canvas)

        cleanup()
        resolve(blob)
      } catch (error) {
        fail(
          error instanceof Error
            ? error
            : new Error(
                'Failed to generate video thumbnail'
              )
        )
      }
    }

    signal.addEventListener(
      'abort',
      handleAbort,
      {
        once: true
      }
    )

    video.addEventListener(
      'loadeddata',
      handleLoadedData,
      {
        once: true
      }
    )

    video.addEventListener(
      'seeked',
      handleSeeked,
      {
        once: true
      }
    )

    video.addEventListener(
      'error',
      handleError,
      {
        once: true
      }
    )
  })
}