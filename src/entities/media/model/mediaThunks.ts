import { createAsyncThunk } from '@reduxjs/toolkit';

import type { RootState } from '@app/store/store';
import { mediaMockApi } from '@/mock/media/mediaMockApi';

export const fetchNextMediaPage = createAsyncThunk(
  'media/fetchNextPage',
  async (_, { getState, rejectWithValue }) => {
    const { nextPage } = (getState() as RootState).media;

    if (nextPage === null) {
      return rejectWithValue('All media pages are already loaded');
    }

    try {
      return await mediaMockApi.fetchMediaPage(nextPage);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Failed to load media',
      );
    }
  },
  {
    condition: (_, { getState }) => {
      const { media } = getState() as RootState;

      return (
        media.pageRequest.status !== 'loading' &&
        media.nextPage !== null
      );
    },
  },
);