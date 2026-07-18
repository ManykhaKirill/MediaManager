import type { MediaItem,MediaType } from '@entities/media';
import {
  DOCUMENT_NAMES,
  IMAGE_NAMES,
  MEDIA_TYPES,
  VIDEO_NAMES
} from './constants';
import { createMockThumbnail } from './mockThumbnail';

function getFileName(type: MediaType,index: number): string {
  switch (type) {
    case 'image': {
      const name = IMAGE_NAMES[index % IMAGE_NAMES.length];
      return `${name}-${index + 1}.jpg`
    }

    case 'video': {
      const name = VIDEO_NAMES[index % VIDEO_NAMES.length];
      return `${name}-${index + 1}.mp4`
    }

    case 'document': {
      const name = DOCUMENT_NAMES[index % DOCUMENT_NAMES.length];
      return `${name}-${index + 1}.pdf`
    }
  }
}

function createMediaItem(index: number): MediaItem {
  const type = MEDIA_TYPES[index % MEDIA_TYPES.length];

  if (!type) {
    throw new Error(`Unable to generate media type for index ${index}`);
  }

  const name = getFileName(type, index);

  return {
    id: `mock-media-${index + 1}`,
    name,
    type,
    size:
      150_000 +
      index * 137_421,
    createdAt: new Date(Date.now() - index * 6 * 60 * 60 * 1000).toISOString(),
    url: '',
    thumbnailUrl: createMockThumbnail(type, name)
  }
}

export function generateMedia(count: number): MediaItem[] {
  return Array.from({ length: count }, (_, index) => createMediaItem(index));
}