import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import url from 'node:url';

const _dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(_dirname, "./src"),
      "@app": path.resolve(_dirname, "./src/app"),
      "@entities": path.resolve(_dirname, "./src/entities"),
      "@features": path.resolve(_dirname, "./src/features"),
      "@pages": path.resolve(_dirname, "./src/pages"),
      "@shared": path.resolve(_dirname, "./src/shared"),
      "@widgets": path.resolve(_dirname, "./src/widgets"),
      "@mock": path.resolve(_dirname, "./src/mock"),
    },
  },
  plugins: [react()],
})
