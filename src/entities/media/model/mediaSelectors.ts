import type { RootState } from '@app/store/store';

import { mediaAdapter } from './mediaAdapter';

const adapterSelectors = mediaAdapter.getSelectors<RootState>((state) => state.media);

export const selectAllMedia = adapterSelectors.selectAll;

export const selectMediaById = adapterSelectors.selectById;

export const selectMediaPageRequest = (state: RootState) => state.media.pageRequest;

export const selectNextMediaPage = (state: RootState) => state.media.nextPage;

export const selectHasMoreMedia = (state: RootState) => state.media.nextPage !== null;

export const selectMediaTotal = (state: RootState) => state.media.total;