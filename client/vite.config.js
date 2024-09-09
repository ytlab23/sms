// // vite.config.js
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://5sim.net/v1/guest',
//         changeOrigin: true,
//         secure: true, // Set to true if the target URL uses HTTPS
//         rewrite: (path) => path.replace(/^\/api/, ''),
//       },
//     },
//   },
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// TypeScript-compatible Vite configuration
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://5sim.net/v1/guest',
        changeOrigin: true,
        secure: true, // Set to true if the target URL uses HTTPS
        rewrite: (path) => path.replace(/^\/api/, ''), // Removes '/api' from the path
      },
    },
  },
  build: {
    outDir: 'dist', // Ensure thgat Vercel expects the output directory to be 'dist'
  },
});
