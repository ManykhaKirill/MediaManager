import type { MediaItem } from '../types/media';

import { Icon } from '@shared/ui/icon';
import styles from './MediaCard.module.css';

interface MediaCardProps {
  item: MediaItem;
  onRemove: (id: string) => void;
}

function formatFileSize(bytes: number): string {
  const megabytes = bytes / 1024 / 1024;

  if (megabytes >= 1) {
    return `${megabytes.toFixed(1)} MB`;
  }

  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function MediaCard({
  item,
  onRemove
}: MediaCardProps) {
  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.removeButton}
        aria-label={`Remove ${item.name}`}
        onClick={() => {
          onRemove(item.id);
        }}
      >
        <Icon
          name="close"
          size={18}
        />
      </button>

      <div className={styles.preview}>
        <img
          src={item.thumbnailUrl}
          alt=""
          className={styles.image}
        />

        {item.uploadStatus !== 'done' && (
          <span
            className={`${styles.uploadBadge} ${
              item.uploadStatus === 'error'
                ? styles.errorBadge
                : styles.uploadingBadge
            }`}
          >
            {item.uploadStatus === 'uploading'
              ? 'Uploading'
              : 'Error'}
          </span>
        )}
      </div>

      <div className={styles.content}>
        <h2
          className={styles.name}
          title={item.name}
        >
          {item.name}
        </h2>

        <div className={styles.meta}>
          <span className={styles.badge}>
            {item.type}
          </span>

          <span>
            {formatFileSize(item.size)}
          </span>
        </div>

        {item.uploadStatus === 'uploading' && (
          <div className={styles.progressBlock}>
            <div className={styles.progressHeader}>
              <span>Uploading</span>

              <span>
                {item.uploadProgress}%
              </span>
            </div>

            <progress
              className={styles.progress}
              value={item.uploadProgress}
              max={100}
            />
          </div>
        )}
      </div>
    </article>
  );
}