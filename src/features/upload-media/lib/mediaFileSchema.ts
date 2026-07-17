import { z } from 'zod';

const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'video/mp4'
] as const;

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const mediaFileSchema = z.instanceof(File)
  .refine(
    file => ACCEPTED_FILE_TYPES.some(
        acceptedType => acceptedType === file.type
      ), { message: 'Unsupported file type' })
  .refine(
    file => file.size <= MAX_FILE_SIZE,
        { message: 'File must not exceed 10 MB' });