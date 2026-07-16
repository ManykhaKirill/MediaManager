import {
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { MediaType } from '@entities/media';

export type MediaTypeFilter =
  | 'all'
  | MediaType;

export type MediaSort =
  | 'date'
  | 'size';

interface FilterMediaState {
  type: MediaTypeFilter;
  sort: MediaSort;
  search: string;
}

const initialState: FilterMediaState = {
  type: 'all',
  sort: 'date',
  search: '',
};

const filterMediaSlice = createSlice({
  name: 'filterMedia',
  initialState,
  reducers: {
    setMediaTypeFilter(
      state,
      action: PayloadAction<MediaTypeFilter>,
    ) {
      state.type = action.payload;
    },

    setMediaSort(
      state,
      action: PayloadAction<MediaSort>,
    ) {
      state.sort = action.payload;
    },

    setMediaSearch(
      state,
      action: PayloadAction<string>,
    ) {
      state.search = action.payload;
    },
  },
});

export const {
  setMediaTypeFilter,
  setMediaSort,
  setMediaSearch,
} = filterMediaSlice.actions;

export const filterMediaReducer = filterMediaSlice.reducer;