import type { AppDispatch, RootState } from '@app/store/store';

import { abortThumbnailGeneration } from './thumbnailControllersRegistry';
import { abortUpload } from './uploadControllersRegistry';
import { removeUploadFile } from './uploadFilesRegistry';
import { removeUploadTask } from './uploadSlice';

export function cancelUpload(id: string) {
  return (
    dispatch: AppDispatch,
    getState: () => RootState
  ): void => {
    const task = getState().uploadMedia.entities[id];

    abortThumbnailGeneration(id);
    abortUpload(id);

    removeUploadFile(id);

    if (task?.thumbnailUrl) {
      URL.revokeObjectURL(task.thumbnailUrl);
    }

    dispatch(removeUploadTask(id));
  }
}