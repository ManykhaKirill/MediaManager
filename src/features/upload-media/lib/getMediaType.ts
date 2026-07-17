import type { MediaType } from '@entities/media';

export function getMediaType(mimeType: string): MediaType {
  if (mimeType.startsWith('video/')) {
    return 'video';
  }
  if (mimeType.startsWith('image/')) {
    return 'image';
  }
  return 'document';
}