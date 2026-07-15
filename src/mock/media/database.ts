import { type MediaItem } from "@entities/media";

import { generateMedia } from "./generator";

const PAGE_SIZE = 20;

const media = generateMedia(60);

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

      total: media.length,
    };
  },

  add(item: MediaItem) {
    media.unshift(item);
  },

  remove(id: string) {
    const index = media.findIndex(
      (item) => item.id === id,
    );

    if (index !== -1) {
      media.splice(index, 1);
    }
  },
};