import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative base so the build also works from a subfolder (e.g. example.com/catalogue/).
  base: './',
  server: { port: 5175, strictPort: true },
});
