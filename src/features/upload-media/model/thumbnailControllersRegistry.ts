const thumbnailControllers = new Map<string, AbortController>()

export function registerThumbnailController(id: string, controller: AbortController): void {
  thumbnailControllers.set(id, controller);
}

export function abortThumbnailGeneration(id: string): void {
  thumbnailControllers.get(id)?.abort();
}

export function removeThumbnailController(id: string): void {
  thumbnailControllers.delete(id);
}