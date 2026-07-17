import type {
  AppDispatch,
  RootState
} from '@app/store/store';
import { generateThumbnail } from '../lib/generateThumbnail';
import { cacheThumbnail, getCachedThumbnail } from '../lib/thumbnailCache';
import { registerThumbnailController, removeThumbnailController } from './thumbnailControllersRegistry';
import { getUploadFile } from './uploadFilesRegistry';
import { setUploadPreparationFailed, setUploadPrepared } from './uploadSlice';
import { startUpload } from './uploadThunks';

export function prepareUpload(id: string) {
  return async (
    dispatch: AppDispatch,
    getState: () => RootState
  ): Promise<void> => {
    const task =
      getState().uploadMedia.entities[id]

    if (!task || task.status !== 'preparing') {
      return;
    }

    const file = getUploadFile(id);

    if (!file) {
      dispatch(
        setUploadPreparationFailed({
          id,
          message:
            'File is no longer available'
        })
      )

      return
    }

    const controller = new AbortController();

    registerThumbnailController(id, controller);

    let thumbnailUrl: string | null = null;

    try {
      let thumbnailBlob = await getCachedThumbnail(file);

      if (controller.signal.aborted) {
        return
      }

      if (!thumbnailBlob) {
         thumbnailBlob = await generateThumbnail(file, controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        try {
          await cacheThumbnail(file, thumbnailBlob);
        } catch (error) {
            console.warn('Failed to cache thumbnail', error);
          }
      }

      const currentTask = getState().uploadMedia.entities[id];

      if (
        !currentTask ||
        currentTask.status !== 'preparing' ||
        controller.signal.aborted
      ) {
        return;
      }

      thumbnailUrl = URL.createObjectURL(thumbnailBlob);

      const latestTask = getState().uploadMedia.entities[id]

      if (
        !latestTask ||
        latestTask.status !== 'preparing' ||
        controller.signal.aborted
      ) {
        URL.revokeObjectURL(thumbnailUrl);
        thumbnailUrl = null;
        return;
      }

      dispatch(setUploadPrepared({ id,thumbnailUrl }));

      thumbnailUrl = null;
      await dispatch(startUpload(id));
    } catch (error) {
      if (thumbnailUrl) {
        URL.revokeObjectURL(thumbnailUrl);
      }

      if (
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        return;
      }

      const currentTask = getState().uploadMedia.entities[id];

      if (!currentTask) {
        return;
      }

      dispatch(
        setUploadPreparationFailed({
          id,
          message:
            error instanceof Error
              ? error.message
              : 'Failed to generate thumbnail'
        })
      )
    } finally {
      removeThumbnailController(id);
    }
  }
}