import { createEntityAdapter } from '@reduxjs/toolkit';

import type { MediaItem } from '../types/media';

export const mediaAdapter = createEntityAdapter<MediaItem>();