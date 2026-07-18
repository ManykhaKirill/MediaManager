export type MediaType = 'image' | 'video' | 'document';

export interface MediaItem {
  id: string;
  name: string;
  type: MediaType;
  size: number;
  createdAt: string;
  url: string;
  thumbnailUrl: string;
}