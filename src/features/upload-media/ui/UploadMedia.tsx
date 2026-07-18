import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent
} from 'react'

import {
  useAppDispatch,
  useAppSelector
} from '@app/store/hooks'

import {
  addUploadFiles,
  cancelUpload,
  selectAllUploadTasks,
  type UploadTask
} from '@features/upload-media'

import { validateFiles } from '../lib/validateFiles'

import {
  registerUploadFile
} from '../model/uploadFilesRegistry'

import {
  prepareUpload
} from '../model/prepareUploadThunks'

import { Icon } from '@shared/ui/icon';
import styles from './UploadMedia.module.css';

export function UploadMedia() {
  const dispatch = useAppDispatch()

  const uploadTasks = useAppSelector(
    selectAllUploadTasks
  )

  const inputRef =
    useRef<HTMLInputElement | null>(null)

  const [limitError, setLimitError] =
    useState<string | null>(null)

  const [isDragging, setIsDragging] =
    useState(false)

  const [
    isUploadPanelOpen,
    setIsUploadPanelOpen
  ] = useState(false)

  function processFiles(files: File[]) {
    if (files.length === 0) {
      return
    }

    const result = validateFiles(
      files,
      uploadTasks.length
    )

    setLimitError(result.limitError)

    const tasks: UploadTask[] =
      result.files.map(item => {
        if (item.status === 'valid') {
          registerUploadFile(
            item.id,
            item.file
          )
        }

        return {
          id: item.id,
          fileName: item.file.name,
          fileSize: item.file.size,
          fileType: item.file.type,
          lastModified:
            item.file.lastModified,
          status:
            item.status === 'valid'
              ? 'preparing'
              : 'invalid',
          progress: 0,
          error:
            item.status === 'invalid'
              ? item.message
              : null,
          url: null,
          thumbnailUrl: null
        }
      })

    if (tasks.length > 0) {
      dispatch(
        addUploadFiles(tasks)
      )

      tasks
        .filter(
          task =>
            task.status === 'preparing'
        )
        .forEach(task => {
          void dispatch(
            prepareUpload(task.id)
          )
        })
    }
  }

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    processFiles(
      Array.from(
        event.target.files ?? []
      )
    )

    event.target.value = ''
  }

  function handleDragOver(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault()

    if (
      event.currentTarget.contains(
        event.relatedTarget as Node | null
      )
    ) {
      return
    }

    setIsDragging(false)
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault()
    setIsDragging(false)

    processFiles(
      Array.from(
        event.dataTransfer.files
      )
    )
  }

  function handleRemoveTask(id: string) {
    dispatch(
      cancelUpload(id)
    )

    setLimitError(null)
  }

  function toggleUploadPanel() {
    setIsUploadPanelOpen(
      currentValue => {
        if (currentValue) {
          setIsDragging(false)
        }

        return !currentValue
      }
    )
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.heading}>
            Uploads
          </h2>

          <p className={styles.subtitle}>
            Add up to five images or videos
          </p>
        </div>

        <button
          type="button"
          className={styles.addButton}
          aria-expanded={
            isUploadPanelOpen
          }
          aria-controls="media-upload-panel"
          onClick={toggleUploadPanel}
        >
          <Icon
            name={
              isUploadPanelOpen
                ? 'close'
                : 'add'
            }
            size={18}
            className={styles.addIcon}
          />

          {isUploadPanelOpen
            ? 'Close'
            : 'Add media'}
        </button>
      </div>

      {isUploadPanelOpen && (
        <div
          id="media-upload-panel"
          className={styles.panel}
        >
          <div
            className={`${styles.dropZone} ${
              isDragging
                ? styles.dragging
                : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              className={styles.input}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,video/mp4"
              onChange={handleInputChange}
            />

            <Icon
              name="upload"
              size={32}
              className={styles.uploadIcon}
            />

            <div className={styles.dropContent}>
              <p className={styles.title}>
                Drop files here
              </p>

              <p className={styles.description}>
                JPEG, PNG, WebP or MP4.
                Maximum 10 MB per file.
              </p>
            </div>

            <button
              type="button"
              className={styles.browseButton}
              onClick={() => {
                inputRef.current?.click()
              }}
            >
              Browse files
            </button>
          </div>
        </div>
      )}

      {limitError && (
        <p
          className={styles.limitError}
          role="alert"
        >
          {limitError}
        </p>
      )}

      {uploadTasks.length > 0 && (
        <ul className={styles.fileList}>
          {uploadTasks.map(task => (
            <li
              key={task.id}
              className={styles.fileItem}
            >
              <Icon
                name={
                  task.fileType.startsWith('video/')
                    ? 'video'
                    : 'image'
                }
                size={20}
                className={styles.fileIcon}
              />

              <div
                className={styles.fileDetails}
              >
                <strong>
                  {task.fileName}
                </strong>

                <span
                  className={styles.fileSize}
                >
                  {(
                    task.fileSize /
                    1024 /
                    1024
                  ).toFixed(2)} MB
                </span>

                {task.status ===
                  'invalid' && (
                  <span
                    className={styles.error}
                    role="alert"
                  >
                    {task.error}
                  </span>
                )}

                {task.status ===
                  'preparing' && (
                  <span
                    className={
                      styles.preparing
                    }
                  >
                    Preparing preview...
                  </span>
                )}

                {task.status === 'uploading' && (
                    <span>
                        Uploading...
                    </span>
                )}
              </div>

              <button
                type="button"
                className={styles.removeButton}
                aria-label={`Remove ${task.fileName}`}
                onClick={() => {
                  handleRemoveTask(task.id)
                }}
              >
                <Icon
                  name="close"
                  size={18}
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}