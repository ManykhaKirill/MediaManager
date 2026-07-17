import type { AppDispatch, RootState } from '@app/store/store';
import { addMedia } from '@entities/media';
import { mediaMockApi } from '@mock/media';
import { getUploadFile, removeUploadFile } from './uploadFilesRegistry';
import { registerUploadController, removeUploadController } from './uploadControllersRegistry';
import {
  removeUploadTask,
  setUploadFailed,
  setUploadProgress,
  setUploadStarted
} from './uploadSlice';
import { getMediaType } from '../lib/getMediaType';

export function startUpload(id: string) {
  return async (
    dispatch: AppDispatch,
    getState: () => RootState
  ): Promise<void> => {
    const task = getState().uploadMedia.entities[id];

    if (!task || task.status !== 'pending') {
      return;
    }

    const file = getUploadFile(id)

    if (!file) {
      dispatch(setUploadFailed({id, message: 'File is no longer available' }));
      return;
    }

    if (!task.thumbnailUrl) {
      dispatch(setUploadFailed({ id, message: 'Thumbnail is not available' }));
      return;
    }

    const controller = new AbortController();

    registerUploadController(id, controller);

    dispatch(setUploadStarted(id));

    try {
      const result = await mediaMockApi.uploadFile(
          file,
          progress => {
            const currentTask = getState().uploadMedia.entities[id];

            if (!currentTask || currentTask.status !== 'uploading') {
              return;
            }
            dispatch(setUploadProgress({ id, progress }));
          },
          controller.signal
        )

      const currentTask = getState().uploadMedia.entities[id];

      if (!currentTask || currentTask.status !== 'uploading') {
        URL.revokeObjectURL(result.url);
        return;
      }

      if (!currentTask.thumbnailUrl) {
        URL.revokeObjectURL(result.url);

        dispatch(setUploadFailed({id, message: 'Thumbnail is not available'}));
        return;
      }

      dispatch(
        addMedia({
          id,
          name: currentTask.fileName,
          type: getMediaType(currentTask.fileType),
          size: currentTask.fileSize,
          createdAt:
            new Date().toISOString(),
          url: result.url,
          thumbnailUrl:
            currentTask.thumbnailUrl,
          uploadStatus: 'done',
          uploadProgress: 100
        })
      )

      removeUploadFile(id);

      dispatch(removeUploadTask(id));
    } catch (error) {
      const currentTask = getState().uploadMedia.entities[id];

      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }

      if (!currentTask) {
        return;
      }

      dispatch(
        setUploadFailed({
          id,
          message:
            error instanceof Error
              ? error.message
              : 'Upload failed'
        })
      )
    } finally {
      removeUploadController(id);
    }
  }
}