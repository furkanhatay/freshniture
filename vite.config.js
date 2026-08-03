import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Absolute base: the site is served from the domain root (see vercel.json's catch-all
  // rewrite, which serves index.html's content for every path). A relative base would
  // resolve ./assets/... against whatever path is in the address bar — e.g. /collections —
  // breaking asset loading on any direct/bookmarked visit to a page other than "/".
  base: '/',
  server: { port: 5175, strictPort: true },
});
