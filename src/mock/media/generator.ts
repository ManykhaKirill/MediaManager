import type { MediaItem, MediaType } from '@entities/media';
import { createMockThumbnail } from './mockThumbnail';

const IMAGE_NAMES = [
  'mountains',
  'forest',
  'lake',
  'city',
  'nature',
];

const VIDEO_NAMES = [
  'presentation',
  'meeting',
  'vacation',
  'conference',
  'promo',
];

const DOCUMENT_NAMES = [
  'invoice',
  'contract',
  'report',
  'requirements',
  'manual',
];

const MEDIA_TYPES: MediaType[] = [
  'image',
  'video',
  'document',
];

function getFileName(
  type: MediaType,
  index: number,
): string {
  switch (type) {
    case 'image': {
      const name =
        IMAGE_NAMES[index % IMAGE_NAMES.length];

      return `${name}-${index + 1}.jpg`;
    }

    case 'video': {
      const name =
        VIDEO_NAMES[index % VIDEO_NAMES.length];

      return `${name}-${index + 1}.mp4`;
    }

    case 'document': {
      const name =
        DOCUMENT_NAMES[
          index % DOCUMENT_NAMES.length
        ];

      return `${name}-${index + 1}.pdf`;
    }
  }
}

function createMediaItem(
  index: number,
): MediaItem {
  const type =
    MEDIA_TYPES[index % MEDIA_TYPES.length];

  /*
   * noUncheckedIndexedAccess может считать результат
   * потенциально undefined.
   */
  if (!type) {
    throw new Error(
      `Unable to generate media type for index ${index}`,
    );
  }

  const name = getFileName(type, index);

  return {
    id: `mock-media-${index + 1}`,
    name,
    type,
    size: 150_000 + index * 137_421,
    createdAt: new Date(
      Date.UTC(2026, 6, 15) -
        index * 6 * 60 * 60 * 1000,
    ).toISOString(),
    url: '',
    thumbnail: createMockThumbnail(
      type,
      name,
    ),
  };
}

export function generateMedia(
  count: number,
): MediaItem[] {
  return Array.from(
    { length: count },
    (_, index) => createMediaItem(index),
  );
}