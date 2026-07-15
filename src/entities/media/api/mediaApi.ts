import { type MediaItem } from '../types/media';

export interface FetchMediaResponse {
  items: MediaItem[];
  nextPage: number | null;
  total: number;
}

export interface UploadResult {
  item: MediaItem;
}

export interface MediaApi {
  fetchMediaPage(page: number): Promise<FetchMediaResponse>;

  uploadFile(
    file: File,
    onProgress: (progress: number) => void,
    signal?: AbortSignal,
  ): Promise<UploadResult>;
}