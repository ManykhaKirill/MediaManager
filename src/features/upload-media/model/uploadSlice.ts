import {createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { uploadAdapter } from './uploadAdapter';
import type { UploadTask } from './types';

const initialState = uploadAdapter.getInitialState();

const uploadSlice = createSlice({
  name: 'uploadMedia',
  initialState,
  reducers: {
    addUploadFiles(
      state,
      action: PayloadAction<UploadTask[]>
    ) {
      uploadAdapter.addMany(
        state,
        action.payload
      )
    },

    setUploadPreparing(
      state,
      action: PayloadAction<string>
    ) {
      uploadAdapter.updateOne(state, {
        id: action.payload,
        changes: {
          status: 'preparing',
          progress: 0,
          error: null
        }
      })
    },

    removeUploadTask(
      state,
      action: PayloadAction<string>
    ) {
      uploadAdapter.removeOne(
        state,
        action.payload
      )
    },

    setUploadPrepared(
      state,
      action: PayloadAction<{
        id: string
        thumbnailUrl: string
      }>
    ) {
      uploadAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          status: 'pending',
          progress: 0,
          error: null,
          thumbnailUrl:
            action.payload.thumbnailUrl
        }
      })
    },

    setUploadPreparationFailed(
      state,
      action: PayloadAction<{
        id: string
        message: string
      }>
    ) {
      uploadAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          status: 'error',
          progress: 0,
          error: action.payload.message
        }
      })
    },

    setUploadStarted(
      state,
      action: PayloadAction<string>
    ) {
      uploadAdapter.updateOne(state, {
        id: action.payload,
        changes: {
          status: 'uploading',
          progress: 0,
          error: null
        }
      })
    },

    setUploadProgress(
      state,
      action: PayloadAction<{
        id: string
        progress: number
      }>
    ) {
      uploadAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          progress:
            action.payload.progress
        }
      })
    },

    setUploadFailed(
      state,
      action: PayloadAction<{
        id: string
        message: string
      }>
    ) {
      uploadAdapter.updateOne(state, {
        id: action.payload.id,
        changes: {
          status: 'error',
          error: action.payload.message
        }
      })
    },

    resetUploadTask(
      state,
      action: PayloadAction<string>
    ) {
      uploadAdapter.updateOne(state, {
        id: action.payload,
        changes: {
          status: 'pending',
          progress: 0,
          error: null
        }
      })
    },
  }
})

export const {
  addUploadFiles,
  removeUploadTask,
  resetUploadTask,
  setUploadFailed,
  setUploadPreparing,
  setUploadPreparationFailed,
  setUploadPrepared,
  setUploadProgress,
  setUploadStarted
} = uploadSlice.actions;

export const uploadReducer = uploadSlice.reducer;