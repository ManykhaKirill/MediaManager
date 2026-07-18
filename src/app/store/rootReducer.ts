import { combineReducers } from '@reduxjs/toolkit';

import { mediaReducer } from '@entities/media';
import { filterMediaReducer } from '@features/filter-media';
import { uploadReducer } from '@features/upload-media';

export const rootReducer = combineReducers({
  media: mediaReducer,
  filterMedia: filterMediaReducer,
  uploadMedia: uploadReducer
});