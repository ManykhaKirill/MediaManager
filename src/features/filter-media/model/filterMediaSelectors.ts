import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@app/store/store';
import { selectAllMedia } from '@entities/media';

export const selectMediaTypeFilter = (state: RootState) => state.filterMedia.type;
export const selectMediaSort = (state: RootState) => state.filterMedia.sort;
export const selectMediaSearch = (state: RootState) => state.filterMedia.search;

export const selectVisibleMedia =
  createSelector(
    [
      selectAllMedia,
      selectMediaTypeFilter,
      selectMediaSort,
      selectMediaSearch,
    ],
    (
      media,
      typeFilter,
      sort,
      search,
    ) => {
      const normalizedSearch =
        search.trim().toLowerCase();

      const filtered = media.filter(
        (item) => {
          const matchesType =
            typeFilter === 'all' ||
            item.type === typeFilter;

          const matchesSearch =
            normalizedSearch.length === 0 ||
            item.name
              .toLowerCase()
              .includes(normalizedSearch);

          return matchesType && matchesSearch;
        },
      );

      return filtered.toSorted((a, b) => {
        if (sort === 'size') {
          return b.size - a.size;
        }

        return b.createdAt.localeCompare(a.createdAt);
      });
    },
  );

export const selectHasActiveMediaFilters = createSelector(
  [selectMediaTypeFilter, selectMediaSearch],
  (type, search) => {
    return (
      type !== 'all' ||
      search.trim().length > 0
    )
  }
)