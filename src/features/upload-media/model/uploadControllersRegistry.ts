const uploadControllers = new Map<string, AbortController>()

export function registerUploadController(id: string,controller: AbortController): void {
  uploadControllers.set(id,controller);
}

export function abortUpload(id: string): void {
  uploadControllers.get(id)?.abort();
}

export function removeUploadController(id: string): void {
  uploadControllers.delete(id);
}