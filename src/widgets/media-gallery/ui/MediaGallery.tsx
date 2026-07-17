import {
  useEffect,
  useRef
} from 'react'

import {
  useAppDispatch,
  useAppSelector
} from '@app/store/hooks'

import {
  fetchNextMediaPage,
  MediaCard,
  removeMedia,
  selectAllMedia,
  selectHasMoreMedia,
  selectMediaPageRequest
} from '@entities/media'

import {
  selectHasActiveMediaFilters,
  selectVisibleMedia
} from '@features/filter-media'

import {
  cancelUpload,
  retryUpload,
  selectAllUploadTasks,
  UploadMediaCard
} from '@features/upload-media'

import styles from './MediaGallery.module.css'

export function MediaGallery() {
  const dispatch = useAppDispatch()

  const allMedia = useAppSelector(
    selectAllMedia
  )

  const visibleMedia = useAppSelector(
    selectVisibleMedia
  )

  const uploadTasks = useAppSelector(
    selectAllUploadTasks
  )

  const hasMore = useAppSelector(
    selectHasMoreMedia
  )

  const request = useAppSelector(
    selectMediaPageRequest
  )

  const hasActiveFilters = useAppSelector(
    selectHasActiveMediaFilters
  )

  const sentinelRef =
    useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (
      allMedia.length === 0 &&
      request.status === 'idle'
    ) {
      void dispatch(
        fetchNextMediaPage()
      )
    }
  }, [
    dispatch,
    allMedia.length,
    request.status
  ])

  useEffect(() => {
    const sentinel =
      sentinelRef.current

    if (
      !sentinel ||
      !hasMore ||
      allMedia.length === 0 ||
      request.status === 'error'
    ) {
      return
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (
            entry?.isIntersecting &&
            request.status === 'success'
          ) {
            void dispatch(
              fetchNextMediaPage()
            )
          }
        },
        {
          rootMargin: '300px 0px'
        }
      )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [
    dispatch,
    hasMore,
    allMedia.length,
    request.status
  ])

  const isInitialLoading =
    request.status === 'loading' &&
    allMedia.length === 0

  const isLoadingNextPage =
    request.status === 'loading' &&
    allMedia.length > 0

  const isCollectionEmpty =
    request.status === 'success' &&
    allMedia.length === 0 &&
    uploadTasks.length === 0 &&
    !hasActiveFilters

  const hasNoFilterResults =
    allMedia.length > 0 &&
    visibleMedia.length === 0 &&
    hasActiveFilters

  const isEndOfList =
    request.status === 'success' &&
    !hasMore &&
    allMedia.length > 0 &&
    !hasNoFilterResults

  const shouldRenderSentinel =
    hasMore &&
    allMedia.length > 0 &&
    request.status === 'success'

  const hasGalleryItems =
    uploadTasks.length > 0 ||
    visibleMedia.length > 0

  return (
    <section>
      {hasGalleryItems && (
        <div className={styles.grid}>
          {uploadTasks.map(task => (
            <UploadMediaCard
              key={task.id}
              task={task}
              onRemove={id => {
                void dispatch(
                  cancelUpload(id)
                )
              }}
              onRetry={id => {
                void dispatch(
                  retryUpload(id)
                )
              }}
            />
          ))}

          {visibleMedia.map(item => (
            <MediaCard
              key={item.id}
              item={item}
              onRemove={id => {
                dispatch(
                  removeMedia(id)
                )
              }}
            />
          ))}
        </div>
      )}

      {isInitialLoading && (
        <p
          className={styles.message}
          role="status"
        >
          Loading media...
        </p>
      )}

      {hasNoFilterResults && (
        <p className={styles.message}>
          No media matches the selected filters.
        </p>
      )}

      {isCollectionEmpty && (
        <p className={styles.message}>
          No media items found.
        </p>
      )}

      {isLoadingNextPage && (
        <p
          className={styles.message}
          role="status"
        >
          Loading more media...
        </p>
      )}

      {request.status === 'error' && (
        <div
          className={styles.message}
          role="alert"
        >
          <p>{request.message}</p>

          <button
            type="button"
            onClick={() => {
              void dispatch(
                fetchNextMediaPage()
              )
            }}
          >
            Retry
          </button>
        </div>
      )}

      {isEndOfList && (
        <p className={styles.message}>
          All media items are loaded.
        </p>
      )}

      {shouldRenderSentinel && (
        <div
          ref={sentinelRef}
          className={styles.sentinel}
          aria-hidden="true"
        />
      )}
    </section>
  )
}