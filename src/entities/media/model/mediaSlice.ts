import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AsyncState } from '@shared/types/asyncState';

import type { MediaItem } from '../types/media';
import { mediaAdapter } from './mediaAdapter';
import { fetchNextMediaPage } from './mediaThunks';

const initialState =
  mediaAdapter.getInitialState<{
    nextPage: number | null
    total: number
    pageRequest: AsyncState
  }>({
    nextPage: 1,
    total: 0,
    pageRequest: {
      status: 'idle'
    }
  })

const mediaSlice = createSlice({
  name: 'media',

  initialState,

  reducers: {
    addMedia(state, action: PayloadAction<MediaItem>) {
      mediaAdapter.addOne(
        state,
        action.payload
      )

      state.total += 1
    },
    removeMedia(state, action: PayloadAction<string>) {
      const mediaExists = Boolean(state.entities[action.payload])

      mediaAdapter.removeOne(state, action.payload)

      if (mediaExists) {
        state.total = Math.max(0, state.total - 1)
      }
    }
  },

  extraReducers: builder => {
    builder
      .addCase(
        fetchNextMediaPage.pending,
        state => {
          state.pageRequest = {
            status: 'loading'
          }
        }
      )
      .addCase(
        fetchNextMediaPage.fulfilled,
        (state, action) => {
          mediaAdapter.upsertMany(state, action.payload.items)

          state.nextPage = action.payload.nextPage
          state.total = action.payload.total
          state.pageRequest = {
            status: 'success'
          }
        }
      )
      .addCase(
        fetchNextMediaPage.rejected,
        (state, action) => {
          state.pageRequest = {
            status: 'error',
            message:
              action.payload ??
              action.error.message ??
              'Failed to load media'
          }
        }
      )
  }
})

export const { addMedia, removeMedia } = mediaSlice.actions;

export const mediaReducer = mediaSlice.reducer;