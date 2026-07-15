import { type MediaApi } from '@entities/media/api/mediaApi';
import { database } from './database';

function sleep(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms),
  );
}

async function simulateNetwork() {
  await sleep(
    500 + Math.random() * 500,
  );

  if (Math.random() < 0.15) {
    throw new Error("Network Error");
  }
}

export const mediaMockApi: MediaApi = {
  async fetchMediaPage(page) {
    await simulateNetwork();

    return database.getPage(page);
  },

  async uploadFile() {
    throw new Error("Not implemented");
  },
};