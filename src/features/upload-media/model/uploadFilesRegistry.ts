const uploadFilesRegistry = new Map<string, File>()

export function registerUploadFile(id: string, file: File): void {
  uploadFilesRegistry.set(id, file);
}

export function getUploadFile(id: string): File | undefined {
  return uploadFilesRegistry.get(id);
}

export function removeUploadFile(id: string): void {
  uploadFilesRegistry.delete(id);
}