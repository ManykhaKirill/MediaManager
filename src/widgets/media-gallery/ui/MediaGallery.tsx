import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector} from '@app/store/hooks';
import { 
    removeMedia, 
    fetchNextMediaPage, 
    MediaCard,
    selectAllMedia,
    selectHasMoreMedia,
    selectMediaPageRequest
} from '@entities/media';

import styles from './MediaGallery.module.css';

export function MediaGallery() {
  const dispatch = useAppDispatch();

  const media = useAppSelector(selectAllMedia);
  const hasMore = useAppSelector(selectHasMoreMedia);
  const request = useAppSelector(selectMediaPageRequest);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      media.length === 0 &&
      request.status === 'idle'
    ) {
      void dispatch(fetchNextMediaPage());
    }
  }, [
    dispatch,
    media.length,
    request.status,
  ]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry?.isIntersecting &&
          request.status !== 'loading'
        ) {
          void dispatch(fetchNextMediaPage());
        }
      }, { rootMargin: '300px 0px' },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [
    dispatch,
    hasMore,
    request.status,
  ]);

  return (
    <section>
      {media.length > 0 && (
        <div className={styles.grid}>
          {media.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onRemove={(id) => {
                dispatch(removeMedia(id));
              }}
            />
          ))}
        </div>
      )}

      {request.status === 'loading' && (
        <p className={styles.message}>
          Loading media...
        </p>
      )}

      {request.status === 'error' && (
        <div className={styles.message}>
          <p>{request.message}</p>

          <button
            type="button"
            onClick={() => {
              void dispatch(
                fetchNextMediaPage(),
              );
            }}
          >
            Retry
          </button>
        </div>
      )}

      {media.length === 0 &&
        request.status === 'success' && (
            <p className={styles.message}>
            No media items found.
            </p>
        )}

      {!hasMore && media.length > 0 && (
        <p className={styles.message}>
          All media items are loaded.
        </p>
      )}

      <div
        ref={sentinelRef}
        className={styles.sentinel}
        aria-hidden="true"
      />
    </section>
  );
}