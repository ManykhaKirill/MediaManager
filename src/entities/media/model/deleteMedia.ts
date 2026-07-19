import type { AppDispatch, RootState } from '@app/store/store';

import { removeMedia } from './mediaSlice';

function revokeBlobUrl(
  url: string | null | undefined
): void {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

export function deleteMedia(id: string) {
  return (
    dispatch: AppDispatch,
    getState: () => RootState
  ): void => {
    const media = getState().media.entities[id];

    if (!media) {
      return;
    }

    revokeBlobUrl(media.url);

    if (media.thumbnailUrl !== media.url) {
      revokeBlobUrl(media.thumbnailUrl);
    }

    dispatch(removeMedia(id));
  }
}