import { INITIAL_ITEMS_COUNT, PAGE_SIZE } from './constants';
import { generateMedia } from './generator';

const media = generateMedia(INITIAL_ITEMS_COUNT);

export const database = {
  getPage(page: number) {
    const start = (page - 1) * PAGE_SIZE;

    const end = start + PAGE_SIZE;

    return {
      items: media.slice(start, end),
      nextPage:
        end < media.length
          ? page + 1
          : null,
      total: media.length
    }
  }
}