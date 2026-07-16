import { configureStore } from '@reduxjs/toolkit';

import { mediaReducer } from '@entities/media';
import { filterMediaReducer } from '@features/filter-media';

export const store = configureStore({
  reducer: {
    media: mediaReducer,
    filterMedia: filterMediaReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;