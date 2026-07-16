import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@app/store/hooks';
import {
  selectMediaSearch,
  selectMediaSort,
  selectMediaTypeFilter
} from '../model/filterMediaSelectors';
import {
  setMediaSearch,
  setMediaSort,
  setMediaTypeFilter,
  type MediaSort,
  type MediaTypeFilter
} from '../model/filterMediaSlice';

import styles from './MediaFilters.module.css';

export function MediaFilters() {
  const dispatch = useAppDispatch();

  const typeFilter = useAppSelector(selectMediaTypeFilter);
  const sort = useAppSelector(selectMediaSort);
  const storedSearch = useAppSelector(selectMediaSearch);

  const [searchInput, setSearchInput] = useState(storedSearch);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
        dispatch(setMediaSearch(searchInput));
      }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [dispatch, searchInput]);

  return (
    <section
      className={styles.filters}
      aria-label="Media filters"
    >
      <label className={styles.field}>
        <span>Search</span>

        <input
          type="search"
          value={searchInput}
          placeholder="Search by file name"
          onChange={(event) => {
            setSearchInput(
              event.target.value,
            );
          }}
        />
      </label>

      <label className={styles.field}>
        <span>Type</span>

        <select
          value={typeFilter}
          onChange={(event) => {
            dispatch(setMediaTypeFilter(event.target.value as MediaTypeFilter));
          }}
        >
          <option value="all">All</option>
          <option value="image">
            Image
          </option>
          <option value="video">
            Video
          </option>
          <option value="document">
            Document
          </option>
        </select>
      </label>

      <label className={styles.field}>
        <span>Sort by</span>

        <select
          value={sort}
          onChange={(event) => {
            dispatch(setMediaSort(event.target.value as MediaSort));
          }}
        >
          <option value="date">
            Newest first
          </option>

          <option value="size">
            Largest first
          </option>
        </select>
      </label>
    </section>
  );
}