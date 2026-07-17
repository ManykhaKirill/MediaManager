import type { AppDispatch, RootState } from '@app/store/store';
import { prepareUpload } from './prepareUploadThunks';
import { resetUploadTask, setUploadPreparing } from './uploadSlice';
import { startUpload } from './uploadThunks';

export function retryUpload(id: string) {
  return async (
    dispatch: AppDispatch,
    getState: () => RootState
  ): Promise<void> => {
    const task =
      getState().uploadMedia.entities[id]

    if (!task || task.status !== 'error') {
      return;
    }

    if (task.thumbnailUrl) {
      dispatch(resetUploadTask(id));

      await dispatch(startUpload(id));
      return;
    }

    dispatch(setUploadPreparing(id));
    await dispatch(prepareUpload(id));
  }
}