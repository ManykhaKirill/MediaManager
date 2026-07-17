import { configureStore } from '@reduxjs/toolkit';

import { mediaReducer } from '@entities/media';
import { filterMediaReducer } from '@features/filter-media';
import { uploadReducer } from '@features/upload-media';

export const store = configureStore({
  reducer: {
    media: mediaReducer,
    filterMedia: filterMediaReducer,
    uploadMedia: uploadReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;