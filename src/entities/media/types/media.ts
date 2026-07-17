export type MediaType =
  | 'image'
  | 'video'
  | 'document'

export type MediaUploadStatus =
  | 'uploading'
  | 'done'
  | 'error'

export interface MediaItem {
  id: string
  name: string
  type: MediaType
  size: number
  createdAt: string
  url: string
  thumbnailUrl: string
  uploadStatus: MediaUploadStatus
  uploadProgress: number
}