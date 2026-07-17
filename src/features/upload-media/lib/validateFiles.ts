import { mediaFileSchema } from './mediaFileSchema'

import type {
  FileValidationResult
} from '../model/types'

const MAX_FILES = 5

interface ValidateFilesResult {
  files: FileValidationResult[]
  limitError: string | null
}

function createFileId(file: File): string {
  return [
    file.name,
    file.size,
    file.lastModified,
    crypto.randomUUID()
  ].join('-')
}

function validateFile(
  file: File
): FileValidationResult {
  const id = createFileId(file)

  const result = mediaFileSchema.safeParse(file)

  if (!result.success) {
    return {
      status: 'invalid',
      id,
      file,
      message:
        result.error.issues[0]?.message ??
        'Invalid file'
    }
  }

  return {
    status: 'valid',
    id,
    file
  }
}

export function validateFiles(
  files: File[],
  currentFilesCount: number
): ValidateFilesResult {
  const availableSlots =
    Math.max(MAX_FILES - currentFilesCount, 0)

  const acceptedFiles =
    files.slice(0, availableSlots)

  const rejectedByLimitCount =
    files.length - acceptedFiles.length

  return {
    files: acceptedFiles.map(validateFile),
    limitError:
      rejectedByLimitCount > 0
        ? `A maximum of ${MAX_FILES} files can be selected. ${rejectedByLimitCount} ${
            rejectedByLimitCount === 1
              ? 'file was'
              : 'files were'
          } not added.`
        : null
  }
}