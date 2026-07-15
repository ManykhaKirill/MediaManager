import type { MediaItem } from '../types/media';

import styles from './MediaCard.module.css';

interface MediaCardProps {
  item: MediaItem;
  onRemove: (id: string) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kilobytes = bytes / 1024;

  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(1)} KB`;
  }

  const megabytes = kilobytes / 1024;

  return `${megabytes.toFixed(1)} MB`;
}

export function MediaCard({
  item,
  onRemove,
}: MediaCardProps) {
  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.removeButton}
        aria-label={`Remove ${item.name}`}
        onClick={() => onRemove(item.id)}
      >
        ×
      </button>

      <div className={styles.preview}>
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt=""
            className={styles.image}
          />
        ) : (
          <span className={styles.placeholder}>
            {item.type}
          </span>
        )}
      </div>

      <div className={styles.content}>
        <h2 className={styles.name} title={item.name}>
          {item.name}
        </h2>

        <div className={styles.meta}>
          <span className={styles.badge}>
            {item.type}
          </span>

          <span>{formatFileSize(item.size)}</span>
        </div>
      </div>
    </article>
  );
}