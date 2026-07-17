import type { UploadStatus, UploadTask } from '../model/types';
import { getMediaType } from '../lib/getMediaType';
import styles from './UploadMediaCard.module.css';

interface UploadMediaCardProps {
  task: UploadTask
  onRemove: (id: string) => void
  onRetry: (id: string) => void
}

function formatFileSize(
  bytes: number
): string {
  const megabytes =
    bytes / 1024 / 1024

  if (megabytes >= 1) {
    return `${megabytes.toFixed(1)} MB`
  }

  return `${(bytes / 1024).toFixed(1)} KB`
}

function getStatusLabel(
  status: UploadStatus
) {
  switch (status) {
    case 'invalid':
      return 'Invalid'

    case 'preparing':
      return 'Preparing'

    case 'pending':
      return 'Ready'

    case 'uploading':
      return 'Uploading'

    case 'error':
      return 'Error'

  }
}

function getStatusClassName(
  status: UploadStatus
) {
  switch (status) {
    case 'invalid':
    case 'error':
      return styles.errorBadge

    case 'pending':
      return styles.pendingBadge

    case 'preparing':
    case 'uploading':
      return styles.uploadingBadge
  }
}

export function UploadMediaCard({
  task,
  onRemove,
  onRetry
}: UploadMediaCardProps) {
  const mediaType =
    getMediaType(task.fileType)

  const isUploading =
    task.status === 'uploading'

  const canRetry =
    task.status === 'error'

  return (
    <article className={styles.card}>
      <button
        type="button"
        className={styles.removeButton}
        aria-label={`Remove ${task.fileName}`}
        onClick={() => {
          onRemove(task.id)
        }}
      >
        ×
      </button>

      <div className={styles.preview}>
        {task.thumbnailUrl ? (
          <img
            src={task.thumbnailUrl}
            alt=""
            className={styles.image}
          />
        ) : (
          <div
            className={styles.placeholder}
            aria-hidden="true"
          >
            <span
              className={
                styles.placeholderIcon
              }
            >
              {mediaType === 'video'
                ? '▶'
                : '▧'}
            </span>

            <span>
              {task.status === 'preparing'
                ? 'Preparing preview'
                : 'Preview unavailable'}
            </span>
          </div>
        )}

        <span
          className={`${styles.statusBadge} ${getStatusClassName(
            task.status
          )}`}
        >
          {getStatusLabel(task.status)}
        </span>
      </div>

      <div className={styles.content}>
        <h2
          className={styles.name}
          title={task.fileName}
        >
          {task.fileName}
        </h2>

        <div className={styles.meta}>
          <span className={styles.typeBadge}>
            {mediaType}
          </span>

          <span>
            {formatFileSize(
              task.fileSize
            )}
          </span>
        </div>

        {isUploading && (
          <div
            className={styles.progressBlock}
            role="status"
            aria-label={`Uploading ${task.fileName}`}
          >
            <div
              className={
                styles.progressHeader
              }
            >
              <span>Uploading</span>

              <span>
                {task.progress}%
              </span>
            </div>

            <progress
              className={styles.progress}
              value={task.progress}
              max={100}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={
                task.progress
              }
            />
          </div>
        )}

        {task.error && (
          <p
            className={styles.errorMessage}
            role="alert"
          >
            {task.error}
          </p>
        )}

        {canRetry && (
          <button
            type="button"
            className={styles.retryButton}
            onClick={() => {
              onRetry(task.id)
            }}
          >
            Retry
          </button>
        )}
      </div>
    </article>
  )
}