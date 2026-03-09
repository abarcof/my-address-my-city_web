import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// When building for GitHub Pages, BASE_PATH is set by the workflow (e.g. /my-address-my-city/)
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  base,
  plugins: [react()],
});
