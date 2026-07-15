import { createSlice } from '@reduxjs/toolkit';

import type { AsyncState } from '@shared/types/asyncState';

import { mediaAdapter } from './mediaAdapter';
import { fetchNextMediaPage } from './mediaThunks';

const initialState = mediaAdapter.getInitialState<{
  nextPage: number | null;
  total: number;
  pageRequest: AsyncState;
}>({
  nextPage: 1,
  total: 0,
  pageRequest: { status: 'idle' },
});

const mediaSlice = createSlice({
  name: 'media',
  initialState,

  reducers: {
    removeMedia: mediaAdapter.removeOne,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchNextMediaPage.pending, (state) => {
        state.pageRequest = {
          status: 'loading',
        };
      })
      .addCase(fetchNextMediaPage.fulfilled, (state, action) => {
        mediaAdapter.upsertMany(
          state,
          action.payload.items,
        );

        state.nextPage = action.payload.nextPage;
        state.total = action.payload.total;
        state.pageRequest = {
          status: 'success',
        };
      })
      .addCase(fetchNextMediaPage.rejected, (state, action) => {
        state.pageRequest = {
          status: 'error',
          message:
            typeof action.payload === 'string'
              ? action.payload
              : 'Failed to load media',
        };
      });
  },
});

export const { removeMedia } = mediaSlice.actions;

export const mediaReducer = mediaSlice.reducer;