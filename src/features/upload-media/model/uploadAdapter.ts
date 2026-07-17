import { createEntityAdapter } from '@reduxjs/toolkit';

import type { UploadTask } from './types';

export const uploadAdapter = createEntityAdapter<UploadTask>();