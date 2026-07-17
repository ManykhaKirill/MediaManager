import type { MediaType } from '@entities/media';

export const MEDIA_TYPES = [
  'image',
  'video',
  'document'
] satisfies readonly MediaType[];

export const PAGE_SIZE = 20;

export const INITIAL_ITEMS_COUNT = 60;

export const FETCH_FAILURE_RATE = 0.15;

export const UPLOAD_FAILURE_RATE = 0.2;

export const IMAGE_NAMES = [
  'mountains',
  'forest',
  'lake',
  'city',
  'nature'
]

export const VIDEO_NAMES = [
  'presentation',
  'meeting',
  'vacation',
  'conference',
  'promo'
]

export const DOCUMENT_NAMES = [
  'invoice',
  'contract',
  'report',
  'requirements',
  'manual'
]