import type { RootState } from '@app/store/store';
import { uploadAdapter } from './uploadAdapter';

const uploadSelectors = uploadAdapter.getSelectors<RootState>(state => state.uploadMedia);

export const selectAllUploadTasks = uploadSelectors.selectAll;

export const selectUploadTaskById = uploadSelectors.selectById;

export const selectUploadTasksCount = (state: RootState): number => state.uploadMedia.ids.length;