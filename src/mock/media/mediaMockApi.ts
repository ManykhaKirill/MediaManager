import { type MediaApi } from '@entities/media';
import { database } from './database';

const FETCH_FAILURE_RATE = 0.50;
const UPLOAD_FAILURE_RATE = 0.2;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    window.setTimeout(resolve, ms);
  })
}

async function simulateNetwork(): Promise<void> {
  await sleep(500 + Math.random() * 500);

  if (Math.random() < FETCH_FAILURE_RATE) {
    throw new Error('Network Error');
  }
}

function createAbortError(): DOMException {
  return new DOMException('Upload was cancelled','AbortError');
}

function simulateUpload(
  file: File,
  onProgress: (progress: number) => void,
  signal: AbortSignal
): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(createAbortError());
      return;
    }

    let progress = 0;

    const intervalId = window.setInterval(() => {
      const increment = Math.floor(Math.random() * 16) + 8;

      const nextProgress = Math.min(progress + increment,100);

      if (nextProgress < 100) {
        progress = nextProgress;
        onProgress(progress);

        return;
      }

      window.clearInterval(intervalId);

      signal.removeEventListener('abort',handleAbort);

      if (Math.random() < UPLOAD_FAILURE_RATE) {
        reject(new Error(`Failed to upload ${file.name}`));
        return
      }
      onProgress(100);
      resolve({url: URL.createObjectURL(file)})
    }, 250);

    function handleAbort() {
      window.clearInterval(intervalId)

      signal.removeEventListener('abort',handleAbort);

      reject(createAbortError());
    }

    signal.addEventListener('abort',handleAbort, {once: true} );
  })
}

export const mediaMockApi: MediaApi = {
  async fetchMediaPage(page) {
    await simulateNetwork();

    return database.getPage(page);
  },

  async uploadFile(file, onProgress, signal) {
    return simulateUpload(
      file,
      onProgress,
      signal
    )
  }
}