import { createAsyncThunk } from '@reduxjs/toolkit'

import type { RootState } from '@app/store/store'
import { mediaMockApi } from '@mock/media'

export const fetchNextMediaPage =
  createAsyncThunk<
    Awaited<
      ReturnType<
        typeof mediaMockApi.fetchMediaPage
      >
    >,
    void,
    {
      state: RootState
      rejectValue: string
    }
  >(
    'media/fetchNextPage',

    async (
      _,
      {
        getState,
        rejectWithValue
      }
    ) => {
      const { nextPage } =
        getState().media

      if (nextPage === null) {
        return rejectWithValue(
          'All media pages are already loaded'
        )
      }

      try {
        return await mediaMockApi.fetchMediaPage(
          nextPage
        )
      } catch (error) {
        return rejectWithValue(
          error instanceof Error
            ? error.message
            : 'Failed to load media'
        )
      }
    },

    {
      condition: (
        _,
        {
          getState
        }
      ) => {
        const { media } =
          getState()

        return (
          media.pageRequest.status !==
            'loading' &&
          media.nextPage !== null
        )
      }
    }
  )