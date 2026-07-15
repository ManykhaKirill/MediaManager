import { combineReducers } from '@reduxjs/toolkit';

import { mediaReducer } from '@entities/media';

export const rootReducer = combineReducers({ media: mediaReducer });