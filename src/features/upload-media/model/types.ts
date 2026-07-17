export type UploadStatus =
  | 'preparing'
  | 'pending'
  | 'uploading'
  | 'error'
  | 'invalid'

export interface UploadTask {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  lastModified: number
  status: UploadStatus
  progress: number
  error: string | null
  thumbnailUrl: string | null
}

export type FileValidationResult =
  | {
      status: 'valid'
      id: string
      file: File
    }
  | {
      status: 'invalid'
      id: string
      file: File
      message: string
    }